

<!-- components/FretboardSequences.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSequences
	div.tools
		//- Add a new sequence
		VButton(
			v-show="!isMobileDevice && sequences.length < MAX_NB_SEQUENCES"

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

	//- Text to display when there are no sequences
	p.text-no-scales(v-show="sequences.length == 0") Add a new scale or arpeggio to see it displayed on the fretboard.

	div.sequences: FretboardSequencesItem(
		v-for="seq of sequences"
		:key="`sequence--${seq.index}`"

		v-bind="seq"
		:nb-sequences="sequences.length"
		)

	//- "New scale" button for mobile
	VButton.add-button-mobile(
		v-show="isMobileDevice && sequences.length < MAX_NB_SEQUENCES"

		icon="plus"
		title="Add new scale/arpeggio"

		@click="$store.commit('sequences/add')"
		)

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
		...get('sequences', ['sequences']),

		...get(['isMobileDevice']),
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
	@include space-children-v(40px);

	@include mq($from: desktop)
	{
		max-width: 1400px;
		margin: auto;
	}
}

.sequences {
	@include space-children-v(20px);

	@include mq($from: desktop)
	{
		@include space-children-v(40px);
	}
}

.tools {
	display: flex;
	justify-content: center;
	@include space-children-h(10px);
}

.text-no-scales {
	text-align: center;
	color: var(--color--text);
}

.add-button-mobile {
	margin: auto;
}

</style>
<!--}}}-->
