

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
		:options="models"

		@change="v => update('model', v)"
		)

	//----------------------------------------------------------------------
	//- Intervals
	//----------------------------------------------------------------------

	//- div.intervals: div.intervals__item(
		v-for="interval in intervals"
		:key="`sequence--${index}--interval--${interval.value}`"
		)
		//- v-mods="{ isSelected: highlightedInterval == interval.value }"
		//- @click.left="update('highlightedInterval', highlightedInterval == interval.value ? null : interval.value)"

		p.interval__item__note {{ interval.note }}
		p.interval__item__name(v-html="interval.shortName")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { MAX_NB_SEQUENCES }   from '@/modules/constants'
import { notesNames, models } from '@/modules/music'
import { filterObject }       from '@/modules/object'

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

	created()
	{
		this.MAX_NB_SEQUENCES = MAX_NB_SEQUENCES;
		this.tonalities       = notesNames;
		this.models           = [
			{ label: 'Scales',    options: filterObject(models, key => !key.startsWith('arp-')) },
			{ label: 'Arpeggios', options: filterObject(models, key =>  key.startsWith('arp-')) },
		];
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

}

</style>
<!--}}}-->
