

<!-- components/PageFretboarderScales.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.PageFretboarderScales

	div.scales
		div.scale__tools
			//- Hide all scales
			VButtonIcon(
				v-show="scales.length >= 2"

				icon="low-vision"
				size="small"
				tooltip="Hide all"

				@click="$store.commit('scales/hideAllScales')"
			)
			//- Remove all scales
			VButtonIcon(
				v-show="scales.length >= 2"

				icon="trash-alt"
				size="small"
				tooltip="Remove all"

				@click="$store.commit('scales/removeAllScales')"
			)

		//- Scales & arpeggios
		FretboardScale(
			v-for="scale in scales"
			:key="`scale--${scale.id}`"

			v-bind="scale"
			)

	//- Text to display when there are no scales
	p.text-no-scales(
		v-show="scales.length == 0"
		) Click on the #[fa-icon(:icon="['far', 'plus-circle']")] button to add a new scale or arpeggio.

	//- Add a new scale
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

.scale__tools {
	display: flex;
	justify-content: flex-end;
	@include space-children-h(10px);
}

.text-no-scales {
	color: var(--color--text);
}

</style>
<!--}}}-->
