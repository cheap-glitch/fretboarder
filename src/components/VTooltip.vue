

<!-- components/VTooltip.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VTooltip(ref="tooltip")
	slot
	div.VTooltip__arrow(data-popper-arrow)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { createPopper } from '@popperjs/core/lib/popper-lite';
import arrow            from '@popperjs/core/lib/modifiers/arrow';
import flip             from '@popperjs/core/lib/modifiers/flip';
import offset           from '@popperjs/core/lib/modifiers/offset';
import preventOverflow  from '@popperjs/core/lib/modifiers/preventOverflow';

export default {
	name: 'VTooltip',

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
		delay: {
			type: Number,
			default: 0,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
	},

	created()
	{
		this.popper = null;
	},

	destroyed()
	{
		this.destroyPopper();
	},

	methods: {
		createPopper()
		{
			if (!this.isOpen || this.popper !== null || this.targetElement === false)
				return;

			this.popper = createPopper(this.targetElement, this.$refs.tooltip, {
				placement: this.placement,
				modifiers: [
					{
						...offset,
						options: {
							offset: [0, 10],
						}
					},
					{
						...preventOverflow,
						options: {
							boundary: document.body,
							padding: 8,
						}
					},
					{
						...flip,
						options: {
							boundary: document.body,
						}
					},
					{
						...arrow,
						options: {
							padding: 8,
						}
					},
				]
			});
		},
		destroyPopper()
		{
			if (this.popper === null)
				return;

			this.popper.destroy();
			this.popper = null;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VTooltip {
	z-index: 1000;

	padding: 8px;
	border-radius: 4px;

	font-size: 1.4rem;

	color: white;
	background-color: var(--color--bg--tooltip);

	filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));

	&[data-popper-placement^="top"]    > .VTooltip__arrow { bottom: -4px; }
	&[data-popper-placement^="bottom"] > .VTooltip__arrow { top:    -4px; }
	&[data-popper-placement^="left"]   > .VTooltip__arrow { right:  -4px; }
	&[data-popper-placement^="right"]  > .VTooltip__arrow { left:   -4px; }
}

.VTooltip__arrow,
.VTooltip__arrow::before {
	position: absolute;
	z-index: -1;

	@include square(8px);
}

.VTooltip__arrow::before {
	content: "";

	transform: rotate(45deg);

	background-color: var(--color--bg--tooltip);
}

</style>
<!--}}}-->
