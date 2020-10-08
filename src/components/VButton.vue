<!--{{{ Pug -->
<template lang="pug">

button.VButton(
	v-mods="{ isActive, isDisabled, isDarkModeOn }"
	@click.left="clickButton"
	)

	fa-icon.icon(
		v-if="icon.length"

		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		:flip="isFlipped ? 'horizontal' : null"
		)

	p.text(v-if="text.length") {{ text }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get } from 'vuex-pathify'

export default {
	name: 'VButton',

	props: {
		text: {
			type: String,
			default: '',
		},
		icon: {
			type: [Array, String],
			default: '',
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isFlipped: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		...get(['isDarkModeOn'])
	},

	methods: {
		clickButton() {
			if (!this.isDisabled)
				this.$emit('click');
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VButton {
	display: flex;
	align-items: center;

	padding: 14px 12px;

	// Simulate a border inside a grid
	box-shadow: 0 0 0 1px var(--color--border);
	border: none;

	color: var(--color--text);
	background-color: transparent;

	appearance: none;
	cursor: pointer;

	transition: border-color 200ms, background-color 200ms;

	&.is-disabled {
		border-color: var(--color--border);
		background-color: var(--color--border);

		cursor: not-allowed;
	}

	&.is-active {
		color: var(--color--highlight);
		border-color: var(--color--highlight);

		&:hover, &:not(.is-dark-mode-on) {
			color: white;
			background-color: var(--color--highlight);
		}
	}

	@include mq($until: desktop) {
		justify-content: center;
		@include space-children-h(12px);
	}

	@include mq($from: desktop) {
		@include space-children-h(8px);

		@include pill;

		padding: 4px 8px;

		font-size: 1.4rem;

		border: 1px solid var(--color--bg--highlight);
		box-shadow: none;

		background-color: var(--color--bg--highlight);

		&:not(.is-active):not(.is-disabled):hover {
			color: white;
			border-color: var(--color--hover);
			background-color: var(--color--hover);
		}

		&:focus {
			border-color: var(--color--hover);
		}
	}
}

.icon,
.text {
	cursor: pointer;

	.VButton.is-disabled & {
		cursor: not-allowed;
	}
}

</style>
<!--}}}-->
