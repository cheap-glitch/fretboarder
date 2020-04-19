

<!-- PageFretboarder.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.PageFretboarder

	section.above-fretboard

		//--------------------------------------------------------------
		//- Tools & display options
		//--------------------------------------------------------------
		div.settings
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
			div.toolbar#help-tour-step--2
				div.fret-range-slider
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

						v-model="fretRange"
						@mousedown.left.native="$store.commit('setIsFretRangeSliderClicked', true)"
						)

		//--------------------------------------------------------------
		//- Infos about the hovered fret
		//--------------------------------------------------------------
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

		//--------------------------------------------------------------
		//- Tools & display options
		//--------------------------------------------------------------
		div.toolbar
			//- Switch between themes
			VButtonIcon(
				icon="adjust"
				:tooltip="isDarkModeOn ? 'Switch to light mode' : 'Switch to dark mode'"
				@click="$store.commit('toggleIsDarkModeOn')"
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

			div.toolbar__separator

			//- Clear the fretboard
			//- VButtonIcon#help-tour-step--4(
				icon="eraser"
				tooltip="Clear the freatboard"
				@click="$store.commit('scales/clearScales')"
				)

			//- Export the fretboard
			div#canvas-wrapper
			VButtonIcon#button-export-menu(
				icon="file-download"
				tooltip="Export the fretboard image"
				@click="openExportMenu"
				)

	//----------------------------------------------------------------------
	//- Fretboard
	//----------------------------------------------------------------------
	FretboardViewer#help-tour-step--12(
		:is-vertical="isMobileDevice"
		)

	//----------------------------------------------------------------------
	//- Scales & arpeggios
	//----------------------------------------------------------------------
	section.below-fretboard
		PageFretboarderScales(v-if="!isMobileDevice")

	//----------------------------------------------------------------------
	//- Mobile actions & modals
	//----------------------------------------------------------------------
	div.mobile-actions
		div.mobile-actions__item(@click.left="isModalScalesOpen   = true"): fa-icon(icon="list-music")
		div.mobile-actions__item(@click.left="isModalSettingsOpen = true"): fa-icon(icon="cog")

	//- Scales & arpeggios
	VModal(
		v-if="isMobileDevice"

		:is-open="isModalScalesOpen"
		@close="isModalScalesOpen = false"
		)
		PageFretboarderScales

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get, sync }         from 'vuex-pathify'

import data                  from '@/modules/data'
import { objectMap }         from '@/modules/object'
import FretboardViewer       from '@/components/FretboardViewer'
import PageFretboarderScales from '@/components/PageFretboarderScales'

export default {
	name: 'PageFretboarder',

	components: {
		FretboardViewer,
		PageFretboarderScales,
	},

	data() {
		return {
			isModalScalesOpen:   false,
			isModalSettingsOpen: false,
		}
	},

	computed: {
		tuningsOptions()
		{
			return objectMap(data.tunings[this.instrument], key => ({ name: data.tuningsNames[key], value: key }));
		},
		tuningNotesList()
		{
			return data.tuningsNames[this.tuning]
			     + ` (${data.tunings[this.instrument][this.tuning].map(note => data.tonalities[note]).join(', ')})`;
		},
		...sync([
			'instrument',
			'tuning',
			'fretRange',
		]),
		...get([
			'hoveredFretInfos',
			'scales/scales',

			'isDarkModeOn',
			'isDisplayingNotesName',
			'isFretboardFlipped',
			'isMobileDevice',
		]),
	},

	created()
	{
		this.instrumentOptions = objectMap(data.instruments, (key, instrument) => ({ name: instrument.name, value: key }));
	},

	mounted()
	{
		if (this.scales.length == 0)
			this.addScale();
	},

	methods: {
		openExportMenu()
		{
			if (this.$tours['export-menu'].currentStep == -1)
				this.$tours['export-menu'].start();
		},
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
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.PageFretboarder {
	@include space-children-v(60px);
}

.above-fretboard {
	display: none;
	align-items: flex-end;
	justify-content: space-between;

	position: relative;

	@include mq($from: desktop)
	{
		display: flex;
	}
}

.fret-infos {
	display: flex;
	@include space-children-h(10px);

	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);

	opacity: 0;
	transition: opacity 0.2s;

	&.is-visible {
		opacity: 1;
	}
}

.fret-infos__item {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	color: var(--color--text);
}

.fret-infos__item__color-dot {
	@include circle(10px);
}

.settings {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	@include space-children-h(20px);
}

.toolbar {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	@include space-children-h(10px);
}

.toolbar__separator {
	@include circle(6px);
	background-color: var(--color--separator);
}

.select-instrument { min-width: 180px; }
.select-tuning     { min-width: 260px; }

.fret-range-slider {
	width: 300px;
}

#canvas-export,
#canvas-wrapper {
	display: none;
}

.below-fretboard {
	display: none;

	@include mq($from: desktop)
	{
		display: block;
	}
}

.mobile-actions {
	@include space-children-v(10px);

	position: fixed;
	z-index: 1000;
	bottom: 10px;
	right: 10px;

	@include mq($from: desktop)
	{
		display: none;
	}
}

.mobile-actions__item {
	@include center-content;
	@include circle(48px);

	font-size: 22px;

	color: white;

	box-shadow: -4px -4px 8px 2px rgba(0, 0, 0, 0.6);

	cursor: pointer;

	&:nth-child(1) { background-color: $color-azure; }
	&:nth-child(2) { background-color: #aaa;         }
}

</style>
<!--}}}-->
