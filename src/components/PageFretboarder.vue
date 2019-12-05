

<!-- PageFretboarder.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.PageFretboarder

	//----------------------------------------------------------------------
	//- Tools & options
	//----------------------------------------------------------------------
	div.toolbar
		div.toolbar__settings
			//- Instrument
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
			//- Fret range
			div.frets-slider
				vue-slider(
					:min="0"
					:max="24"
					:interval="1"

					:min-range="4"
					:enable-cross="false"

					:direction="isFretboardFlipped ? 'rtl' : 'ltr'"
					adsorb lazy

					tooltip="always"
					:tooltip-formatter="tooltipFormatter"

					v-model="fretRangeModel"
					)

		div.toolbar__tools
			//- Toggle note names
			VButton(
				icon="info-circle"
				tooltip="Toggle note names"
				:is-active="isDisplayingNotesName"
				@click="toggleIsDisplayingNotesName"
				)
			//- Switch fretting hand
			VButton(
				icon="hand-paper"
				tooltip="Switch fretting hand"
				:is-flipped="!isFretboardFlipped"
				@click="toggleIsFretboardFlipped"
				)

			div.toolbar__tools__separator

			//- Clear the fretboard
			VButton(
				icon="eraser"
				tooltip="Clear the freatboard"
				@click="clearFretboard"
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
	FretboardViewer(
		:nb-strings="nbStrings"
		:fret-range="fretRange"
		:tuning="tunings[instrument][tuning]"
		:scales="activeScales"
		:displayed-info="isDisplayingNotesName ? 'name' : 'none'"
		:is-fretboard-flipped="isFretboardFlipped"
		)

	//----------------------------------------------------------------------
	//- Scales & arpeggios
	//----------------------------------------------------------------------
	div.scales
		FretboardScale.scales__item(
			v-for="scale in scales"
			:key="`scale--${scale.id}`"

			v-bind.sync="scale"
			:nbScales="scales.length"

			@toggle-focus-scale="toggleFocusScale"
			@duplicate-scale="duplicateScale"
			@remove-scale="removeScale"
			)
		VButton.scales__button-add(
			icon="plus-circle"
			tooltip="Add a new scale or arpeggio"
			@click="addScale"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { saveAs }             from 'file-saver'

import data                   from '@/modules/data'
import storage                from '@/modules/storage'
import { mapObject }          from '@/modules/object'
import FretboardScale         from '@/components/FretboardScale'
import FretboardViewer        from '@/components/FretboardViewer'
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
			tunings: data.tunings,
			colors:  [
				'#0194ef',
				'#1bb934',
				'#e54124',
				'#ffb610',
			],
		}
	},

	data() {
		return {
			instrument:             storage.get('instrument',             'guitar'),
			tuning:                 storage.get('tuning',                 'standard'),
			fretRange:              storage.get('fretRange',              [0, 22]),
			isDisplayingNotesName:  storage.get('isDisplayingNotesName',  false),
			isFretboardFlipped:     storage.get('isFretboardFlipped',     false),

			scales:       [],
			nextScaleID:  0,
		}
	},

	computed: {
		instrumentModel:
		{
			set(_v)
			{
				// Reset the tuning to default when switching between different instruments
				this.tuning     = 'standard';
				this.instrument = _v;

				storage.set('tuning',    'standard');
				storage.set('instrument', _v);
			},
			get() { return this.instrument; }
		},
		tuningModel:
		{
			set(_v)
			{
				this.tuning = _v;
				storage.set('tuning', _v);
			},
			get() { return this.tuning; }
		},
		fretRangeModel:
		{
			set(_v)
			{
				this.fretRange = _v;
				storage.set('fretRange', _v);
			},
			get() { return this.fretRange; }
		},
		instrumentOptions()
		{
			return mapObject(data.instruments, (_key, _instrument) => ({ name: _instrument.name, value: _key }));
		},
		tuningsOptions()
		{
			return mapObject(this.tunings[this.instrument], _key => ({ name: data.tuningsNames[_key], value: _key }));
		},
		nbStrings()
		{
			return data.instruments[this.instrument].nbStrings;
		},
		activeScales()
		{
			return this.scales.filter(this.scales.some(_scale => _scale.isFocused)
				? _scale => _scale.isFocused
				: _scale => _scale.isVisible);
		},
	},

	mounted() {
		this.addScale();
	},

	methods: {
		toggleIsDisplayingNotesName()
		{
			storage.set('isDisplayingNotesName', this.isDisplayingNotesName = !this.isDisplayingNotesName);
		},
		toggleIsFretboardFlipped()
		{
			storage.set('isFretboardFlipped', this.isFretboardFlipped = !this.isFretboardFlipped);
		},
		clearFretboard()
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
			this.scales.push({
				id:                  ++this.nextScaleID,
				type:                'scale',
				model:               'maj',
				tonality:            'A',
				color:               this.colors[this.scales.length % this.colors.length],
				isVisible:           true,
				isFocused:           false,
				isShowingRootNotes:  false,
			});
		},
		duplicateScale(_id)
		{
			const newScale = {...this.scales.filter(__scale => __scale.id == _id)[0]};

			newScale.id        = ++this.nextScaleID;
			newScale.color     = this.colors[this.scales.length % this.colors.length];
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
	padding: 40px;
	@include space-children-v(80px);
}

.toolbar {
	display: flex;
}

.toolbar__tools,
.toolbar__settings {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.toolbar__settings {
	flex: 1 1 100%;
}

.toolbar__tools__separator {
	@include circle(6px);
	background-color: lightgray;
}

.frets-slider {
	min-width: 350px;

	margin: 0 20px;
}

.scales {
	@include space-children-v(20px);
}

.scales__item {
	max-width: 660px;

	margin: auto;
}

.scales__button-add {
	margin: auto;
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

</style>
<!--}}}-->


<!--{{{ Styling for components -->
<style lang='scss'>

// Load the styles for the slider & set the theme color
$themeColor: steelblue;
@import '~vue-slider-component/lib/theme/default';

</style>
<!--}}}-->
