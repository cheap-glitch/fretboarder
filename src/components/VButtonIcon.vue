

<!-- VButtonIcon.vue -->


<!--{{{ Pug -->
<template lang='pug'>

button.VButtonIcon(
	:title="tooltip"
	v-mods="{ isDisabled, ...darkMode }"
	@click.left="click"
	)
	fa-icon.VButtonIcon__icon(
		v-if="icon"
		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		:class="`size-${size}`"
		v-mods="{ isActive, isDisabled, isFlipped }"
		)
	p.VButtonIcon__text(
		v-if="text"
		v-mods="{ isActive, isDisabled, isFlipped }"
		) {{ text }}

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
			default: null,
		},
		text: {
			type: String,
			default: null,
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

	&:hover {
		color: $color-azure;
	}

	&.dark-mode {
		color: $color-oxford-blue;
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

.VButtonIcon__text {
	color: gray;

	cursor: pointer;

	text-decoration: underline solid transparent 2px;

	transition: color 0.2s, text-decoration-color 0.2s;

	&.is-disabled {
		cursor: not-allowed;
	}

	&:not(.is-disabled):hover {
		color: $color-azure;
		text-decoration-color: $color-azure;
	}

	&.is-active {
		color: $color-sun;
		text-decoration-color: $color-sun;

		&:hover {
			color: $color-sun;
			text-decoration-color: $color-sun;
		}
	}
}

</style>
<!--}}}-->
