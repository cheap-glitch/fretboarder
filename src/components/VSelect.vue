

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

import Vue from 'vue'

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
			this.$emit('change', this.isValueNumeric ? Number.parseInt(event.target.value, 10) : event.target.value);
			this.updateSelectedOptionLabel();
		},
		updateSelectedOptionLabel()
		{
			Vue.nextTick(() => {
				this.selectedOptionLabel = this.labelFormatter(this.value, this.$refs.select.selectedOptions[0].label.replace(/(\d)th/, '$1<sup>th</sup>'));
			});
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

	padding-right: 20px;

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

	color: var(--color--text);

	.select:hover:not(:focus) + & {
		background-color: var(--color--bg--highlight);
	}

	.select:focus + & {
		border-color: var(--color--hover);
	}
}

.bar__text {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
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
