

<!-- components/VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

//- Create a mixin for the list of <option> tags
mixin options(optionsList)
	option(
		v-for=`option in ${optionsList}`
		:key="`option--${option.value}`"

		:value="option.value"
		:selected="option.value === value"
	) {{ cleanLabel(option.label) }}

select.VSelect(
	@change="selectOption"
	)

	//- Grouped options
	template(v-if="false")
		optiongroup(
			v-for="group in optionGroups"
			:key="`option-group--${group.label.toLowerCase().replace(/\s+/g, '-')}`"

			:label="group.label"
			)
			+options("group.options")

	//- Simple options list
	template(v-else)
		+options("optionGroups[0].options")

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
			type: Object,
			required: true,
		},
		value: {
			type: [Number, String],
			required: true,
		},
		isValueNumeric: {
			type: Boolean,
			default: false,
		},
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

	methods: {
		selectOption(event)
		{
			this.$emit('change', this.isValueNumeric ? Number.parseInt(event.target.value, 10) : event.target.value);
		},
		cleanLabel(label)
		{
			return label.replace(/<\/?sup>/g, '');
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VSelect {
}

</style>
<!--}}}-->
