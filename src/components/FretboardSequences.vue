<!--{{{ Pug -->
<template lang="pug">

div.FretboardSequences
	div.tools
		//- Add a new sequence
		VButton.tools__add-sequence(
			v-show="sequences.length < MAX_NB_SEQUENCES"

			text="Add new scale/arpeggio"
			icon="plus"

			@click="$store.commit('sequences/add')"
			)
		//- Hide all sequences
		VButton(
			v-show="sequences.length >= 2"

			text="Hide all"
			icon="eye-slash"
			is-flipped

			@click="$store.commit('sequences/hideAll')"
		)
		//- Remove all sequences
		VButton(
			v-show="sequences.length >= 2"

			text="Remove all"
			icon="trash-alt"

			@click="$store.commit('sequences/removeAll')"
		)

	//- Text to display when there are no sequences
	p.text-no-scales(v-show="sequences.length == 0") Add a new scale or arpeggio to see it displayed on the fretboard.

	div.sequences: FretboardSequencesItem(
		v-for="(seq, index) of sequences"
		:key="`sequence--${seq.id}`"

		:index="index"
		v-bind="seq"
		:nb-sequences="sequences.length"
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

	created() {
		this.MAX_NB_SEQUENCES = MAX_NB_SEQUENCES;
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardSequences {
	@include mq($from: desktop) {
		@include space-children-v(40px);

		max-width: 1400px;

		margin: auto;
		padding: 0 10px;
	}
}

.sequences {
	@include mq($from: desktop) {
		@include space-children-v(40px);
	}
}

.tools {
	@include mq($until: desktop) {
		display: grid;
		grid-template: auto / 1fr 1fr;
		gap: 1px;

		// Fix for the box-shadow border hack
		margin: 1px 0;
	}

	@include mq($from: desktop) {
		display: flex;
		justify-content: center;
		@include space-children-h(10px);
	}
}

.tools__add-sequence {
	@include mq($until: desktop) {
		grid-column: 1 / span 2;
	}
}

.text-no-scales {
	text-align: center;
	color: var(--color--text);

	@include mq($until: desktop) {
		line-height: 1.8;

		padding: 20px;

		color: var(--color--text--secondary);
	}
}

</style>
<!--}}}-->
