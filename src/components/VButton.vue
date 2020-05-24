

<!-- VButton.vue -->


<!--{{{ Pug -->
<template lang="pug">

button.VButton(
	v-mods="{ isActive, isDisabled }"
	@click.left="clickButton"
	)
	//- Icon
	fa-icon.icon(
		:icon="Array.isArray(icon) ? icon : ['far', icon]"
		:flip="isFlipped ? 'horizontal' : null"
		)
	//- Text
	p.title(v-if="title.length") {{ title }}

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
		clickButton()
		{
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

	border: 1px solid var(--color--bg--highlight);

	color: var(--color--text);
	background-color: var(--color--bg--highlight);

	appearance: none;
	cursor: pointer;

	transition: border-color 200ms, background-color 200ms;

	&:not(.is-active):not(.is-disabled):hover {
		color: white;
		border-color: var(--color--hover);
		background-color: var(--color--hover);
	}

	&.is-disabled {
		border-color: var(--color--border);
		background-color: var(--color--border);

		cursor: not-allowed;
	}

	&.is-active {
		color: white;
		border-color: var(--color--highlight);
		background-color: var(--color--highlight);
	}

	&:focus {
		border-color: var(--color--hover);
	}

	@include mq($from: desktop)
	{
		padding: 4px 8px;

		font-size: 1.4rem;
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
