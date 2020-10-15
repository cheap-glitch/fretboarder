<!--{{{ Pug -->
<template lang="pug">

div.VPopup(
	ref="tooltip"
	v-show="isOpen"
	)
	div.arrow(data-popper-arrow)
	slot

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { createPopper } from '@popperjs/core/lib/popper-lite'
import arrow            from '@popperjs/core/lib/modifiers/arrow'
import flip             from '@popperjs/core/lib/modifiers/flip'
import offset           from '@popperjs/core/lib/modifiers/offset'
import preventOverflow  from '@popperjs/core/lib/modifiers/preventOverflow'

export default {
	name: 'VPopup',

	props: {
		target: {
			type: [HTMLElement, Boolean],
			required: true,
		},
		placement: {
			type: String,
			default: 'top',
			validator: v => ['top', 'bottom'].includes(v),
		},
		boundary: {
			type: String,
			default: 'app',
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
	},

	watch: {
		isOpen() {
			if (this.isOpen) this.createPopper(); else this.destroyPopper();
		},
	},

	created() {
		this.popper = null;
	},

	destroyed() {
		this.destroyPopper();
	},

	methods: {
		createPopper() {
			if (this.isOpen && this.popper === null && this.target !== false && document.body.contains(this.target)) {
				this.popper = createPopper(this.target, this.$refs.tooltip, {
					placement: this.placement,
					modifiers: [
						{
							...offset,
							options: {
								offset: [0, 10],
							}
						},
						{
							...arrow,
							options: {
								padding: 8,
							}
						},
						{
							...preventOverflow,
							options: {
								boundary: document.getElementById(this.boundary),
								padding: 8,
							}
						},
						{
							...flip,
							options: {
								boundary: document.getElementById(this.boundary),
							}
						},
					]
				});
			}
		},
		destroyPopper() {
			if (!this.isOpen && this.popper !== null) {
				this.popper.destroy();
				this.popper = null;
			}
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VPopup {
	position: absolute;
	z-index: 1000;

	font-size: 1.4rem;

	border-radius: 4px;
	filter: drop-shadow(0 0 2px var(--color--drop-shadow));
}

.arrow {
	&,
	&::before {
		@include square(8px);

		position: absolute;
		z-index: -1;
	}

	&::before {
		content: "";

		transform: rotate(45deg);

		background-color: currentColor;
	}

	.VPopup[data-popper-placement^="top"]    > & { bottom: -4px; }
	.VPopup[data-popper-placement^="left"]   > & { right:  -4px; }
	.VPopup[data-popper-placement^="bottom"] > & { top:    -4px; }
	.VPopup[data-popper-placement^="right"]  > & { left:   -4px; }
}

</style>
<!--}}}-->
