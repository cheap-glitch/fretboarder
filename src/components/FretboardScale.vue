

<!-- FretboardScale.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardScale

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
			@change="_value => $emit('update:tonality', _value)"
			)
		//- Model
		VSelect(
			id="scale-model"
			:value="model"
			:options="modelsNames"
			@change="_value => $emit('update:model', _value)"
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

		div.scale-tools__separator

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
			:icon="['far', 'trash-alt']"
			size="small"
			tooltip="Remove"
			@click="$emit('remove-scale', id)"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import data          from '@/modules/data'
import { mapObject } from '@/modules/object'

export default {
	name: 'FretboardScale',

	props: {
		id: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			required: true,
			validator: _v => ['arpeggio', 'scale'].includes(_v)
		},
		model: {
			type: String,
			required: true,
		},
		tonality: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		nbScales: {
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
	},

	static() {
		return {
			tonalities: data.tonalities,
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
	},

	methods: {
		updateType(_value)
		{
			// Reset the model when the type of scale is changed
			this.$emit('update:model', 'maj');

			// Update the type
			this.$emit('update:type', _value);
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
}

.select-type     { max-width: 120px; }
.select-tonality { max-width: 60px;  }

</style>
<!--}}}-->
