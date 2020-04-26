

<!-- VButtonText.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VButtonText(v-mods="{ isFilled }")
	p {{ text }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VButtonText',

	props: {
		text: {
			type: String,
			required: true,
		},
		isFilled: {
			type: Boolean,
			default: false,
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VButtonText {
	display: flex;
	@include space-children-h(5px);

	padding: 6px;

	border-width: 2px;
	border-style: solid;
	border-radius: 6px;

	appearance: none;
	background-image: none;

	cursor: pointer;

	&:not(.is-filled) {
		background-color: transparent;

		transition: border-color 0.2s;

		&:not(:hover) {
			border-color: transparent;
		}
	}

	&.is-filled {
		transition: color 0.2s, background-color 0.2s;

		&:not(:hover) {
			background-color: transparent;
		}
	}
}

</style>
<!--}}}-->


<!--{{{ Global SCSS -->
<style lang="scss">

.VButtonText > * {
	cursor: pointer;
}

</style>
<!--}}}-->
