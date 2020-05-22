

<!-- components/FretboardSequences.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardSequences: FretboardSequencesItem(
	v-for="seq in sequences"
	:key="`sequence--${seq.index}`"

	v-bind="seq"
	:nb-sequences="sequences.length"
	)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                from 'vuex-pathify'

import FretboardSequencesItem from '@/components/FretboardSequencesItem'

export default {
	name: 'FretboardSequences',

	components: {
		FretboardSequencesItem,
	},

	computed: {
		sequences: get('sequences/sequences'),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardSequences {
	@include space-children-v(20px);
}

</style>
<!--}}}-->
