

<!-- VButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VButton(
	v-mods="{ isActive, isDisabled }"

	@click.left="clickHandler"
	)

	//- Icon
	fa-icon.icon(
		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		:flip="isFlipped ? 'horizontal' : null"
		)

	//- Text
	p.title(v-show="title.length") {{ title }}

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
		/*
		size: {
			type: String,
			default: 'normal',
			validator: v => ['normal', 'big'].includes(v)
		},
		*/
		title: {
			type: String,
			default: '',
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
		clickHandler()
		{
			// Unfocus the button
			this.$refs.button.blur();

			if (!this.isDisabled)
				this.$emit('click');
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VButton {
	display: flex;
	align-items: center;
	@include space-children-h(8px);

	@include pill;

	padding: 8px 10px;

	border: none;
	appearance: none;
	background-color: var(--color--bg--highlight);

	cursor: pointer;

	transition: background-color 200ms;

	&:not(.is-active):not(.is-disabled):hover {
		color: white;
		background-color: var(--color--hover);
	}

	&.is-disabled {
		background-color: var(--color--border);
		cursor: not-allowed;
	}

	&.is-active {
		color: white;
		background-color: var(--color--highlight);
	}
}

.icon,
.icon > *,
.title {
	cursor: pointer;

	.VButton.is-disabled & {
		cursor: not-allowed;
	}
}

</style>
<!--}}}-->
