

<!-- components/FretboardSequencesItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSequencesItem

	//----------------------------------------------------------------------
	//- Properties
	//----------------------------------------------------------------------

	//- Tonality
	VSelect(
		:value="tonality"
		:options="tonalities"

		@change="v => update('tonality', v)"
		)
	//- Model
	VSelect(
		:value="model"
		:options="[{ label: 'Scales', options: scales }, { label: 'Arpeggios', options: arpeggios }]"
		:label-formatter="(value, label) => `${label} ${value.startsWith('arp-') ? 'arp.' : 'scale'}`"

		@change="v => update('model', v)"
		)

	//----------------------------------------------------------------------
	//- Intervals
	//----------------------------------------------------------------------

	div.intervals: div.intervals__item(
		v-for="interval in intervals"
		:key="`sequence--${index}--interval--${interval.value}`"

		v-mods="{ isSelected: highlightedInterval == interval.value }"
		@click.left="update('highlightedInterval', highlightedInterval == interval.value ? null : interval.value)"
		)

		p.interval__item__note {{ interval.note }}
		p.interval__item__name(v-html="interval.name")

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

	computed: {
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

.FretboardSequencesItem {
	display: flex;
	align-items: flex-start;
	@include space-children-h(20px);
}

.intervals {
}

.intervals__item {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	@include pill;
	padding: 2px 8px;

	border: 1px solid var(--color--border);

	cursor: pointer;

	&.is-selected, &:hover {
		background-color: var(--color--bg--highlight);
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

	.intervals__item.is-selected             & { color: var(--color--text);      }
	.intervals__item:not(.is-selected):hover & { color: var(--color--text);      }
}

</style>
<!--}}}-->
