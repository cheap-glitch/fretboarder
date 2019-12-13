

<!-- VButtonIcon.vue -->


<!--{{{ Pug -->
<template lang='pug'>

button.VButtonIcon(
	:title="tooltip"
	v-mods="{ isDisabled, ...darkMode }"
	@click.left="click"
	)
	fa-icon.VButtonIcon__icon(
		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		:class="`size-${size}`"
		v-mods="{ isActive, isDisabled, isFlipped, ...darkMode }"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapGetters } from 'vuex'

export default {
	name: 'VButtonIcon',

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

	computed: mapGetters([
		'darkMode',
	]),

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

.VButtonIcon {
	display: block;

	border: none;
	appearance: none;
	background-color: transparent;

	cursor: pointer;
}

.VButtonIcon__icon {
	color: gray;

	transition: color 0.2s;

	&.dark-mode {
		color: $color-oxford-blue;
	}

	&:hover {
		color: $color-azure;
	}

	&.is-disabled {
		color: darkgray;
		cursor: not-allowed;

		&.dark-mode {
			color: $color-ebony-clay;
		}
	}

	&.is-active {
		color: $color-sun;

		&:hover {
			color: $color-sun;
		}
	}

	&.is-flipped {
		transform: scaleX(-1);
	}

	&.is-disabled {
		cursor: not-allowed;
	}

	&.size-big    { @include square(40px); }
	&.size-normal { @include square(30px); }
	&.size-small  { @include square(22px); }
}

</style>
<!--}}}-->
