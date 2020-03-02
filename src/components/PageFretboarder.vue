

<!-- PageFretboarder.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.PageFretboarder

	section.above-fretboard
		//- Current tuning
		p.tuning-infos(v-mods="darkMode") {{ tuningNotesList }}

		//- Infos about the hovered fret
		div.fret-infos(
			v-mods="{ isVisible: hoveredFretInfos.length > 0 }"
			)
			div.fret-infos__item(
				v-for="(info, index) in hoveredFretInfos"
				:key="`fret-info--${index}`"
				v-mods="darkMode"
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

			div.toolbar__separator(v-mods="darkMode")

			//- Clear the fretboard
			VButtonIcon#help-tour-step--4(
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
		:is-vertical="isFretboardVertical"
		)

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

						tooltip="active"
						:tooltip-formatter="tooltipFormatter"

						v-mods="darkMode"
						v-model="fretRange"
						@mousedown.left.native="$store.commit('setIsFretRangeSliderClicked', true)"
						)
		//- Scales & arpeggios
		div.scales
			div.scales-list
				FretboardScale(
					v-for="scale in scales"
					:key="`scale--${scale.id}`"

					v-bind="scale"
					)
			p.no-scales-text(
				v-show="scales.length == 0"
				v-mods="darkMode"
				) Click on the #[fa-icon(:icon="['far', 'plus-circle']")] button to add a new scale or arpeggio.
			VButtonIcon#help-tour-step--5(
				v-show="scales.length < maxNbScales"

				icon="plus-circle"
				tooltip="Add a new scale or arpeggio"
				@click="addScale"
				)

	//----------------------------------------------------------------------
	//- Mobile action
	//----------------------------------------------------------------------
	div.mobile-actions
		div.mobile-actions__item: fa-icon(icon="list-music")
		div.mobile-actions__item: fa-icon(icon="cog")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapMutations } from 'vuex'
import { get, sync }    from 'vuex-pathify'

import data             from '@/modules/data'
import { objectMap }    from '@/modules/object'
import FretboardScale   from '@/components/FretboardScale'
import FretboardViewer  from '@/components/FretboardViewer'

export default {
	name: 'PageFretboarder',

	components: {
		FretboardScale,
		FretboardViewer,
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
		isFretboardVertical()
		{
			return window.innerWidth < 1000;
		},
		...sync([
			'instrument',
			'tuning',
			'fretRange',
			'scales/scales',
			'scales/maxNbScales',
		]),
		...get([
			'isDarkModeOn',
			'isDisplayingNotesName',
			'isFretboardFlipped',

			'darkMode',

			'hoveredFretInfos',
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
		...mapMutations({
			addScale: 'scales/addScale',
		}),
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

/**
 * Above the fretboard
 * -----------------------------------------------------------------------------
 */
.above-fretboard {
	display: none;
	align-items: flex-end;
	justify-content: space-between;

	position: relative;

	margin-bottom: 40px;

	@include mq($from: desktop)
	{
		display: flex;
	}
}

.tuning-infos {
	color: gray;

	&.dark-mode {
		color: $color-oxford-blue-2;
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

	&.dark-mode {
		color: $color-nepal;
	}
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

/**
 * Below the fretboard
 * -----------------------------------------------------------------------------
 */
.below-fretboard {
	display: none;
	@include space-children-v(40px);

	margin-top: 40px;

	@include mq($from: desktop)
	{
		display: block;
	}
}

.settings {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	@include space-children-h(20px);
}

.select-instrument { min-width: 180px; }
.select-tuning     { min-width: 260px; }

.fret-range-slider {
	width: 300px;
	margin: 0 10px;
}

.scales {
	@include center-column;
	@include space-children-v(20px);
}

.scales-list {
	@include space-children-v(20px);
}

.no-scales-text.dark-mode {
	color: $color-nepal;
}

/**
 * Mobile actions
 * -----------------------------------------------------------------------------
 */
.mobile-actions {
	display: flex;
	@include space-children-h(10px);

	position: fixed;
	z-index: 1000;
	bottom: 10px;
	right: 10px;
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
