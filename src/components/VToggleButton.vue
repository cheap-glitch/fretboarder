

<!-- components/VToggleButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VToggleButton
	p.text {{ text }}
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

	padding: 8px 14px 8px 10px;

	border: none;

	appearance: none;
	background-color: transparent;

	cursor: pointer;

	&:hover {
		background-color: var(--color--bg--highlight);
	}

	&:first-child {
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
	}

	&:last-child {
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
}

.text {
	color: var(--color--text);

	cursor: pointer;
}

.toggle {
	position: relative;

	width: 20px;
	height: 8px;
	@include pill;

	background-color: var(--color--border);

	cursor: pointer;
}

.toggle__handle {
	position: absolute;
	top: 50%;

	@include circle(14px);

	transition: left 200ms ease-in-out;

	transform: translate(-50%, -50%);

	&:not(.is-active) {
		left: 0;
		background-color: var(--color--text--secondary);
	}

	&.is-active {
		left: 100%;
		background-color: var(--color--hover);
	}
}

</style>
<!--}}}-->
