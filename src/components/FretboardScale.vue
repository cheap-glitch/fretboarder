

<!-- FretboardScale.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardScale(
	v-mods="{ isAlone: nbScales == 1 }"
	)

	div.color-dot(:style="{ 'background-color': color }")

	//----------------------------------------------------------------------
	//- Scale properties
	//----------------------------------------------------------------------
	div.scale-props

		//- Type
		VSelect.select-type(
			id="scale-type"
			:value="type"
			:options="{ scale: 'Scale', arpeggio: 'Arpeggio' }"
			@change="updateType"
			)
		//- Tonality
		VSelect.select-tonality(
			id="scale-tonality"
			:value="tonality"
			:options="tonalities"
			@change="_v => $emit('update:tonality', _v)"
			)
		//- Model
		VSelect.select-model(
			id="scale-model"
			:value="model"
			:options="modelsNames"
			@change="_v => $emit('update:model', _v)"
			)
		//- Position
		VSelect.select-position(
			v-show="type == 'scale'"
			id="scale-position"
			:value="position"
			:options="positions"
			is-value-number
			@change="_v => $emit('update:position', _v)"
			)

	//----------------------------------------------------------------------
	//- Tools
	//----------------------------------------------------------------------
	div.scale-tools

		//- Show/hide
		VButton(
			:icon="isVisible ? 'eye' : 'eye-slash'"
			size="small"
			:tooltip="isVisible ? 'Hide' : 'Show'"
			@click="$emit('update:isVisible', !isVisible)"
			)
		//- Focus
		VButton(
			v-show="nbScales > 1"
			icon="bullseye"
			size="small"
			tooltip="Focus"
			:is-active="isFocused"
			@click="$emit('toggle-focus-scale', id)"
			)
		//- Show root
		VButton(
			icon="registered"
			size="small"
			tooltip="Show root notes"
			:is-active="isShowingRootNotes"
			@click="$emit('update:isShowingRootNotes', !isShowingRootNotes)"
			)
		//- Show intersections only
		VButton(
			v-show="nbScales > 1"
			:icon="['fas', 'intersection']"
			size="small"
			tooltip="Show only intersections with other scales"
			:is-active="isShowingIntersections"
			@click="$emit('update:isShowingIntersections', !isShowingIntersections)"
			)

		div.scale-tools__separator(v-mods="darkMode")

		//- Duplicate
		VButton(
			icon="copy"
			size="small"
			tooltip="Duplicate"
			@click="$emit('duplicate-scale', id)"

			:is-disabled="nbScales == 5"
			)
		//- Remove
		VButton(
			icon="trash-alt"
			size="small"
			tooltip="Remove"
			@click="$emit('remove-scale', id)"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapGetters} from 'vuex'

import data          from '@/modules/data'
import { mapObject } from '@/modules/object'

export default {
	name: 'FretboardScale',

	props: {
		nbScales: {
			type: Number,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
			validator: _v => ['arpeggio', 'scale'].includes(_v)
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
		isVisible: {
			type: Boolean,
			default: true,
		},
		isFocused: {
			type: Boolean,
			default: false,
		},
		isShowingRootNotes: {
			type: Boolean,
			default: false,
		},
		isShowingIntersections: {
			type: Boolean,
			default: false,
		},
	},

	static() {
		return {
			tonalities: data.tonalities,
			positions:  {
				0: 'Whole',
				1: '1st pos',
				2: '2nd pos',
				3: '3nd pos',
				4: '4nd pos',
				5: '5nd pos',
			}
		}
	},

	computed: {
		models()
		{
			return (this.type == 'scale') ? data.scales : data.arpeggios;
		},
		modelsNames()
		{
			return mapObject(this.models, (_key, _model) => ({ name: _model.name, value: _key }));
		},
		...mapGetters([
			'darkMode',
		])
	},

	methods: {
		updateType(_v)
		{
			// Reset the model when the type of scale is changed
			this.$emit('update:model', 'maj');

			// Update the type
			this.$emit('update:type', _v);
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.FretboardScale {
	display: flex;
	align-items: center;
	@include space-children-h(10px);

	width: 780px;

	&.is-alone {
		width: 720px;
	}
}

.color-dot {
	@include circle(10px);
	flex: 0 0 auto;
}

.scale-props,
.scale-tools {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.scale-props {
	flex: 1 1 100%;
}

.scale-tools__separator {
	@include circle(4px);
	flex: 0 0 auto;

	background-color: lightgray;

	&.dark-mode {
		background-color: $color-ebony-clay;
	}
}

.select-type     { max-width: 120px; }
.select-tonality { max-width: 60px;  }
.select-model    { max-width: 220px; }
.select-position { max-width: 100px; }

</style>
<!--}}}-->
