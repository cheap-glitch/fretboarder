

<!-- VButton.vue -->


<!--{{{ Pug -->
<template lang='pug'>

button.VButton(
	:title="tooltip"
	v-mods="{ isActive, isDisabled }"
	@click.left="click"
	)
	fa-icon.VButton__icon(
		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		:class="`size-${size}`"
		v-mods="{ isDisabled, isFlipped }"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VButton',

	props: {
		icon: {
			type: [Array, String],
			required: true,
		},
		size: {
			type: String,
			default: 'normal',
			validator: _v => ['big', 'normal', 'small'].includes(_v)
		},
		tooltip: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isFlipped: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		click()
		{
			if (!this.isDisabled) this.$emit('click');
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.VButton {
	display: block;

	border: none;

	appearance: none;
	background-color: transparent;

	cursor: pointer;

	transition: color 0.2s;

	&:hover {
		color: steelblue;
	}

	&.is-disabled {
		color: darkgray;

		cursor: not-allowed;
	}

	/**
	 * This modifier is  placed below on purpose, so that  when both 'isActive' and
	 * 'isDisabled' are true, the active color is combined with the disabled cursor
	 */
	&.is-active {
		color: orange;
	}
}

.VButton__icon {
	&.size-big    { @include square(40px); }
	&.size-normal { @include square(30px); }
	&.size-small  { @include square(22px); }

	&.is-disabled {
		cursor: not-allowed;
	}

	&.is-flipped {
		transform: scaleX(-1);
	}
}

</style>
<!--}}}-->
