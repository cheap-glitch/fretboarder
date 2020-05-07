

<!-- components/ScalesList.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ScalesList

	div.scales
		//- div.scale__tools
			//- Hide all scales
			VButton.scale__tools__hide-all(
				v-show="scales.length >= 2"

				icon="low-vision"
				size="small"
				tooltip="Hide all"

				@click="$store.commit('scales/hideAllScales')"
			)
			//- Remove all scales
			VButton(
				v-show="scales.length >= 2"

				icon="trash-alt"
				size="small"
				tooltip="Remove all"

				@click="$store.commit('scales/removeAllScales')"
			)

		//- Scales & arpeggios
		ScalesListItem(
			v-for="scale in scales"
			:key="`scale--${scale.index}--${scale.type}--${scale.model}--${scale.tonality}`"

			v-bind="scale"
			:nb-scales="scales.length"
			)

	//- Text to display when there are no scales
	p.text-no-scales(
		v-show="scales.length == 0"
		) Click on the #[fa-icon(:icon="['far', 'plus-circle']")] button to add a new scale or arpeggio.

	//- Add a new scale
	VButton.button-add-scale(
		v-show="scales.length < MAX_NB_SCALES"

		icon="plus-circle"
		tooltip-text="Add a new scale or arpeggio"
		tooltip-placement="bottom"

		@click="$store.commit('scales/addScale')"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }           from 'vuex-pathify'

import { MAX_NB_SCALES } from '@/stores/scales'
import ScalesListItem    from '@/components/ScalesListItem'

export default {
	name: 'ScalesList',

	components: {
		ScalesListItem,
	},

	computed: {
		scales: get('scales/scales'),
	},

	created()
	{
		this.MAX_NB_SCALES = MAX_NB_SCALES;
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.ScalesList {
	@include space-children-v(20px);
}

.scales {
	@include space-children-v(20px);
}

//- .scale__tools {
//- 	display: none;

//- 	@include mq($from: desktop)
//- 	{
//- 		display: flex;
//- 		justify-content: flex-end;
//- 	}
//- }

//- .scale__tools__hide-all {
//- 	/**
//- 	 * Place the "Hide all" tool above the "Hide" button of the scales
//- 	 *                 ↓ three icons  +  ↓ one separator
//-	 *
//-	 * @TODO : put values in layout.scss
//- 	 */
//- 	margin-right: calc(3*(22px + 10px) + 24px);
//- }

.button-add-scale {
	font-size: 30px;
}

.text-no-scales {
	text-align: center;

	color: var(--color--text);
}

</style>
<!--}}}-->
