

<!-- components/FretboardSequences.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSequences
	div.tools
		//- Add a new sequence
		VButton(
			v-show="sequences.length < MAX_NB_SEQUENCES"

			icon="plus"
			title="Add new scale/arpeggio"

			@click="$store.commit('sequences/add')"
			)
		//- Hide all sequences
		VButton(
			v-show="sequences.length >= 2"

			icon="eye-slash"
			is-flipped
			title="Hide all"

			@click="$store.commit('sequences/hideAll')"
		)
		//- Remove all sequences
		VButton(
			v-show="sequences.length >= 2"

			icon="trash-alt"
			title="Remove all"

			@click="$store.commit('sequences/removeAll')"
		)

	FretboardSequencesItem(
		v-for="seq of sequences"
		:key="`sequence--${seq.index}`"

		v-bind="seq"
		:nb-sequences="sequences.length"
		)

	//- Text to display when there are no sequences
	p.text-no-scales(v-show="sequences.length == 0") Add a new scale or arpeggio to see it displayed on the fretboard.

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                from 'vuex-pathify'
import { MAX_NB_SEQUENCES }   from '@/modules/constants'

import FretboardSequencesItem from '@/components/FretboardSequencesItem'

export default {
	name: 'FretboardSequences',

	components: {
		FretboardSequencesItem,
	},

	computed: {
		sequences: get('sequences/sequences'),
	},

	created()
	{
		this.MAX_NB_SEQUENCES = MAX_NB_SEQUENCES;
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardSequences {
	@include space-children-v(20px);

	@include mq($from: desktop)
	{
		@include space-children-v(40px);

		max-width: 1300px;
		margin: auto;
	}
}

.tools {
	display: flex;
	justify-content: center;
	@include space-children-h(10px);
}

.text-no-scales {
	text-align: center;
}

</style>
<!--}}}-->
