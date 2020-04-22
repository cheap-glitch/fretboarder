

<!-- components/VModal.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VModal: transition(name="fade")

	div.modal(v-if="isOpen")

		//- Close button
		div.modal__button-close(@click.left="$emit('close')")
			fa-icon(:icon="['far', 'arrow-left']")

		//- Content
		slot

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

	padding: 0 20px 20px 20px;

	background-color: var(--color--bg);
}

.modal__button-close {
	margin-bottom: 10px;
	padding: 20px 0;

	cursor: pointer;
}

</style>
<!--}}}-->
