

<!-- components/VTooltip.vue -->


<!--{{{ Pug -->
<template lang="pug">

transition(name="fade"): div.VTooltip(
	ref="tooltip"
	v-show="isPopperActive"
	)
	slot
	div.VTooltip__arrow(data-popper-arrow)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }          from 'vuex-pathify'

import { createPopper } from '@popperjs/core/lib/popper-lite'
import arrow            from '@popperjs/core/lib/modifiers/arrow'
import flip             from '@popperjs/core/lib/modifiers/flip'
import offset           from '@popperjs/core/lib/modifiers/offset'
import preventOverflow  from '@popperjs/core/lib/modifiers/preventOverflow'

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
		boundary: {
			type: String,
			default: 'app',
		},
		delay: {
			type: Number,
			default: 0,
		},
		isOpen: {
			type: Boolean,
			default: false,
		}
	},

	data() {
		return {
			isPopperActive: false,
		}
	},

	computed: {
		isMobileDevice: get('isMobileDevice'),
	},

	watch: {
		isOpen()
		{
			if (this.isMobileDevice) return;

			if (this.isOpen)
			{
				if (this.delay)
					this.timeout = window.setTimeout(() => this.createPopper(), this.delay);
				else
					this.createPopper();
			}
			else
			{
				if (this.timeout !== null)
					window.clearTimeout(this.timeout);

				this.timeout = null;
				this.destroyPopper();
			}
		},
	},

	created()
	{
		this.popper  = null;
		this.timeout = null;
	},

	destroyed()
	{
		if (this.popper !== null)
			this.popper.destroy();
	},

	methods: {
		createPopper()
		{
			this.isPopperActive = true;

			if (this.isOpen && this.popper === null && this.target !== false && document.body.contains(this.target))
			{
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
		destroyPopper()
		{
			this.isPopperActive = false;
			this.$refs.tooltip.addEventListener('transitionend',
				event => {
					if (event.propertyName == 'opacity' && !this.isOpen && this.popper !== null)
					{
						this.popper.destroy();
						this.popper = null;
					}
				},
				{
					once:    true,
					passive: true,
				}
			);
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VTooltip {
	position: absolute;
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
	background-color: var(--color--bg--tooltip);

	transform: rotate(45deg);
}

</style>
<!--}}}-->
