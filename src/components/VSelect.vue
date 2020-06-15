

<!-- components/VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

//- Generate a list of <option> tags
mixin options(options)
	option(
		v-for=`(optionLabel, optionValue) of ${options}`
		:key="`option--${optionValue}`"

		:value="optionValue"
		:selected="optionValue === value"
	) {{ optionLabel.name || optionLabel }}

div.VSelect
	//- Menu
	select.select(
		ref="select"
		:value="value"
		:disabled="isDisabled"

		@change="selectOption"
		)
		//- Grouped options
		template(v-if="Array.isArray(options)")
			optgroup(
				v-for="optionGroup of options"
				:key="`option-group--${optionGroup.label.toLowerCase().replace(/\s+/g, '-')}`"

				:label="optionGroup.label"
				)
				+options("optionGroup.options")

		//- Simple options list
		template(v-else)
			+options("options")

	//- Fake select bar
	div.bar
		//- Current value
		p.bar__text(v-html="selectedOptionLabel")

		//- Chevron
		fa-icon.bar__chevron(:icon="['far', 'chevron-down']")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { formatOrdinalSuffix } from '@/modules/text'

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
		isDisabled: {
			type: Boolean,
			default: false,
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
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VSelect {
	display: grid;
}

.select {
	grid-area: 1 / 1;

	padding-right: 20px;

	opacity: 0.0001;

	&:disabled {
		cursor: not-allowed;
	}
}

.bar {
	display: flex;
	align-items: center;
	justify-content: space-between;

	grid-area: 1 / 1;

	padding: 8px 10px;

	border: 1px solid var(--color--border);
	border-radius: 4px;

	color: var(--color--text);
	background-color: var(--color--bg--accent);

	.select:not(:focus):not(:disabled):hover + & {
		border-color: var(--color--hover);
		background-color: var(--color--bg--highlight);
	}

	.select:focus + & {
		border-color: var(--color--hover);
	}

	.select:disabled + & {
		opacity: 0.5;

		cursor: not-allowed;
	}
}

.bar__text {
	font-size: 1.5rem;

	.select:disabled + .bar & {
		cursor: not-allowed;
	}
}

.bar__chevron {
	font-size: 1.2rem;
	color: var(--color--text--secondary);

	.select:not(:focus):not(:disabled):hover + .bar & {
		color: var(--color--hover);
	}
}

</style>
<!--}}}-->
