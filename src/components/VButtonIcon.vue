

<!-- VButtonIcon.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VButtonIcon(
	ref="button"
	v-mods="{ isDisabled }"

	@click.left="click"
	@mouseenter="showTooltip = true"
	@mouseleave="showTooltip = false"
	)

	fa-icon.icon(
		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		:class="`size-${size}`"
		v-mods="{ isActive, isDisabled, isFlipped }"
		)

	VTooltip(
		v-if="!isMobileDevice"
		v-show="showTooltip && !isTooltipDisabled"

		:target="$refs.button || false"
		:placement="tooltipPlacement"
		:is-open="showTooltip && !isTooltipDisabled"
		)
		p {{ tooltip }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get } from 'vuex-pathify'

export default {
	name: 'VButtonIcon',

	props: {
		icon: {
			type: [Array, String],
			required: true,
		},
		size: {
			type: String,
			default: 'normal',
			validator: v => ['big', 'normal', 'small'].includes(v)
		},
		tooltip: {
			type: String,
			required: true,
		},
		tooltipPlacement: {
			type: String,
			default: 'top',
			validator: v => ['top', 'bottom'].includes(v),
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isFlipped: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isTooltipDisabled: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			showTooltip: false,
		}
	},

	computed: {
		...get(['isMobileDevice']),
	},

	methods: {
		click()
		{
			if (!this.isDisabled) this.$emit('click');
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VButtonIcon {
	display: block;

	border: none;
	appearance: none;
	background-color: transparent;

	cursor: pointer;
}

.icon {
	color: var(--color--text--secondary);

	transition: color 0.2s;

	&:not(.is-active):hover {
		color: var(--color--hover);
	}

	&.is-disabled {
		color: var(--color--text--disabled);

		cursor: not-allowed;
	}

	&.is-active {
		color: var(--color--highlight);
	}

	&.is-flipped {
		transform: scaleX(-1);
	}

	&.is-disabled {
		cursor: not-allowed;
	}

	&.size-big    { @include square(40px); }
	&.size-normal { @include square(26px); }
	&.size-small  { @include square(22px); }
}

</style>
<!--}}}-->
