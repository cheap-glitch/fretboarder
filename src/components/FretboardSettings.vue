

<!-- components/FretboardSettings.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSettings

	div.wrapper

		div.toolbar
			//- Instrument & tuning
			div.toolbar#help-tour-step--1
				VSelect.select-instrument(
					id="instrument"
					:options="instrumentOptions"
					v-model="instrument"
					)
				VSelect.select-tuning(
					id="tuning"
					:options="tuningsOptions"
					v-model="tuning"
					)

			//- Frets range
			div.fret-range-slider#help-tour-step--2: vue-slider(
				:min="0"
				:max="24"
				:interval="1"

				:min-range="4"
				:enable-cross="false"

				:direction="isFretboardFlipped ? 'rtl' : 'ltr'"
				adsorb lazy

				tooltip="hover"
				tooltip-placement="top"
				:tooltip-formatter="tooltipFormatter"

				v-model="fretRange"
				@mousedown.left.native="$store.commit('setIsFretRangeSliderClicked', true)"
				)

		div.toolbar
			//- Toggle fret numbers
			VButtonIcon(
				:icon="['fal', 'list-ol']"
				:tooltip="!isDisplayingFretNbs ? 'Show fret numbers' : 'Hide fret numbers'"
				:is-active="isDisplayingFretNbs"
				@click="$store.commit('toggleIsDisplayingFretNbs')"
				)
			//- Toggle note names
			VButtonIcon#help-tour-step--3(
				icon="info-circle"
				:tooltip="!isDisplayingNotesName ? 'Show note names' : 'Hide note names'"
				:is-active="isDisplayingNotesName"
				@click="$store.commit('toggleIsDisplayingNotesName')"
				)
			//- Switch fretting hand
			VButtonIcon(
				icon="hand-paper"
				:tooltip="isFretboardFlipped ? 'Switch to left-handed fretting' : 'Switch to right-handed fretting'"
				:is-flipped="!isFretboardFlipped"
				@click="$store.commit('toggleIsFretboardFlipped')"
				)
			//- Export the fretboard
			div#canvas-wrapper
			VButtonIcon#button-export-menu(
				icon="file-download"
				tooltip="Export the fretboard image"
				:is-tooltip-disabled="isExportMenuOpened"

				@click="isExportMenuOpened = !isExportMenuOpened"
				)

	//- Export menu
	VTooltip(
		target="button-export-menu"
		placement="bottom"
		:is-open="isExportMenuOpened"

		v-click-outside="closeExportMenu"
		)
		div
			p.export-menu__text
				strong Choose a format to export in
			p.export-menu__text
				em If you want to print this  fretboard, choose PDF. The SVG format is useful for embedding in web pages as it will scale perfectly when resized.
			div.export-menu__buttons
				VButtonText.export-menu__buttons__item(
					v-for="format in ['png', 'jpg', 'svg', 'pdf']"
					:key="`export-button--${format}`"

					:text="format.toUpperCase()"
					is-filled

					@click.native.left="exportFretboardToFile(format)"
					)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }        from 'vuex-pathify'
import { saveAs }           from 'file-saver'

import data                 from '@/modules/data'
import { objectMap }        from '@/modules/object'
import * as exportFretboard from '@/modules/export'

export default {
	name: 'FretboardSettings',

	data() {
		return {
			isExportMenuOpened: false,
		}
	},

	computed: {
		tuningsOptions()
		{
			return objectMap(data.tunings[this.instrument], key => ({ name: data.tuningsNames[key], value: key }));
		},
		...sync([
			'instrument',
			'tuning',
			'fretRange',
		]),
		...get([
			'scales/activeScales',

			'isDarkModeOn',
			'isDisplayingNotesName',
			'isDisplayingFretNbs',
			'isFretboardFlipped',
		]),
	},

	created()
	{
		this.instrumentOptions = objectMap(data.instruments, (key, instrument) => ({ name: instrument.name, value: key }));
	},

	mounted()
	{
		this.buttonExportMenu  = document.getElementById('button-export-menu');
	},

	methods: {
		tooltipFormatter(number)
		{
			if (number == 0)
				return 'Open strings';

			if (11 <= number && number <= 13)
				return `${number}th fret`;

			switch (`${number}`.slice(-1))
			{
				case '1': return `${number}st fret`;
				case '2': return `${number}nd fret`;
				case '3': return `${number}rd fret`;
				default:  return `${number}th fret`;
			}
		},
		exportFretboardToFile(format)
		{
			// Close the export menu tootlip
			this.isExportMenuOpened = false;

			const svg = exportFretboard.exportFretboardToSVG(
				data.instruments[this.instrument].nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				data.tunings[this.instrument][this.tuning],
				this.activeScales,
				this.isFretboardFlipped,
				this.isDisplayingNotesName,
				format != 'svg',
			);

			switch (format)
			{
				case 'png':
				case 'jpg':
					exportFretboard.exportSVGToImage(svg, format);
					break;

				case 'svg':
					saveAs(svg.blob, 'fretboard.svg');
					break;

				case 'pdf':
					exportFretboard.exportSVGToPDF(svg);
					break;
			}
		},
		closeExportMenu(event)
		{
			if (!this.buttonExportMenu.contains(event.target))
				this.isExportMenuOpened = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/colors' as *;

.wrapper {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}

.toolbar {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.select-instrument { min-width: 180px; }
.select-tuning     { min-width: 260px; }

.fret-range-slider {
	width: 300px;

	margin-left: 10px;
}

.export-menu__text {
	max-width: 300px;

	font-size: 1.6rem;

	&:first-of-type {
		margin-bottom: 10px;
	}
}

.export-menu__buttons {
	display: flex;
	justify-content: center;
	@include space-children-h(10px);

	margin-top: 40px;
}

.export-menu__buttons__item {
	color: white;
	border-color: white;
	background-color: white;

	&:hover {
		color: $color--slate-gray;
	}
}

#canvas-export,
#canvas-wrapper {
	display: none;
}

</style>
<!--}}}-->
