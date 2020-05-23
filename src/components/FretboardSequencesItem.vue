

<!-- components/FretboardSequencesItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSequencesItem

	div.infos(
		:style="{ 'border-color': color, 'background-color': color }"
		v-mods="{ isOpen }"

		@click.left="isOpen = !isOpen"
		)
		p {{ infos }}
		fa-icon(:icon="['far', isOpen ? 'minus' : 'ellipsis-v']")

	transition(name="fade"): div.settings(
		v-show="isOpen"
		:style="{ 'border-color': color }"
		)

		//----------------------------------------------------------------------
		//- Properties
		//----------------------------------------------------------------------
		div.properties
			//- Tonality
			VSelect.properties__item(
				:value="tonality"
				:options="tonalities"

				@change="v => update('tonality', v)"
				)
			//- Model
			VSelect.properties__item(
				:value="model"
				:options="[{ label: 'Scales', options: scales }, { label: 'Arpeggios', options: arpeggios }]"
				:label-formatter="(value, label) => `${label} ${value.startsWith('arp-') ? 'arp.' : 'scale'}`"

				@change="v => update('model', v)"
				)

		//----------------------------------------------------------------------
		//- Intervals
		//----------------------------------------------------------------------
		div.intervals: button.intervals__item(
			v-for="interval in intervals"
			:key="`sequence--${index}--interval--${interval.value}`"

			v-mods="{ isSelected: highlightedInterval == interval.value }"
			@click.left="update('highlightedInterval', highlightedInterval == interval.value ? null : interval.value)"
			)

			p.interval__item__note {{ interval.note }}
			p.interval__item__name(v-html="interval.name")

		//----------------------------------------------------------------------
		//- Tools
		//----------------------------------------------------------------------
		div.tools
			//- Show/hide
			VButton.tools__item(
				:icon="isVisible ? 'eye' : 'eye-slash'"
				is-flipped
				:title="isVisible ? 'Hide' : 'Show'"

				@click="update('isVisible', !isVisible)"
				)
			//- Focus
			VButton.tools__item(
				icon="bullseye"
				title="Focus"

				v-show="nbSequences > 1"
				:is-active="isFocused"

				@click="$store.commit('sequences/toggleFocus', index)"
				)
			//- Show intersections only
			VButton.tools__item(
				:icon="['fas', 'intersection']"
				title="Intersect"

				v-show="nbSequences > 1"
				:is-active="isIntersected"

				@click="update('isIntersected', !isIntersected)"
				)

			//- Duplicate
			VButton.tools__item(
				icon="copy"
				title="Duplicate"

				:is-disabled="nbSequences == MAX_NB_SEQUENCES"

				@click="$store.commit('sequences/duplicate', index)"
				)
			//- Remove
			VButton.tools__item(
				icon="times-circle"
				title="Delete"

				@click="$store.commit('sequences/remove', index)"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { MAX_NB_SEQUENCES }                               from '@/modules/constants'
import { filterObject }                                   from '@/modules/object'
import { notes, notesNames, models, intervalsShortNames } from '@/modules/music'

export default {
	name: 'FretboardSequencesItem',

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
			isOpen: false,
		}
	},

	computed: {
		infos()
		{
			return `${notesNames[this.tonality]} ${models[this.model].name} ${this.model.startsWith('arp-') ? 'arpeggio' : 'scale'}`;
		},
		intervals()
		{
			return [0, ...models[this.model].intervals].map(interval => ({
				value: interval,
				note:  notesNames[notes[(notes.indexOf(this.tonality) + interval) % notes.length]],
				name:  intervalsShortNames[interval],
			}))
		},
	},

	created()
	{
		this.tonalities       = notesNames;
		this.scales           = filterObject(models, key => !key.startsWith('arp-'));
		this.arpeggios        = filterObject(models, key =>  key.startsWith('arp-'));
		this.MAX_NB_SEQUENCES = MAX_NB_SEQUENCES;
	},

	methods: {
		update(prop, value)
		{
			// Reset the highlighted interval when the model of the sequence is changed
			if (prop == 'model')
				this.update('highlightedInterval', null);

			this.$store.commit('sequences/update', { index: this.index, prop, value });
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.infos,
.settings {
	border-width: 2px;
	border-style: solid;
}

.infos {
	display: flex;
	justify-content: space-between;

	padding: 10px;

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
	padding: 20px 20px 10px 20px;

	border-top: none;

	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

.properties {
	display: flex;
	flex-wrap: wrap;
	@include space-children-h(10px);

	margin-bottom: 30px;
}

.properties__item {
	margin-bottom: 10px;
}

.intervals {
	display: grid;

	grid-gap: 10px;
	grid-auto-rows: auto;
	grid-template-columns: repeat(auto-fill, 60px);

	margin-bottom: 40px;
}

.intervals__item {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	@include pill;
	padding: 2px 8px;

	border: 1px solid var(--color--border);

	cursor: pointer;
	appearance: none;
	background-color: transparent;

	transition: color 200ms, border-color 200ms, background-color 200ms;

	&.is-selected, &:hover {
		background-color: var(--color--bg--highlight);
	}

	&:focus {
		border-color: var(--color--hover);
	}
}

.interval__item__note {
	color: var(--color--text);
	cursor: pointer;

	.intervals__item.is-selected             & { color: var(--color--highlight); }
	.intervals__item:not(.is-selected):hover & { color: var(--color--hover);     }
}

.interval__item__name {
	color: var(--color--text--secondary);
	cursor: pointer;

	font-size: 1.2rem;

	.intervals__item.is-selected             & { color: var(--color--text); }
	.intervals__item:not(.is-selected):hover & { color: var(--color--text); }
}

.tools {
	display: flex;
	flex-wrap: wrap;
}

.tools__item {
	margin: 0 10px 10px 0;
}

</style>
<!--}}}-->
