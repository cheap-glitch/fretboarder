

<!-- components/FretboardSettings.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSettings

	//- Instrument & tuning
	VSelect(
		:options="instrumentOptions"
		v-model="instrument"
		)
	VSelect(
		:options="tuningsOptions"
		v-model="tuning"
		)

	//- Frets range
	//- div.slider-frets-range: vue-slider(
		:min="0"
		:max="24"
		:interval="1"

		:min-range="4"
		:enable-cross="false"

		:direction="isFretboardFlipped ? 'rtl' : 'ltr'"
		adsorb lazy

		:tooltip="isMobileDevice ? 'none' : 'hover'"
		tooltip-placement="top"
		:tooltip-formatter="tooltipFormatter"

		v-model="fretRange"
		)

		//- div.toolbar
			//- Toggle fret numbers
			VButton(
				:icon="['fal', 'list-ol']"
				:tooltip="!isDisplayingFretNbs ? 'Show fret numbers' : 'Hide fret numbers'"
				:is-active="isDisplayingFretNbs"
				@click="$store.commit('fretboard/toggleIsDisplayingFretNbs')"
				)
			//- Toggle note names
			VButton(
				icon="info-circle"
				:tooltip="!isDisplayingNotesName ? 'Show note names' : 'Hide note names'"
				:is-active="isDisplayingNotesName"
				@click="$store.commit('fretboard/toggleIsDisplayingNotesName')"
				)
			//- Switch fretting hand
			VButton(
				icon="hand-paper"
				:tooltip="isFretboardFlipped ? 'Switch to left-handed fretting' : 'Switch to right-handed fretting'"
				:is-flipped="!isFretboardFlipped"
				@click="$store.commit('fretboard/toggleIsFretboardFlipped')"
				)
			//- Toggle dark mode (mobile only)
			VButton(
				v-if="isMobileDevice"

				icon="moon"
				tooltip="Toggle dark mode"
				:is-active="isDarkModeOn"
				@click="$store.commit('toggleIsDarkModeOn')"
				)
			//- Export the fretboard
			div#canvas-wrapper
			VButton#button-export-menu(
				v-if="!isMobileDevice"

				icon="file-download"
				:is-active="isExportMenuOpened"

				tooltip="Export the fretboard image"
				:is-tooltip-disabled="isExportMenuOpened"

				@click="isExportMenuOpened = !isExportMenuOpened"
				)

	//- Export menu
	//- VTooltip(
		v-if="!isMobileDevice"

		target="button-export-menu"
		placement="bottom"
		:is-open="isExportMenuOpened"

		v-click-outside="closeExportMenu"
		)
		div
			p.export-menu__text
				strong Choose a format to export in
			p.export-menu__text
				em
					| If you want to print this  fretboard, choose PNG or JPG.
					| The SVG format is most useful for embedding in web pages as it will scale perfectly when resized.
			div.export-menu__buttons
				each format in ['png', 'jpg', 'svg']
					button.button.is-filled(@click.left=`exportFretboardToFile('${format}')`)
						p.button__text= format.toUpperCase()

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }                          from 'vuex-pathify'

//- import { exportFretboard }                    from '@/modules/export'
import { instruments, tunings, tuningsNames } from '@/modules/music'

export default {
	name: 'FretboardSettings',

	//- data() {
	//- 	return {
	//- 		isExportMenuOpened: false,
	//- 	}
	//- },

	computed: {
		tuningsOptions()
		{
			return Object.keys(tunings[this.instrument]).map(key => ({ name: tuningsNames[key], value: key }));
		},
		...sync('fretboard', [
			'instrument',
			'tuning',
			'fretRange',
		]),
		...get('fretboard', [
			'isDisplayingFretNbs',
			'isDisplayingNotesName',
			'isFretboardFlipped',
		]),
		...get([
			'isDarkModeOn',
			'isMobileDevice',
		]),
	},

	created()
	{
		this.instrumentOptions = Object.keys(instruments).map(key => ({ name: instruments[key].name, value: key }));
	},

	mounted()
	{
		this.buttonExportMenu  = document.getElementById('button-export-menu');
	},

	/*
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
			// Close the export menu tooltip
			this.isExportMenuOpened = false;

			// Export the fretboard to the select format and trigger a download of the resulting file
			exportFretboard(
				format,
				instruments[this.instrument].nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				tunings[this.instrument][this.tuning],
				this.$store.getters['scales/activeScales'],
				this.isFretboardFlipped,
				this.isDisplayingNotesName,
				this.isDarkModeOn,
				format != 'svg',
			);
		},
		closeExportMenu(event)
		{
			if (!this.buttonExportMenu.contains(event.target))
				this.isExportMenuOpened = false;
		},
	},
	*/
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardSettings {
	@include space-children-h(10px);
}

//- /**
//-  * Layout
//-  * -----------------------------------------------------------------------------
//-  */

//- .settings {
//- 	border-top: 1px solid var(--color--border);
//- }

//- .toolbar {
//- 	display: grid;
//- 	grid-template: 1fr 1fr / 1fr 1fr;
//- }

//- @include mq($from: 400px)
//- {
//- 	.settings {
//- 		display: grid;
//- 		grid-template-areas: "instrument tuning"
//- 		                     "slider     slider";
//- 	}

//- 	.toolbar {
//- 		grid-template: 1fr / repeat(4, 1fr);
//- 	}
//- }

//- @include mq($from: desktop)
//- {
//- 	.wrapper {
//- 		display: flex;
//- 		justify-content: space-between;
//- 	}

//- 	.toolbar,
//- 	.settings {
//- 		display: flex;
//- 		align-items: center;
//- 		@include space-children-h(10px);

//- 		border: none;
//- 	}
//- }

//- /**
//-  * Tools & settings
//-  * -----------------------------------------------------------------------------
//-  */

//- @include mq($until: desktop)
//- {
//- 	.select-instrument  { grid-area: instrument; }
//- 	.select-tuning      { grid-area: tuning;     }
//- 	.slider-frets-range { grid-area: slider;     }

//- 	.VButton            { padding: 20px;         }
//- 	.slider-frets-range { padding: 20px 40px;    }

//- 	.VButton,
//- 	.select-tuning,
//- 	.select-instrument,
//- 	.slider-frets-range {
//- 		border-bottom: 1px solid var(--color--border);
//- 	}

//- 	@include mq($until: 400px)
//- 	{
//- 		.VButton:nth-child(2),
//- 		.VButton:nth-child(4) {
//- 			border-left: 1px solid var(--color--border);
//- 		}
//- 	}

//- 	@include mq($from: 400px)
//- 	{
//- 		.select-tuning,
//- 		.VButton:not(:first-child) {
//- 			border-left: 1px solid var(--color--border);
//- 		}
//- 	}
//- }

//- @include mq($from: desktop)
//- {
//- 	.select-instrument {
//- 		min-width: 180px;
//- 	}

//- 	.select-tuning {
//- 		min-width: 260px;
//- 	}

//- 	.slider-frets-range {
//- 		width: 300px;

//- 		margin-left: 10px;
//- 	}
//- }

//- /**
//-  * Export menu
//-  * -----------------------------------------------------------------------------
//-  */

//- .export-menu__text {
//- 	max-width: 300px;

//- 	font-size: 1.6rem;

//- 	&:first-of-type {
//- 		margin-bottom: 10px;
//- 	}
//- }

//- .export-menu__buttons {
//- 	display: flex;
//- 	justify-content: center;
//- 	@include space-children-h(10px);

//- 	margin-top: 40px;
//- }

//- .button,
//- .button__text {
//- 	cursor: pointer;
//- }

//- .button {
//- 	padding: 6px;

//- 	appearance: none;
//- 	background-image: none;

//- 	border: 2px solid var(--color--bg--tooltip);
//- 	border-radius: 6px;

//- 	background-color: var(--color--bg--tooltip);

//- 	transition: border-color 0.2s, background-color 0.2s;

//- 	&.is-filled,
//- 	&:not(.is-filled):hover {
//- 		border-color: white;
//- 	}

//- 	&.is-filled:hover {
//- 		background-color: white;

//- 		.button__text {
//- 			color: var(--color--bg--tooltip);
//- 		}
//- 	}
//- }

//- .button__text {
//- 	color: white;
//- }

//- #canvas-wrapper {
//- 	display: none;
//- }

</style>
<!--}}}-->
