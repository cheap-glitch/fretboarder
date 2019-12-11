

<!-- VButtonText.vue -->


<!--{{{ Pug -->
<template lang='pug'>

button.VButtonText(
	:is="elemType"

	v-bind:[linkRel]="'external nofollow noopener noreferrer'"
	v-bind:[linkTarget]="'_blank'"

	v-mods="{ isFilled }"
	)
	slot

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VButtonText',

	props: {
		mode: {
			type: String,
			default: 'button',
			validator: _v => ['button', 'link', 'link-external'].includes(_v)
		},
		isFilled: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		elemType()
		{
			switch (this.mode)
			{
				case 'link':
				case 'link-external':
					return 'a';

				case 'button':
					return 'button';

				default:
					return 'button';
			}
		},
		linkRel()    { return this.mode == 'link-external' ? 'rel'    : null; },
		linkTarget() { return this.mode == 'link-external' ? 'target' : null; },
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.VButtonText {
	display: flex;
	@include space-children-h(5px);

	padding: 6px;

	border-width: 2px;
	border-style: solid;
	border-radius: 6px;

	font-family: $fonts-text;

	appearance: none;
	background-image: none;

	cursor: pointer;

	&:not(.is-filled) {
		background-color: transparent;

		transition: border-color 0.2s;

		&:not(:hover) {
			border-color: transparent;
		}
	}

	&.is-filled {
		transition: color 0.2s, background-color 0.2s;

		&:not(:hover) {
			background-color: transparent;
		}
	}
}

</style>
<!--}}}-->


<!--{{{ Global SCSS -->
<style lang='scss'>

.VButtonText > * {
	cursor: pointer;
}

</style>
<!--}}}-->
