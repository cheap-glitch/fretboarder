

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
	vue-slider.slider-frets-range(
		:min="0"
		:max="24"
		:interval="1"

		:min-range="4"
		:enable-cross="false"

		:direction="isFlipped ? 'rtl' : 'ltr'"
		adsorb lazy

		:tooltip="isMobileDevice ? 'none' : 'hover'"
		tooltip-placement="top"
		:tooltip-formatter="tooltipFormatter"

		v-model="fretRange"
		)

	div.buttons
		//- Toggle fret numbers
		VButton(
			:icon="['fal', 'list-ol']"
			size="big"
			:is-active="isShowingFretNbs"

			tooltip-text="Toggle fret numbers"
			title="Frets"

			@click="$store.commit('fretboard/toggle.isShowingFretNbs')"
			)
		//- Toggle note names
		VButton(
			icon="info-circle"
			size="big"
			:is-active="isShowingNoteNames"

			tooltip-text="Toggle note names"
			title="Notes"

			@click="$store.commit('fretboard/toggle.isShowingNoteNames')"
			)
		//- Switch fretting hand
		VButton(
			icon="hand-paper"
			size="big"
			:is-flipped="!isFlipped"

			tooltip-text="Switch fretting hand"
			title="Flip"

			@click="$store.commit('fretboard/toggle.isFlipped')"
			)
		//- Export the fretboard
		div#canvas-wrapper
		VButton(
			v-if="!isMobileDevice"
			ref="buttonExport"

			icon="file-download"
			size="big"
			:is-active="isExportMenuOpened"
			tooltip-text="Export the fretboard image"
			:is-tooltip-disabled="isExportMenuOpened"

			@click="isExportMenuOpened = !isExportMenuOpened"
			)

		//- Export menu
		VTooltip(
			:target="!!$refs.buttonExport ? $refs.buttonExport.$refs.button || false : false"
			placement="bottom"
			:is-open="!isMobileDevice && isExportMenuOpened"

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
						button.button.is-filled(@click.left=`exportFretboardToFile('${format}')`): p.button__text= format.toUpperCase()

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }                          from 'vuex-pathify'

import { exportFretboard }                    from '@/modules/export'
import { instruments, tunings, tuningsNames } from '@/modules/music'

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
			return Object.keys(tunings[this.instrument]).map(key => ({ name: tuningsNames[key], value: key }));
		},
		...sync('fretboard', [
			'instrument',
			'tuning',
			'fretRange',
		]),
		...get('fretboard', [
			'isShowingFretNbs',
			'isShowingNoteNames',
			'isFlipped',
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
				this.$store.getters['scales/displayedScales'],
				this.instrument,
				this.tuning,
				this.fretRange[0],
				this.fretRange[1],
				this.isFlipped,
				this.isShowingNoteNames,
				this.isShowingFretNbs,
				this.isDarkModeOn,
				format != 'svg',
			);
		},
		closeExportMenu(event)
		{
			if (!this.$refs.buttonExport.$refs.button.contains(event.target))
				this.isExportMenuOpened = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardSettings {
	@include mq($until: desktop)
	{
		@include space-children-v(40px);
	}

	@include mq($from: desktop)
	{
		display: grid;
		grid-template: 1fr / auto auto 300px 1fr;

		@include space-children-h(10px);
	}
}

.slider-frets-range {
	align-self: center;
	margin-left: 10px;
}

.buttons {
	display: flex;

	.VButton {
		flex: 1 1 100%;
	}

	@include mq($from: desktop)
	{
		@include space-children-h(12px);
		justify-self: end;
	}
}

.export-menu__text {
	max-width: 300px;

	font-size: 1.6rem;
	text-align: justify;

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

.button {
	padding: 6px;

	appearance: none;
	background-image: none;

	border: 2px solid white;
	border-radius: 6px;

	background-color: var(--color--bg--tooltip);

	transition: border-color 0.2s, background-color 0.2s;

	cursor: pointer;

	&:hover {
		background-color: white;
	}
}

.button__text {
	color: white;
	cursor: pointer;

	.button:hover & { color: var(--color--bg--tooltip); }
}

#canvas-wrapper {
	display: none;
}

//- /**
//-  * Layout
//-  * -----------------------------------------------------------------------------
//-  */

//- .settings {
//- 	border-top: 1px solid var(--color--border);
//- }

//- .buttons {
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

//- 	.buttons {
//- 		grid-template: 1fr / repeat(4, 1fr);
//- 	}
//- }

//- @include mq($from: desktop)
//- {
//- 	.wrapper {
//- 		display: flex;
//- 		justify-content: space-between;
//- 	}

//- 	.buttons,
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

//- }

</style>
<!--}}}-->
