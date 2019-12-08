

<!-- PageFretboarder.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.PageFretboarder

	section.above-fretboard
		//- Current tuning
		p.tuning {{ tuningNotesList }}

		//- Infos on the hovered fret
		div.fret-infos(
			v-mods="{ isVisible: hoveredFretInfos.length > 0 }"
			)
			div.fret-infos__item(
				v-for="(info, index) in hoveredFretInfos"
				:key="`fret-info--${index}`"
				)
				div.fret-infos__item__color-dot(
					v-for="color in info.colors"
					:key="`fret-info--${index}-color--${color}`"
					:style="{ 'background-color': color }"
					)
				p {{ info.interval }}

		//----------------------------------------------------------------------
		//- Tools & display options
		//----------------------------------------------------------------------
		div.toolbar
			//- Switch between themes
			VButton(
				icon="adjust"
				:tooltip="isDarkModeOn ? 'Switch to light mode' : 'Switch to dark mode'"
				@click="$store.commit('toggleIsDarkModeOn')"
				)
			//- Toggle note names
			VButton(
				icon="info-circle"
				:tooltip="!isDisplayingNotesName ? 'Show note names' : 'Hide note names'"
				:is-active="isDisplayingNotesName"
				@click="$store.commit('toggleIsDisplayingNotesName')"
				)
			//- Switch fretting hand
			VButton(
				icon="hand-paper"
				:tooltip="isFretboardFlipped ? 'Switch to left-handed fretting' : 'Switch to right-handed fretting'"
				:is-flipped="!isFretboardFlipped"
				@click="$store.commit('toggleIsFretboardFlipped')"
				)

			div.toolbar__separator

			//- Clear the fretboard
			VButton(
				icon="eraser"
				tooltip="Clear the freatboard"
				@click="clear"
				)

			//- Export the fretboard
			div#canvas-wrapper
			v-popover
				VButton(
					icon="file-download"
					tooltip="Export the fretboard image"
					)
				template(slot="popover")
					div.export-menu
						div.export-menu__button: p(v-close-popover @click.left="exportToFile('png')") PNG
						div.export-menu__button: p(v-close-popover @click.left="exportToFile('jpg')") JPG
						div.export-menu__button: p(v-close-popover @click.left="exportToFile('svg')") SVG
						div.export-menu__button: p(v-close-popover @click.left="exportToFile('pdf')") PDF

	//----------------------------------------------------------------------
	//- Fretboard
	//----------------------------------------------------------------------
	FretboardViewer.fretboard(:scalesInfos="activeScales")

	//----------------------------------------------------------------------
	//- Fretboard settings & scales
	//----------------------------------------------------------------------
	section.below-fretboard

		//- Instrument & tuning
		div.toolbar
			VSelect(
				id="instrument"
				:options="instrumentOptions"
				v-model="instrumentModel"
				)
			VSelect(
				id="tuning"
				:options="tuningsOptions"
				v-model="tuningModel"
				)

		//- Frets range
		div.toolbar
			div.frets-slider
				vue-slider(
					:min="0"
					:max="24"
					:interval="1"

					:min-range="4"
					:enable-cross="false"

					:direction="isFretboardFlipped ? 'rtl' : 'ltr'"
					adsorb lazy

					tooltip="focus"
					tooltip-placement="bottom"
					:tooltip-formatter="tooltipFormatter"

					v-model="fretRangeModel"
					)

		//- Scales & arpeggios
		div.scales
			FretboardScale.scales__item(
				v-for="scale in scales"
				:key="`scale--${scale.id}`"

				v-bind.sync="scale"
				:nbScales="scales.length"

				v-mods="{ isAlone: scales.length == 1 }"

				@toggle-focus-scale="toggleFocusScale"
				@duplicate-scale="duplicateScale"
				@remove-scale="removeScale"
				)
			VButton.scales__button-add(
				v-show="scales.length < maxNbScales"

				icon="plus-circle"
				tooltip="Add a new scale or arpeggio"
				@click="addScale"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapState }    from 'vuex'
import { saveAs }      from 'file-saver'

import data            from '@/modules/data'
import { mapObject }   from '@/modules/object'
import FretboardScale  from '@/components/FretboardScale'
import FretboardViewer from '@/components/FretboardViewer'
import {
	exportSVGToPDF,
	exportSVGToImage,
	exportFretboardToSVG,
} from '@/modules/export'

export default {
	name: 'PageFretboarder',

	components: {
		FretboardScale,
		FretboardViewer,
	},

	static() {
		return {
			maxNbScales:       4,
			instrumentOptions: mapObject(data.instruments, (_key, _instrument) => ({ name: _instrument.name, value: _key })),
		}
	},

	data() {
		return {
			scales:       [],
			nextScaleID:  0,
		}
	},

	computed: {
		activeScales()
		{
			return this.scales.filter(this.scales.some(_scale => _scale.isFocused)
				? _scale => _scale.isFocused
				: _scale => _scale.isVisible);
		},
		tuningsOptions()
		{
			return mapObject(data.tunings[this.instrument], _key => ({ name: data.tuningsNames[_key], value: _key }));
		},
		tuningNotesList()
		{
			return data.tuningsNames[this.tuning]
			     + ` (${data.tunings[this.instrument][this.tuning].map(_note => data.tonalities[_note]).join(', ')})`;
		},
		nextColor()
		{
			return [
				'#0093ee',
				'#1bb934',
				'#e54124',
				'#ffb610',
			].filter(_color => !this.scales.some(__scale => __scale.color == _color))[0];
		},
		instrumentModel:
		{
			set(_v)
			{
				// Reset the tuning to default when switching between different instruments
				this.$store.commit('setTuning',      'standard');
				this.$store.commit('setInstrument',  _v);
			},
			get()   { return this.$store.state.instrument;    },
		},
		tuningModel:
		{
			set(_v) { this.$store.commit('setTuning', _v);    },
			get()   { return this.$store.state.tuning;        },
		},
		fretRangeModel:
		{
			set(_v) { this.$store.commit('setFretRange', _v); },
			get()   { return this.$store.state.fretRange;     },
		},

		...mapState([
			'instrument',
			'tuning',
			'fretRange',

			'isDarkModeOn',
			'isDisplayingNotesName',
			'isFretboardFlipped',

			'hoveredFretInfos',
		])
	},

	mounted() {
		this.addScale();
	},

	methods: {
		clear()
		{
			this.scales = [];
		},
		exportToFile(_format)
		{
			const svg = exportFretboardToSVG(
				this.nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				this.tunings[this.instrument][this.tuning],
				this.activeScales,
				this.isFretboardFlipped,
				true,
				_format != 'svg',
			);

			switch (_format)
			{
				case 'png':
				case 'jpg':
					exportSVGToImage(svg, _format);
					break;

				case 'svg':
					saveAs(svg.blob, 'fretboard.svg');
					break;

				case 'pdf':
					exportSVGToPDF(svg);
					break;
			}
		},
		addScale()
		{
			// Limit the number of simultaneous scales
			if (this.scales.length == this.maxNbScales) return;

			this.scales.push({
				id:                      ++this.nextScaleID,
				type:                    'scale',
				model:                   'maj',
				tonality:                'A',
				color:                   this.nextColor,
				isVisible:               true,
				isFocused:               false,
				isShowingRootNotes:      false,
				isShowingIntersections:  false,
			});
		},
		duplicateScale(_id)
		{
			// Limit the number of simultaneous scales
			if (this.scales.length == this.maxNbScales) return;

			const newScale = {...this.scales.filter(__scale => __scale.id == _id)[0]};

			newScale.id        = ++this.nextScaleID;
			newScale.color     = this.nextColor;
			newScale.isFocused = false;

			this.scales.push(newScale);
		},
		removeScale(_id)
		{
			this.scales = this.scales.filter(__scale => __scale.id != _id);
		},
		toggleFocusScale(_id)
		{
			this.scales.forEach(__scale => __scale.isFocused = (__scale.id == _id && !__scale.isFocused));
		},
		tooltipFormatter(_number)
		{
			if (_number == 0)
				return 'Open strings';

			if (11 <= _number && _number <= 13)
				return `${_number}th fret`;

			switch (`${_number}`.slice(-1))
			{
				case '1': return `${_number}st fret`;
				case '2': return `${_number}nd fret`;
				case '3': return `${_number}rd fret`;
				default:  return `${_number}th fret`;
			}
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.PageFretboarder {
}

.above-fretboard {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;

	position: relative;
}

.tuning {
	color: gray;
}

.fret-infos {
	display: flex;
	@include space-children-h(10px);

	opacity: 0;
	@include center-position;

	transition: opacity 0.2s;

	&.is-visible {
		opacity: 1;
	}
}

.fret-infos__item {
	display: flex;
	align-items: center;
	@include space-children-h(5px);
}

.fret-infos__item__color-dot {
	@include circle(10px);
}

.toolbar {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	@include space-children-h(10px);
}

.toolbar__separator {
	@include circle(6px);
	background-color: lightgray;
}

#canvas-export,
#canvas-wrapper {
	display: none;
}

.export-menu {
	display: grid;
	grid-template-rows: 1fr 1fr;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;

	padding: 5px;
}

.export-menu__button {
	font-weight: bold;

	cursor: pointer;

	transition: color 0.2s;

	&:hover {
		color: $color-azure;
	}
}

.fretboard {
	margin: 40px 0 80px 0;
}

.below-fretboard {
	position: relative;
}


.frets-slider {
	width: 300px;

	margin-top: 20px;
}

.scales {
	@include space-children-v(20px);

	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
}

.scales__item {
	width: 660px;

	&.is-alone {
		width: 600px;
	}
}

.scales__button-add {
	margin: auto;
}

</style>
<!--}}}-->


<!--{{{ Styling for components -->
<style lang='scss'>

// Load the styles for the slider & set the theme color
$themeColor: steelblue;
@import '~vue-slider-component/lib/theme/default';

</style>
<!--}}}-->
