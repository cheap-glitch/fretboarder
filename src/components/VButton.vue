

<!-- VButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VButton(
	@click.left="clickHandler"
	@mouseenter="showTooltip = true"
	@mouseleave="showTooltip = clicked = false"
	)

	button.VButton__button(
		ref="button"
		v-mods="{ isDisabled }"
		)
		fa-icon.VButton__icon(
			v-mods="{ isActive, isDisabled }"

			:icon="Array.isArray(icon) ? icon : ['far', icon]"
			:flip="isFlipped ? 'horizontal' : null"
			:class="`size-${size}`"
			)

	p.VButton__title {{ title }}

	VTooltip(
		:target="$refs.button || false"
		:placement="tooltipPlacement"
		:delay="500"
		:is-open="!isTooltipDisabled && !clicked && showTooltip"
		)
		p {{ tooltipText }}

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
			validator: v => ['normal', 'big'].includes(v)
		},
		title: {
			type: String,
			default: '',
		},
		tooltipText: {
			type: String,
			required: true,
		},
		tooltipPlacement: {
			type: String,
			default: 'top',
			validator: v => ['top', 'bottom'].includes(v)
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
			clicked:     false,
			showTooltip: false,
		}
	},

	computed: {
		isMobileDevice: get('isMobileDevice'),
	},

	methods: {
		clickHandler()
		{
			// Unfocus the button
			this.$refs.button.blur();

			if (this.isDisabled)
				return;

			this.clicked = true;
			this.$emit('click');
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VButton {
	@include mq($until: desktop)
	{
		@include center-column;
	}

	@include mq($from: desktop)
	{
		@include center-content;
	}
}

.VButton__button {
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

	//- @include mq($from: desktop)
	//- {
		&.size-normal { font-size: layout.$button-size-normal; }
		&.size-big    { font-size: layout.$button-size-big;    }
	//- }
}

.VButton__title{
	margin-top: 10px;

	color: var(--color--text--secondary);

	@include mq($from: desktop)
	{
		display: none;
	}
}

</style>
<!--}}}-->
