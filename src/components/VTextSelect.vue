

<!-- components/VTextSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VTextSelect
	//- Menu
	select.select(
		ref="select"
		:value="value"
		@change="selectOption"
		)
		option(
			v-for=`(optionLabel, optionValue) of options`
			:key="`option--${optionValue}`"

			:value="optionValue"
			:selected="optionValue === value"
		) {{ optionLabel.name || optionLabel }}

	//- Icon
	fa-icon.icon(:icon="Array.isArray(icon) ? icon : ['far', icon]")

	//- Text
	p.text {{ selectedOptionLabel }}

	//- Chevron
	fa-icon.chevron(:icon="['far', 'chevron-down']")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { formatOrdinalSuffix } from '@/modules/text'

export default {
	name: 'VTextSelect',

	model: {
		prop:  'value',
		event: 'change',
	},

	props: {
		options: {
			type: Object,
			required: true,
		},
		value: {
			type: [String, Number],
			required: true,
		},
		labelFormatter: {
			type: Function,
			default: (value, label) => label,
		},
		icon: {
			type: [Array, String],
			default: '',
		},
	},

	data() {
		return {
			selectedOptionLabel: '',
		}
	},

	watch: {
		value: 'updateSelectedOptionLabel',
	},

	mounted()
	{
		this.updateSelectedOptionLabel();
	},

	methods: {
		selectOption(event)
		{
			this.$emit('change', event.target.value);
			this.updateSelectedOptionLabel();
		},
		async updateSelectedOptionLabel()
		{
			await this.$nextTick();
			this.selectedOptionLabel = this.labelFormatter(this.value, formatOrdinalSuffix(this.$refs.select.selectedOptions[0].label));
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VTextSelect {
	display: flex;
	align-items: center;
	@include space-children-h(6px);

	position: relative;
	overflow-x: hidden;

	font-size: 1.4rem;

	color: var(--color--text);
}

.select {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	opacity: 0.0001;
}

.chevron {
	font-size: 1.2rem;
}

</style>
<!--}}}-->
