

<!-- components/VModal.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VModal(ref="modal")
	transition(name="fade"): div.modal(v-if="isModalOpen")
		div.modal__button-close(@click.left="$emit('close')"): fa-icon(:icon="['far', 'arrow-left']")
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
			// Lock the scrolling on the body
			if (this.isModalOpen)
				enableBodyScroll(this.$refs.modal);
			else
				disableBodyScroll(this.$refs.modal);

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

	padding: 0 20px 20px 20px;

	background-color: var(--color--bg--accent);

	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.modal__button-close {
	margin-bottom: 10px;
	padding: 20px 0;

	color: var(--color--text);

	cursor: pointer;
}

</style>
<!--}}}-->
