

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

			div.toolbar__separator(v-mods="darkMode")

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
						p.export-menu__button(v-close-popover @click.left="exportToFile('png')") PNG
						p.export-menu__button(v-close-popover @click.left="exportToFile('jpg')") JPG
						p.export-menu__button(v-close-popover @click.left="exportToFile('svg')") SVG
						p.export-menu__button(v-close-popover @click.left="exportToFile('pdf')") PDF

	//----------------------------------------------------------------------
	//- Fretboard
	//----------------------------------------------------------------------
	FretboardViewer(:scalesInfos="activeScales")

	//----------------------------------------------------------------------
	//- Fretboard settings & scales
	//----------------------------------------------------------------------
	section.below-fretboard
		div.settings
			//- Instrument & tuning
			div.toolbar#help-tour-step--1
				VSelect.select-instrument(
					id="instrument"
					:options="instrumentOptions"
					v-model="instrumentModel"
					)
				VSelect.select-tuning(
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

						tooltip="active"
						:tooltip-formatter="tooltipFormatter"

						v-model="fretRangeModel"
						)
		//- Scales & arpeggios
		div.scales
			div.scales-list
				FretboardScale(
					v-for="scale in scales"
					:key="`scale--${scale.id}`"

					v-bind.sync="scale"
					:nbScales="scales.length"

					@toggle-focus-scale="toggleFocusScale"
					@duplicate-scale="duplicateScale"
					@remove-scale="removeScale"
					)
			p(v-show="scales.length == 0").
				Click on the #[fa-icon(:icon="['far', 'plus-circle']")] button to add a new scale or arpeggio.
			VButton(
				v-show="scales.length < maxNbScales"

				icon="plus-circle"
				tooltip="Add a new scale or arpeggio"
				@click="addScale"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapState, mapGetters } from 'vuex'
import { saveAs }               from 'file-saver'

import data                     from '@/modules/data'
import { mapObject }            from '@/modules/object'
import FretboardScale           from '@/components/FretboardScale'
import FretboardViewer          from '@/components/FretboardViewer'
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
			maxNbScales:       6,
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
				'#e1112c',
				'#ab7ef6',
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
		]),
		...mapGetters([
			'darkMode',
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
				data.instruments[this.instrument].nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				data.tunings[this.instrument][this.tuning],
				this.activeScales,
				this.isFretboardFlipped,
				this.isDisplayingNotesName,
				_format != 'svg',
			);

			/* eslint-disable */
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
			/* eslint-enable */
		},
		addScale()
		{
			// Limit the number of simultaneous scales
			if (this.scales.length == this.maxNbScales) return;

			this.scales.push({
				id:                      ++this.nextScaleID,
				color:                   this.nextColor,
				type:                    'scale',
				model:                   'maj',
				tonality:                'A',
				position:                0,
				highlightedNote:         null,
				isVisible:               true,
				isFocused:               false,
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

/**
 * Above the fretboard
 * -----------------------------------------------------------------------------
 */

.above-fretboard {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;

	position: relative;

	margin-bottom: 40px;
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

	&.dark-mode {
		background-color: $color-ebony-clay;
	}
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

/**
 * Below the fretboard
 * -----------------------------------------------------------------------------
 */
.below-fretboard {
	margin-top: 40px;
	@include space-children-v(40px);
}

.settings {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	@include space-children-h(20px);
}

.select-instrument { min-width: 180px; }
.select-tuning     { min-width: 230px; }

.frets-slider {
	width: 300px;
}

.scales {
	@include center-column;
	@include space-children-v(20px);
}

.scales-list {
	@include space-children-v(20px);
}

</style>
<!--}}}-->
