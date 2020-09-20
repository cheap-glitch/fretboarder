

<!-- components/FretboardSequencesItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

mixin extra-tools
	//- Focus
	VButton(
		text="Focus"
		icon="bullseye"

		v-show="nbSequences > 1"
		:is-active="isFocused"

		@click="$store.commit('sequences/toggleFocus', index)"
		)
	//- Show intersections only
	VButton(
		text="Intersect"
		:icon="['fas', 'intersection']"

		v-show="nbSequences > 1"
		:is-active="isIntersected"

		@click="update('isIntersected', !isIntersected)"
		)
	//- Duplicate
	VButton(
		text="Duplicate"
		icon="copy"

		:is-disabled="nbSequences == MAX_NB_SEQUENCES"

		@click="$store.commit('sequences/duplicate', index)"
		)

div.FretboardSequencesItem
	//- Infos (mobile)
	div.infos(
		v-if="isMobileDevice"

		:style="{ borderColor: color, backgroundColor: color }"
		v-mods="{ isOpen }"

		@click.left="isOpenedByUser = !isOpenedByUser"
		)
		p {{ infos }}
		fa-icon(
			v-show="nbSequences > 1"
			:icon="['far', isOpen ? 'minus' : 'ellipsis-v']"
			)

	//- Settings & tools
	transition(name="fade"): div.settings(
		v-show="isOpen || !isMobileDevice"
		:style="{ borderColor: color }"
		)

		//----------------------------------------------------------------------
		//- Properties
		//----------------------------------------------------------------------
		div.properties
			div.dot(
				v-if="!isMobileDevice"
				:style="{ backgroundColor: color }"
				)

			//- Tonality
			VSelect(
				:value="tonality"
				:options="tonalities"

				@change="v => update('tonality', v)"
				)
			//- Model
			VSelect(
				:value="model"
				:options="modelOptionGroups"
				:label-formatter="(value, label) => `${label} ${isArpeggio(value) ? 'arp.' : 'scale'}`"

				@change="v => update('model', v)"
				)
			//- Model
			VSelect(
				:value="position"
				:options="positions"
				:is-disabled="!hasPositions"

				@change="v => update('position', parseInt(v, 10))"
				)

		//----------------------------------------------------------------------
		//- Intervals
		//----------------------------------------------------------------------
		div.intervals
			FretboardSequencesItemInterval(
				v-for="interval of intervals"
				:key="`sequence--${index}--interval--${interval.value}`"

				v-bind="interval"
				:is-selected="highlightedInterval == interval.value"

				@update-interval="v => update('highlightedInterval', v)"
				)

		//----------------------------------------------------------------------
		//- Tools
		//----------------------------------------------------------------------
		div.tools
			//- Show/Hide
			VButton(
				:text="isVisible ? 'Hide' : 'Show'"
				:icon="isVisible ? 'eye' : 'eye-slash'"
				is-flipped

				@click="update('isVisible', !isVisible)"
				)

			//- Extra tools
			template(v-if="isMobileDevice || isWideScreen"): +extra-tools
			template(v-else): VPopupMenu(icon="ellipsis-h"): div.tools__extra: +extra-tools

			//- Remove
			VButton(
				text="Remove"
				icon="times-circle"

				@click="$store.commit('sequences/remove', index)"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                         from 'vuex-pathify'

import { MAX_NB_SEQUENCES }            from '@/modules/constants'
import { models, notes, notesNames }   from '@/modules/music'

import FretboardSequencesItemInterval  from '@/components/FretboardSequencesItemInterval'

const modelOptionGroups = [
	// {{{
	{
		label:   'Common scales',
		options: {
			...getModels([
				'maj5',
				'min5',
				'bmaj',
				'bmin',
			]),
			'ion': 'Natural major',
			'aeo': 'Natural minor',
		}
	},
	{
		label:   'Common arpeggios',
		options: getModels([
			'arp-maj',
			'arp-min',
			'arp-dom7',
		]),
	},
	{
		label:   'Pentatonic scales',
		options: getModels([
			'maj5',
			'min5',
			'bmaj5',
			'bmin5',
			'egyp',
			'in',
			'hira',
			'iwa',
			'ins',
		]),
	},
	{
		label:   'Hexatonic scales',
		options: getModels([
			'maj6',
			'min6',
			'bmaj',
			'bmin',
			'aug',
			'wtone',
			'tri',
			'2tri',
			'prom',
		]),
	},
	{
		label:   'Heptatonic scales',
		options: getModels([
			'ion',
			'dor',
			'phry',
			'lyd',
			'mix',
			'aeo',
			'locr',

			'harmaj',
			'dharmaj',
			'harmmin',
			'amel',
			'dmel',

			'dorf2',
			'lydaug',
			'lyddom',
			'mixf6',
			'locrs2',
			'alt',
			'phrydom',
			'ultphry',
			'aeodom',

			'majneap',
			'minneap',
			'pers',
			'hungmaj',
			'hungmin',
			'gypsy',
			'ukrdor',
			'eni',
		]),
	},
	{
		label:   'Octatonic scales',
		options: getModels([
			'dimhw',
			'dimwh',

			'bebdom',
			'bebmaj',
			'bebdor',
			'bebdoralt',
			'bebharmin',
			'bebmel',
		]),
	},
	{
		label:   'Chromatic scale',
		options: getModels(['chro']),
	},
	{
		label:   'Powerchord',
		options: getModels(['arp-pow']),
	},
	{
		label:   'Triads',
		options: getModels([
			'arp-maj',
			'arp-majf5',
			'arp-min',
			'arp-aug',
			'arp-dim',
			'arp-sus2',
			'arp-sus4',
		]),
	},
	{
		label:   'Sixth chords',
		options: getModels([
			'arp-maj6',
			'arp-min6',
			'arp-minf6',
		]),
	},
	{
		label:   'Seventh chords',
		options: getModels([
			'arp-dom7',
			'arp-dom7f5',
			'arp-maj7',
			'arp-min7',
			'arp-minmaj7',
			'arp-aug7',
			'arp-hdim7',
			'arp-dimmaj7',
			'arp-dim7',
			'arp-dom7s9',
		]),
	},
	{
		label:   'Ninth chords',
		options: getModels([
			'arp-majadd9',
			'arp-dom9',
			'arp-dommin9',
			'arp-domaug9',
			'arp-maj9',
			'arp-min9',
			'arp-minmaj9',
			'arp-aug9',
			'arp-augmaj9',
			'arp-hdim9',
			'arp-hdimmin9',
			'arp-dim9',
			'arp-dimmin9',
			'arp-69',
			'arp-minf69',
			'arp-min69',
		]),
	},
	{
		label:   'Eleventh chords',
		options: getModels([
			'arp-dom11',
			'arp-maj11',
			'arp-majaug11',
			'arp-min11',
			'arp-dom911',
			'arp-maj911',
			'arp-minmaj11',
			'arp-min911',
			'arp-aug911',
			'arp-augmaj911',
			'arp-hdim911',
			'arp-dim911',
		]),
	},
	{
		label:   'Thirteenth chords',
		options: getModels([
			'arp-dom13',
			'arp-maj13',
			'arp-min13',
			'arp-dom91113',
			'arp-maj91113',
			'arp-min91113',
			'arp-minmaj91113',
			'arp-aug91113',
			'arp-augmaj91113',
			'arp-hdim91113',
		]),
	},
	// }}}
];

export default {
name: 'FretboardSequencesItem',

	components: {
		FretboardSequencesItemInterval,
	},

	props: {
		index: {
			type: Number,
			required: true,
		},
		tonality: {
			type: String,
			required: true,
		},
		model: {
			type: String,
			required: true,
		},
		position: {
			type: Number,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		highlightedInterval: {
			type: Number,
			default: null,
		},
		isVisible: {
			type: Boolean,
			default: true,
		},
		isFocused: {
			type: Boolean,
			default: false,
		},
		isIntersected: {
			type: Boolean,
			default: false,
		},
		nbSequences: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			isOpenedByUser: false,
		}
	},

	computed: {
		infos()
		{
			return `${notesNames[this.tonality]} ${models[this.model].name} ${this.isArpeggio(this.model) ? 'arpeggio' : 'scale'}`;
		},
		intervals()
		{
			return [0, ...models[this.model].intervals].map(interval => ({
				note:  notesNames[notes[(notes.indexOf(this.tonality) + interval) % notes.length]],
				value: interval,
			}))
		},
		hasPositions()
		{
			return ('positions' in models[this.model]);
		},
		isOpen()
		{
			return this.isOpenedByUser || this.nbSequences == 1;
		},

		...get([
			'isMobileDevice',
			'isWideScreen',
		]),
	},

	created()
	{
		this.MAX_NB_SEQUENCES  = MAX_NB_SEQUENCES;
		this.tonalities        = notesNames;
		this.modelOptionGroups = modelOptionGroups;

		this.positions = {
			0: 'Whole',
			1: '1st pos.',
			2: '2nd pos.',
			3: '3rd pos.',
			4: '4th pos.',
			5: '5th pos.',
		};
	},

	methods: {
		update(prop, value)
		{
			this.$store.commit('sequences/update', { index: this.index, prop, value });
		},
		isArpeggio(model)
		{
			return model.startsWith('arp-');
		},
	}
}

/**
 * Helper function to return an object with the models as keys and their name as values
 */
function getModels(selectedModels)
{
	return Object.fromEntries(selectedModels.map(model => [model, models[model].name]));
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.dot {
	@include circle(10px);
	flex: 0 0 auto;

	&.dot.dot { margin-right: 20px; }
}

.infos {
	display: flex;
	justify-content: space-between;

	padding: 10px;

	border-width: 2px;
	border-style: solid;
	border-radius: 10px;

	border-bottom: none;

	color: white;

	transition: border-radius 200ms;

	&.is-open {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
}

.settings {
	@include mq($until: desktop)
	{
		@include space-children-v(30px);

		padding: 20px 20px 10px 20px;

		border-width: 2px;
		border-style: solid;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;

		border-top: none;
	}

	@include mq($from: desktop)
	{
		display: flex;
		align-items: flex-start;
		@include space-children-h(40px);

		border-radius: 10px;
	}
}

.properties {
	display: flex;
	flex-wrap: wrap;
	@include space-children-h(10px);

	@include mq($until: desktop)
	{
		.VSelect { margin-bottom: 10px; }
	}

	@include mq($from: desktop)
	{
		flex: 0 0 auto;
		align-items: center;
		justify-content: flex-end;
	}
}

.intervals {
	display: grid;

	gap: 10px;
	grid-auto-rows: auto;
	grid-template-columns: repeat(auto-fill, 60px);

	@include mq($until: desktop)
	{
		&.intervals { margin-bottom: 40px; }
	}

	@include mq($from: desktop)
	{
		align-content: center;

		flex: 1 1 100%;
		align-self: stretch;
	}
}

.tools {
	display: flex;

	@include mq($until: desktop)
	{
		flex-wrap: wrap;
		.VButton { margin: 0 10px 10px 0; }
	}

	@include mq($from: desktop)
	{
		@include space-children-h(10px);
	}
}

.tools__extra {
	@include center-column;
	@include space-children-v(10px);
}

</style>
<!--}}}-->
