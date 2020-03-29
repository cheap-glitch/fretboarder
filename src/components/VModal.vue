

<!-- components/VModal.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VModal: transition(name="fade")

	div.modal(v-if="isOpen")

		//- Content slot
		slot

		//- Close button
		fa-icon.modal__button-close(
			:icon="['far', 'times-circle']"

			@click.left="$emit('close')"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VModal',

	props: {
		isOpen: {
			type: Boolean,
			default: false,
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.modal {
	position: fixed;
	z-index: 1000;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-color: snow;
}

.modal__button-close {
	position: fixed;
	z-index: 100;
	top: 20px;
	right: 20px;

	@include square(40px);

	color: gray;

	cursor: pointer;
}

</style>
<!--}}}-->
