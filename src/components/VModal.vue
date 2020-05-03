

<!-- components/VModal.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VModal(ref="modal")

	transition(name="fade"): div.modal(v-if="isModalOpen")

		div.modal__header
			div.modal__close(@click.left="$emit('close')"): fa-icon(:icon="['far', 'arrow-left']")
			h1.modal__title {{ title }}

		div.modal__content
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
		title: {
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

.modal {
	position: fixed;
	z-index: 1000;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-color: var(--color--bg--accent);

	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.modal__header {
	position: relative;

	margin-bottom: 20px;

	color: var(--color--text);
}

.modal__title {
	position: absolute;
	top: 50%;
	right: 50%;
	transform: translate(50%, -50%);

	font-weight: bold;
}

.modal__close {
	padding: 20px;

	width: 60px;
}

</style>
<!--}}}-->
