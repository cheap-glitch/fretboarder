

<!-- components/PageFretboarderScales.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.PageFretboarderScales
	div.scales
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

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }          from 'vuex-pathify'
import { mapMutations } from 'vuex'

import FretboardScale from '@/components/FretboardScale'

export default {
	name: 'PageFretboarderScales',

	components: {
		FretboardScale,
	},

	computed: {
		...get([
			'scales/scales',
			'scales/maxNbScales',

			'darkMode',
		])
	},

	methods: {
		...mapMutations({
			addScale: 'scales/addScale',
		}),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.PageFretboarderScales {
	@include center-column;
	@include space-children-v(20px);
}

.scales {
	@include space-children-v(20px);
}

.no-scales-text.dark-mode {
	color: $color-nepal;
}

</style>
<!--}}}-->
