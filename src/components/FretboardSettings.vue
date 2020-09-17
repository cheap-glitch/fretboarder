

<!-- components/FretboardSettings.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSettings

	//----------------------------------------------------------------------
	//- Instrument settings
	//----------------------------------------------------------------------
	component(
		:is="isMobileDevice ? 'div' : 'VPopupMenu'"

		icon="guitar"
		text="Instrument"
		)
		div.settings-menu

			//- Instrument
			VSelect(
				:options="instruments"
				v-model="instrument"
				is-contained
				is-first-item
				)

			div.settings-menu__separator

			//- Tuning
			VSelect(
				:options="tunings"
				v-model="tuning"
				is-contained
				)

			div.settings-menu__separator

			//- Capo
			VSelect(
				:options="capoFrets"
				v-model.number="capo"
				is-contained
				)

			div.settings-menu__separator

			//- Fret range
			div.fret-range
				VMultiRange.fret-range__slider(
					:min="0"
					:max="MAX_NB_FRETS - 1"
					:min-gap="MIN_NB_FRETS"
					:is-flipped="isFlipped"

					:values="fretRangeDisplay"

					@input=" fretRangeDisplay = $event"
					@change="fretRange = fretRangeDisplay = $event"
					)
				p.fret-range__text
					span(v-html="lowestFret")
					span.fret-range__text__separator ⟷
					span(v-html="highestFret")

	//----------------------------------------------------------------------
	//- Display settings
	//----------------------------------------------------------------------
	component(
		:is="isMobileDevice ? 'div' : 'VPopupMenu'"

		icon="eye"
		text="Display"
		)
		div.settings-menu

			//- Switch fretting hand
			VToggleButton(
				text="Right-handed fretting"
				:is-active="isFlipped"

				@click.native="$store.commit('fretboard/toggle.isFlipped')"
				)

			div.settings-menu__separator

			//- Toggle fret numbers
			VToggleButton(
				text="Show fret numbers"
				:is-active="isShowingFretNbs"

				@click.native="$store.commit('fretboard/toggle.isShowingFretNbs')"
				)

			div.settings-menu__separator

			//- Change the info displayed on the notes
			//- Possible options:
				* single sequence:    none/note name/interval (select menu)
				* multiple sequences: none/note name          (toggle button)
			VSelect(
				v-if="displayedSequences.length <= 1"

				label-prefix="Display on notes:"
				:options="{ none: 'nothing', name: 'names', interval: 'intervals' }"
				is-contained

				v-model="noteInfos"
				)
			VToggleButton(
				v-else

				text="Show note names"
				:is-active="isShowingNoteNames"

				@click.native="$store.commit('fretboard/toggle.isShowingNoteNames')"
				)

	//----------------------------------------------------------------------
	//- Export menu
	//----------------------------------------------------------------------
	VPopupMenu(
		v-if="!isMobileDevice"

		icon="file-download"
		text="Export"

		:force-closing="exportMenuClose"
		)
		div.export-menu
			div.export-menu__text
				p: strong Choose a format to export in
				p: em
					| If you want to print this  fretboard, choose PNG or JPG.
					| The SVG format is most useful for embedding in web pages as it will scale perfectly when resized.
			div.export-menu__buttons
				each format of ['png', 'jpg', 'svg']
					VButton(
						icon=(format == 'svg' ? 'file-image' : 'image-polaroid')
						text=format.toUpperCase()

						@click=`exportFretboard('${format}')`
						)

	//----------------------------------------------------------------------
	//- Colorscheme setting
	//----------------------------------------------------------------------
	//- VTextSelect(
		:options="{ light: 'Light mode', dark: 'Dark mode', system: 'System colors' }"
		:icon="isDarkModeOn ? 'moon' : 'sun'"

		v-model="darkModeSetting"
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
import { getFrets }                           from '@/modules/fretboard'
import { formatOrdinalSuffix, formatFretNb }  from '@/modules/text'

export default {
	name: 'FretboardSettings',

	data() {
		return {
			exportMenuClose:  false,
			fretRangeDisplay: this.$store.state.fretboard.fretRange,
		}
	},

	computed: {
		lowestFret()  { return formatOrdinalSuffix(formatFretNb(this.fretRangeDisplay[this.isFlipped ? 1 : 0])); },
		highestFret() { return formatOrdinalSuffix(formatFretNb(this.fretRangeDisplay[this.isFlipped ? 0 : 1])); },
		tunings()
		{
			return mapObjectToObject(tunings[this.instrument], tuning => tuningsNames[tuning]);
		},
		...sync([
			'darkModeSetting',
		]),
		...sync('fretboard', [
			'instrument',
			'tuning',
			'capo',
			'fretRange',

			'noteInfos',

			'isShowingFretNbs',
			'isShowingNoteNames',
			'isFlipped',
		]),
		...get([
			'sequences/displayedSequences',

			'isDarkModeOn',
			'isMobileDevice',
		]),
	},

	created()
	{
		this.MIN_NB_FRETS = MIN_NB_FRETS;
		this.MAX_NB_FRETS = MAX_NB_FRETS;

		this.instruments  = instruments;
		this.capoFrets    = [...Array(11).keys()].reduce((result, fret) => { result[fret + 1] = 'Capo ' + formatFretNb(fret + 1); return result; }, { 0: 'No capo' });
	},

	methods: {
		exportFretboard(format)
		{
			this.exportMenuClose = !this.exportMenuClose;

			exportFretboard(
				format,
				this.$store.state.sequences.sequences,
				getFrets(this.displayedSequences, (a => { a.reverse(); return a; })([...tunings[this.instrument][this.tuning]]), this.capo),
				instruments[this.instrument].nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				(this.displayedSequences.length > 1) ? (this.isShowingNoteNames ? 'name' : 'none') : this.noteInfos,
				this.isFlipped,
				this.isShowingFretNbs,
				this.isDarkModeOn,
				format != 'svg',
			);
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
		@include center-column;
		@include space-children-v(30px);
	}

	@include mq($from: desktop)
	{
		display: flex;
		@include space-children-h(10px);
	}
}

.settings-menu {
	display: flex;
	flex-direction: column;
	justify-content: stretch;

	min-width: 250px;
}

.settings-menu__separator {
	height: 1px;

	background-color: var(--color--bg--highlight);
}

.fret-range {
	@include space-children-v(8px);

	padding: 14px;
}

.fret-range__slider {
	min-width: 250px;
}

.fret-range__text {
	text-align: center;
	@include space-children-h(6px);

	color: var(--color--text);
}

.fret-range__text__separator {
	color: var(--color--text--secondary);
}

.export-menu {
	@include space-children-v(20px);

	padding: 10px;
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

</style>
<!--}}}-->
