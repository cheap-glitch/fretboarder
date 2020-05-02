

<!-- VButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VButton(
	ref="wrapper"
	@click.left="click"
	)
	button.VButton__button(
		ref="button"
		v-mods="{ isDisabled }"

		@click.left="click"
		@mouseenter="showTooltip = true"
		@mouseleave="showTooltip = hasBeenClicked = false"
		)

		fa-icon.VButton__icon(
			:icon="Array.isArray(icon) ? icon : ['far', icon]"
			:class="`size-${size}`"
			v-mods="{ isActive, isDisabled, isFlipped }"
			)

	VTooltip(
		v-if="!isMobileDevice && !isTooltipDisabled && !hasBeenClicked"

		:target="$refs.button || false"
		:placement="tooltipPlacement"
		:delay="500"
		:is-open="showTooltip && !isTooltipDisabled"
		)
		p {{ tooltip }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get } from 'vuex-pathify'

export default {
	name: 'VButton',

	props: {
		icon: {
			type: [Array, String],
			required: true,
		},
		size: {
			type: String,
			default: 'normal',
			validator: v => ['normal', 'small'].includes(v)
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
			showTooltip:    false,
			hasBeenClicked: false,
		}
	},

	computed: {
		isMobileDevice: get('isMobileDevice'),
	},

	methods: {
		click(event)
		{
			// Prevent the button from registering the click twice
			event.stopPropagation();

			if (this.isDisabled
			// Disable the wider click zone on desktop
			|| (event.target === this.$refs.wrapper && !this.isMobileDevice))
				return;

			this.hasBeenClicked = true;
			this.$emit('click');
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VButton {
	@include center-content;
}

.VButton__button {
	display: block;

	border: none;
	appearance: none;
	background-color: transparent;

	cursor: pointer;
}

.VButton__icon {
	color: var(--color--text--secondary);

	&:not(.is-active):not(.is-disabled):hover {
		color: var(--color--hover);
	}

	&.is-disabled {
		color: var(--color--bg--highlight);

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

	&.size-normal { @include square(36px); }
	&.size-small  { @include square(26px); }

	@include mq($from: desktop)
	{
		&.size-normal { @include square(26px); }
		&.size-small  { @include square(22px); }
	}
}

</style>
<!--}}}-->
