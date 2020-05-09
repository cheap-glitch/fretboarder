

<!-- components/VModal.vue -->


<!--{{{ Pug -->
<template lang="pug">

transition(name="fade"): div.VModal(
	ref="modal"
	v-if="isModalOpen"
	)
	div.VModal__header
		div.VModal__header__close(@click.left="$emit('close')"): fa-icon(:icon="['far', 'arrow-left']")
		h1.VModal__header__title {{ modalTitle }}
	div.VModal__content
		slot

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { disableBodyScroll       } from 'body-scroll-lock'
import { enableBodyScroll        } from 'body-scroll-lock'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
	name: 'VModal',

	props: {
		modalTitle: {
			type: String,
			required: true,
		},
		isOpen: {
			type: Boolean,
			default: false,
		}
	},

	data() {
		return {
			isModalOpen: false,
		}
	},

	watch: {
		isOpen()
		{
			(this.isModalOpen ? enableBodyScroll : disableBodyScroll)(this.$refs.modal);
			this.isModalOpen = !this.isModalOpen;
		}
	},

	destroyed()
	{
		clearAllBodyScrollLocks();
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VModal {
	@include space-children-v(20px);

	position: fixed;
	z-index: 1000;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-color: var(--color--bg);

	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.VModal__header {
	position: relative;

	color: var(--color--text);
}

.VModal__header__title {
	@include center-position;

	font-weight: bold;
}

.VModal__header__close {
	padding: 20px;

	width: 60px;
}

.VModal__content {
	padding: 20px;
}

</style>
<!--}}}-->
