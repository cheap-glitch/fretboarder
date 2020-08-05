

<!-- components/VToggleButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VToggleButton
	p.text {{ text }}
	div.toggle: div.toggle__handle

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
	justify-content: space-between;

	border: none;
	appearance: none;
	background-color: transparent;

	cursor: pointer;
}

.text {
	color: var(--color--text);

	cursor: pointer;
}

.toggle {
	position: relative;

	width: 20px;
	height: 6px;
	@include pill;

	border: 2px solid var(--color--bg--highlight);

	cursor: pointer;
}

.toggle__handle {
	position: absolute;
	top: 0;
	left: 0;

	@include circle(10px);

	background-color: var(--color--border);
}

</style>
<!--}}}-->
