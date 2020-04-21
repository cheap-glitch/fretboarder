

<!-- components/ScalesList.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ScalesList

	div.scales
		div.scale__tools(
			v-if="!isMobileDevice"
			)
			//- Hide all scales
			VButtonIcon.scale__tools__hide-all(
				v-show="scales.length >= 2"

				icon="low-vision"
				size="small"
				tooltip="Hide all"

				@click="$store.commit('scales/hideAllScales')"
			)
			//- Remove all scales
			VButtonIcon#help-tour-step--4(
				v-show="scales.length >= 2"

				icon="trash-alt"
				size="small"
				tooltip="Remove all"

				@click="$store.commit('scales/removeAllScales')"
			)

		//- Scales & arpeggios
		ScalesListItem(
			v-for="scale in scales"
			:key="`scale--${scale.id}`"

			v-bind="scale"
			)

	//- Text to display when there are no scales
	p.text-no-scales(
		v-show="scales.length == 0"
		) Click on the #[fa-icon(:icon="['far', 'plus-circle']")] button to add a new scale or arpeggio.

	//- Add a new scale
	VButtonIcon.button-add-scale#help-tour-step--5(
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

import ScalesListItem   from '@/components/ScalesListItem'

export default {
	name: 'ScalesList',

	components: {
		ScalesListItem,
	},

	computed: {
		...get([
			'scales/scales',
			'scales/maxNbScales',

			'isMobileDevice',
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

.ScalesList {
	@include space-children-v(20px);

	@include mq($from: desktop)
	{
		@include center-column;
	}
}

.scales {
	@include space-children-v(20px);
}

.scale__tools {
	display: flex;
	justify-content: flex-end;
}

.scale__tools__hide-all {
	/**
	 * Place the "Hide all" tool above the "Hide" button of the scales
	 *
	 *                 three icons       separator
	 */
	margin-right: calc(3*(22px + 10px) + 24px);
}

.text-no-scales {
	color: var(--color--text);
}

.button-add-scale {
	@include mq($until: desktop)
	{
		margin: auto;
	}
}

</style>
<!--}}}-->
