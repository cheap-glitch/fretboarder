

<!-- components/FretboardSettings.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSettings

	//----------------------------------------------------------------------
	//- Settings
	//----------------------------------------------------------------------
	div.settings
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

	//----------------------------------------------------------------------
	//- Tools
	//----------------------------------------------------------------------
	div.tools
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
		//- Switch fretting hand
		VButton(
			icon="hand-paper"
			title="Switch hand"

			:is-flipped="!isFlipped"
			@click="$store.commit('fretboard/toggle.isFlipped')"
			)
		//- Export the fretboard
		VButton(
			v-if="!isMobileDevice"
			ref="buttonExport"

			icon="file-download"
			title="Export"

			:is-active="isExportMenuOpened"
			@click="isExportMenuOpened = !isExportMenuOpened"
			)
		//- Export menu
		VTooltip(
			:target="$refs.buttonExport ? ($refs.buttonExport.$el || false) : false"
			placement="bottom"

			:is-open="!isMobileDevice && isExportMenuOpened"
			v-click-outside="clickOutsideHandler"
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
						button.button.is-filled(@click.left=`exportFretboard('${format}')`)
							p.button__text= format.toUpperCase()

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }                          from 'vuex-pathify'

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
		this.instruments = instruments;
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
		clickOutsideHandler(event)
		{
			if (!this.$refs.buttonExport.$el.contains(event.target))
				this.isExportMenuOpened = false;
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
		align-items: flex-end;
		justify-content: space-between;
	}
}

.settings {
	@include mq($until: desktop)
	{
		@include center-column;
		@include space-children-v(20px);
	}

	@include mq($from: desktop)
	{
		display: flex;
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

	transition: border-color 200ms, background-color 200ms;

	cursor: pointer;

	&:hover {
		background-color: white;
	}
}

.button__text {
	color: white;
	cursor: pointer;

	text-align: justify;
	overflow-wrap: break-word;
	hyphens: auto;

	.button:hover & { color: var(--color--bg--tooltip); }
}

</style>
<!--}}}-->
