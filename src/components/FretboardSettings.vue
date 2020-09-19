

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
				icon="guitar"
				is-contained
				is-first-item

				v-model="instrument"
				)

			div.settings-menu__separator

			//- Tuning
			VSelect(
				:options="tunings"
				icon="music"
				is-contained

				v-model="tuning"
				)

			div.settings-menu__separator

			//- Capo
			VSelect(
				:options="capoFrets"
				icon="arrow-circle-up"
				is-contained

				v-model.number="capo"
				)

			div.settings-menu__separator

	//----------------------------------------------------------------------
	//- Display settings
	//----------------------------------------------------------------------
	component(
		:is="isMobileDevice ? 'div' : 'VPopupMenu'"

		icon="eye"
		text="Display"
		)
		div.settings-menu

			//- Theme
			VSelect(
				:options="{ light: 'Light mode', dark: 'Dark mode', system: `System colors (${isSystemDarkModeOn ? 'dark' : 'light'})` }"
				:icon="darkModeSetting == 'system' ? 'desktop-alt' : isDarkModeOn ? 'moon' : 'sun'"
				is-contained

				v-model="darkModeSetting"
				)

			div.settings-menu__separator

			//- Fretting hand
			VToggleButton(
				text="Right-handed fretting"
				icon="hand-paper"
				:is-active="isFlippedHor"

				@click.native="$store.commit('fretboard/toggle.isFlippedHor')"
				)

			//- Fretting hand
			VToggleButton(
				text="Mirror vertically"
				icon="arrows-v"
				:is-active="isFlippedVert"

				@click.native="$store.commit('fretboard/toggle.isFlippedVert')"
				)

			div.settings-menu__separator

			//- Fret numbers
			VToggleButton(
				text="Show fret numbers"
				icon="list-ol"
				:is-active="isShowingFretNbs"

				@click.native="$store.commit('fretboard/toggle.isShowingFretNbs')"
				)

			//- Infos displayed on the notes
				* single sequence:    nothing/note name/interval (select menu)
				* multiple sequences: nothing/note name          (toggle button)
			VSelect(
				v-if="displayedSequences.length <= 1"

				:options="{ none: 'nothing', name: 'names', degree: 'degrees', interval: 'intervals' }"
				icon="info-circle"
				label-prefix="Display on notes:"
				is-contained

				v-model="noteInfos"
				)
			VToggleButton(
				v-else

				text="Show note names"
				icon="info-circle"
				:is-active="isShowingNoteNames"

				@click.native="$store.commit('fretboard/toggle.isShowingNoteNames')"
				)

			div.settings-menu__separator

			//- Fret range
			div.fret-range
				VMultiRange.fret-range__slider(
					:min="0"
					:max="MAX_NB_FRETS - 1"
					:min-gap="MIN_NB_FRETS"
					:is-flipped="isFlippedHor"

					:values="fretRangeDisplay"

					@input=" fretRangeDisplay = $event"
					@change="fretRange = fretRangeDisplay = $event"
					)
				p.fret-range__text
					span(v-html="lowestFret")
					span.fret-range__text__separator ⟷
					span(v-html="highestFret")

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
		lowestFret()  { return formatOrdinalSuffix(formatFretNb(this.fretRangeDisplay[this.isFlippedHor ? 1 : 0])); },
		highestFret() { return formatOrdinalSuffix(formatFretNb(this.fretRangeDisplay[this.isFlippedHor ? 0 : 1])); },
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
			'isFlippedHor',
			'isFlippedVert',
		]),
		...get([
			'sequences/displayedSequences',

			'isDarkModeOn',
			'isMobileDevice',
			'isSystemDarkModeOn',
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
				getFrets(this.displayedSequences, (a => { if (!this.isFlippedVert) a.reverse(); return a; })([...tunings[this.instrument][this.tuning]]), this.capo),
				instruments[this.instrument].nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				(this.displayedSequences.length > 1) ? (this.isShowingNoteNames ? 'name' : 'none') : this.noteInfos,
				this.isFlippedHor,
				this.isShowingFretNbs,
				this.darkModeSetting == 'system' ? this.isSystemDarkModeOn : this.isDarkModeOn,
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
