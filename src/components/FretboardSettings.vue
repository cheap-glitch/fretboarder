

<!-- components/FretboardSettings.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSettings
	//- Instrument settings
	component(
		:is="isMobileDevice ? 'div' : 'VPopupMenu'"

		icon="guitar"
		title="Instrument settings"
		)
		div.instrument-settings
			//- Instrument
			VSelect(
				:options="instruments"
				v-model="instrument"
				)
			//- Tuning
			VSelect(
				:options="tunings"
				v-model="tuning"
				)
			//- Fret range
			VMultiRange(
				:min="0"
				:max="MAX_NB_FRETS"
				:min-gap="MIN_NB_FRETS"
				v-model="fretRange"
				)
			p.fret-range-text(v-html="formatFretNb(fretRange[0]) + '&nbsp;—&nbsp;' + formatFretNb(fretRange[1])")
			//- Switch fretting hand
			VButton(
				icon="hand-paper"
				title="Switch hand"

				:is-flipped="!isFlipped"
				@click="$store.commit('fretboard/toggle.isFlipped')"
			)

	//- Toggle fret numbers
	VButton(
		:icon="['fal', 'list-ol']"
		title="Show numbers"

		:is-active="isShowingFretNbs"
		@click="$store.commit('fretboard/toggle.isShowingFretNbs')"
		)

	//- Toggle note names
	VButton(
		icon="info-circle"
		title="Show notes"

		:is-active="isShowingNoteNames"
		@click="$store.commit('fretboard/toggle.isShowingNoteNames')"
		)

	//- Export the fretboard
	VPopupMenu(
		v-if="!isMobileDevice"

		icon="file-download"
		title="Export"
		)
		div.export-menu
			div.export-menu__text
				p: strong Choose a format to export in
				p: em
					| If you want to print this  fretboard, choose PNG or JPG.
					| The SVG format is most useful for embedding in web pages as it will scale perfectly when resized.
			div.export-menu__buttons
				each format in ['png', 'jpg', 'svg']
					VButton(
						icon=(format == 'svg' ? 'file-image' : 'image-polaroid')
						title=format.toUpperCase()
						@click.left=`exportFretboard('${format}')`
						)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }                          from 'vuex-pathify'

import { MIN_NB_FRETS, MAX_NB_FRETS }         from '@/modules/constants'
import { mapObjectToObject }                  from '@/modules/object'
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
		tunings()
		{
			return mapObjectToObject(tunings[this.instrument], tuning => tuningsNames[tuning]);
		},
		...sync('fretboard', [
			'instrument',
			'tuning',
			'fretRange',
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
		this.instruments  = instruments;
		this.MIN_NB_FRETS = MIN_NB_FRETS;
		this.MAX_NB_FRETS = MAX_NB_FRETS;
	},

	methods: {
		exportFretboard(format)
		{
			// Close the export menu tooltip
			this.isExportMenuOpened = false;

			// Export the fretboard to the select format and trigger a download of the resulting file
			exportFretboard(
				format,
				this.$store.state.sequences.sequences,
				this.$store.getters['sequences/displayedSequences'],
				tunings[this.instrument][this.tuning],
				instruments[this.instrument].nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				this.isFlipped,
				this.isShowingNoteNames,
				this.isShowingFretNbs,
				this.isDarkModeOn,
				format != 'svg',
			);
		},
		formatFretNb(number)
		{
			if (number == 0)
				return 'Open strings';

			if (11 <= number && number <= 13)
				return `${number}<sup>th</sup> fret`;

			switch (`${number}`.slice(-1))
			{
				case '1': return `${number}<sup>st</sup> fret`;
				case '2': return `${number}<sup>nd</sup> fret`;
				case '3': return `${number}<sup>rd</sup> fret`;
				default:  return `${number}<sup>th</sup> fret`;
			}
		},
	}
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
		display: flex;
		@include space-children-h(10px);
	}
}

.instrument-settings {
	@include center-column;
	@include space-children-v(20px);
}

.fret-range-text {
	color: var(--color--text);
}

.export-menu {
	@include space-children-v(20px);
}

.export-menu__text {
	@include space-children-v(10px);

	max-width: 300px;

	font-size: 1.6rem;
	text-align: justify;

	color: var(--color--text);
}

.export-menu__buttons {
	display: flex;
	justify-content: center;
	@include space-children-h(10px);
}

/*
.settings {
	@include mq($until: desktop)
	{
		@include center-column;
		@include space-children-v(20px);
	}

	@include mq($from: desktop)
	{
		display: flex;
		align-items: center;
		@include space-children-h(10px);

		flex: 0 0 auto;
	}
}

.tools {
	@include mq($until: desktop)
	{
		@include center-column;
		@include space-children-v(20px);
	}

	@include mq($from: desktop)
	{
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;

		.VButton { margin: 10px 0 0 10px; }
	}
}
*/

</style>
<!--}}}-->
