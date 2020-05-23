

<!-- components/VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

//- List of <option> tags
mixin options(optionsList)
	option(
		v-for=`option in ${optionsList}`
		:key="`option--${option.value}`"

		:value="option.value"
		:selected="option.value === value"
	) {{ option.label }}

div.VSelect

	//- Menu
	select.select(
		ref="select"
		@change="selectOption"
		)
		//- Grouped options
		template(v-if="Array.isArray(options)")
			optgroup(
				v-for="group in optionGroups"
				:key="`option-group--${group.label.toLowerCase().replace(/\s+/g, '-')}`"

				:label="group.label"
				)
				+options("group.options")

		//- Simple options list
		template(v-else)
			+options("optionGroups[0].options")

	//- Fake select bar
	div.bar
		//- Current value
		p(v-html="selectedOptionLabel")

		//- Chevron
		fa-icon.bar__chevron(:icon="['far', 'chevron-down']")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { isObject, mapObjectToArray } from '@/modules/object'

export default {
	name: 'VSelect',

	model: {
		prop:  'value',
		event: 'change',
	},

	props: {
		options: {
			type: [Object, Array],
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
		isValueNumeric: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			selectedOptionLabel: '',
		}
	},

	computed: {
		optionGroups()
		{
			return (
				// Always wrap options in an option group
				Array.isArray(this.options) ? this.options : [{ label: 'default', options: this.options }]
			)
			// Turn the options object into an options list
			.map(group => ({
				label:   group.label,
				options: mapObjectToArray(group.options, (key, value) => ({ value: key, label: isObject(value) ? value.name : value })),
			}));
		},
	},

	mounted()
	{
		this.updateSelectedOptionLabel();
	},

	methods: {
		selectOption(event)
		{
			this.$emit('change', this.isValueNumeric ? Number.parseInt(event.target.value, 10) : event.target.value);
			this.updateSelectedOptionLabel();
		},
		updateSelectedOptionLabel()
		{
			this.selectedOptionLabel = this.labelFormatter(this.value, this.$refs.select.selectedOptions[0].label.replace(/(\d)th/, '$1<sup>th</sup>'));
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VSelect {
	position: relative;

	display: inline-block;
}

.select {
	position: relative;
	z-index: 2;

	opacity: 0.0001;
}

.bar {
	display: flex;
	align-items: center;
	justify-content: space-between;

	position: absolute;
	z-index: 1;
	top: 50%;
	left: 0;
	right: 0;
	transform: translateY(-50%);

	padding: 8px 10px;

	border: 1px solid var(--color--border);
	border-radius: 4px;

	.select:hover:not(:focus) + & {
		background-color: var(--color--bg--highlight);
	}

	.select:focus + & {
		border-color: var(--color--hover);
	}
}

.bar__chevron {
	font-size: 1.2rem;
	color: var(--color--text--secondary);

	.select:focus + .bar & {
		color: var(--color--hover);
	}
}

</style>
<!--}}}-->
