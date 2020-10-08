

<!-- components/VToggleButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VToggleButton

	div.label
		fa-icon.label__icon(
			v-if="icon.length"
			:icon="Array.isArray(icon) ? icon : ['far', icon]"
			)
		p.label__text {{ text }}

	div.toggle
		div.toggle__handle(v-mods="{ isActive }")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VToggleButton',

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
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VToggleButton {
	display: flex;
	align-items: center;
	justify-content: space-between;
	@include space-children-h(20px);

	padding: 16px 16px 16px 14px;

	border: none;
	border-bottom: 1px solid var(--color--bg--highlight);

	appearance: none;
	background-color: transparent;

	cursor: pointer;

	&:first-child {
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
	}

	&:last-child {
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}

	@include mq($from: desktop) {
		padding: 8px 14px 8px 10px;

		border-bottom: none;

		&:hover {
			background-color: var(--color--bg--highlight);
		}
	}
}

.label {
	display: flex;
	@include space-children-h(20px);

	font-size: 1.6rem;

	@include mq($from: desktop) {
		@include space-children-h(10px);
	}
}

.label__icon {
	width: 1.6rem;

	color: var(--color--text--secondary);
}

.label__text {
	color: var(--color--text);

	cursor: pointer;

	.VToggleButton:focus & {
		color: var(--color--hover);
	}
}

.toggle {
	position: relative;

	width: 22px;
	height: 10px;
	@include pill;

	background-color: var(--color--border);

	cursor: pointer;

	@include mq($from: desktop) {
		width: 20px;
		height: 8px;
	}
}

.toggle__handle {
	position: absolute;
	top: 50%;

	@include circle(16px);

	transition: left 200ms ease-in-out;

	transform: translate(-50%, -50%);

	filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));

	&:not(.is-active) {
		left: 0;
		background-color: var(--color--text--secondary);
	}

	&.is-active {
		left: 100%;
		background-color: var(--color--hover);
	}

	@include mq($from: desktop) {
		@include circle(14px);
	}
}

</style>
<!--}}}-->
