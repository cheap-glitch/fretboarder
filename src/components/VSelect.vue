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

		@change="$emit('change', $event.target.value)"
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
	div.bar(v-mods="{ isContained, isFirstItem, isLastItem }")

		div.bar__label
			//- Icon
			div.label__icon(v-if="icon.length"): fa-icon(:icon="Array.isArray(icon) ? icon : ['far', icon]")
			//- Current value
			p.label__text(v-html="selectedOptionLabel")

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
		icon: {
			type: [Array, String],
			default: '',
		},
		labelPrefix: {
			type: String,
			default: '',
		},
		labelFormatter: {
			type: Function,
			default: (value, label) => label,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isContained: {
			type: Boolean,
			default: false,
		},
		isFirstItem: {
			type: Boolean,
			default: false,
		},
		isLastItem: {
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

	mounted() {
		this.updateSelectedOptionLabel();
	},

	methods: {
		async updateSelectedOptionLabel() {
			await this.$nextTick();
			this.selectedOptionLabel = `${this.labelPrefix} ${this.labelFormatter(this.value, formatOrdinalSuffix(this.$refs.select.selectedOptions[0].label))}`;
		}

	},
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

	padding: 16px 16px 16px 14px;

	color: var(--color--text);

	&.is-contained {
		border-bottom: 1px solid var(--color--bg--highlight);
	}

	&:not(.is-contained) {
		border: 1px solid var(--color--border);
		border-radius: 4px;

		background-color: var(--color--bg--accent);
	}

	.select:disabled + & {
		opacity: 0.5;

		cursor: not-allowed;
	}

	@include mq($from: desktop) {
		padding: 8px 10px;

		.select:not(:disabled):hover + & {
			border-color: var(--color--hover);
			background-color: var(--color--bg--highlight);
		}

		.select:focus + & {
			border-color: var(--color--hover);
		}

		&.is-contained {
			border: none;
		}

		&.is-first-item {
			border-top-left-radius: 4px;
			border-top-right-radius: 4px;
		}

		&.is-last-item {
			border-bottom-left-radius: 4px;
			border-bottom-right-radius: 4px;
		}
	}
}

.bar__label {
	display: flex;
	@include space-children-h(20px);

	font-size: 1.6rem;

	.select:focus + .bar.is-contained & {
		color: var(--color--hover);
	}

	@include mq($from: desktop) {
		@include space-children-h(10px);
	}
}

.label__icon {
	width: 1.6rem;

	color: var(--color--text--secondary);
}

.label__text {
	.select:disabled + .bar & {
		cursor: not-allowed;
	}
}

.bar__chevron {
	font-size: 1.4rem;
	color: var(--color--text--secondary);

	.select:focus + .bar.is-contained & {
		color: var(--color--hover);
	}

	@include mq($from: desktop) {
		font-size: 1.2rem;

		.select:not(:focus):not(:disabled):hover + .bar & {
			color: var(--color--hover);
		}
	}
}

</style>
<!--}}}-->
