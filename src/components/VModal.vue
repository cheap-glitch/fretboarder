

<!-- components/VModal.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VModal: Portal: transition(name="fade")

	div.modal(v-if="isOpen")
		slot

		fa-icon.modal__button-close(
			:icon="['far', 'times-circle']"

			@click.left="isOpen = false"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { Portal } from 'vue-simple-portal'

export default {
	name: 'VModal',

	components: {
		Portal,
	},

	data() {
		return {
			isOpen: true,
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
