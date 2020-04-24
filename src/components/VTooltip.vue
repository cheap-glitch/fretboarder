

<!-- components/VTooltip.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VTooltip(
	ref="tooltip"
	v-show="isDisplayed"
	v-mods="{ isActive }"
	)
	slot
	div.VTooltip__arrow(
		data-popper-arrow
		)

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
			type: [HTMLElement, String, Boolean],
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

	data() {
		return {
			isActive:    false,
			isDisplayed: false,
		}
	},

	computed: {
		targetElement()
		{
			return (typeof this.target == 'string') ? document.getElementById(this.target) : this.target;
		},
	},

	watch: {
		isOpen()
		{
			if (!this.isOpen)
			{
				this.isActive = false;
			}
			else
			{
				if (this.delay)
				{
					setTimeout(this.createPopper, this.delay);
				}
				else
				{
					this.createPopper();
				}
			}
		}
	},

	created()
	{
		this.popper = null;
	},

	mounted()
	{
		this.$refs.tooltip.addEventListener('transitionend', ()  => { if (!this.isOpen) this.destroyPopper(); });
	},

	methods: {
		createPopper()
		{
			if (this.isOpen)
			{
				if (this.popper !== null) this.destroyPopper();

				this.isDisplayed = true;

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

				this.isActive = true;
			}
		},
		destroyPopper()
		{
			if (this.popper !== null)
			{
				this.popper.destroy();
				this.popper = null;

				this.isDisplayed = false;
			}
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/colors' as *;

.VTooltip {
	z-index: 1000;

	padding: 8px;
	border-radius: 4px;

	font-size: 1.4rem;

	color: white;
	background-color: $color--slate-gray;;

	filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));

	opacity: 0;
	transition: opacity 0.2s;

	&.is-active {
		opacity: 1;
	}

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

	background-color: $color--slate-gray;

	transform: rotate(45deg);
}

</style>
<!--}}}-->
