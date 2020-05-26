

<!-- components/VPopupMenu.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VPopupMenu
	VButton(
		ref="button"

		:icon="icon"
		:title="title"

		@click="isOpen = !isOpen"
		)
	VPopup(
		:target="$refs.button ? ($refs.button.$el || false) : false"
		placement="bottom"

		:is-open="isOpen"
		v-click-outside="clickOutsideHandler"
		)
		slot

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VPopupMenu',

	props: {
		icon: {
			type: [Array, String],
			required: true,
		},
		title: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			isOpen: false,
		}
	},

	methods: {
		clickOutsideHandler(event)
		{
			if (!this.$refs.button.$el.contains(event.target))
				this.isOpen = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VPopup {
	z-index: 2000;

	color: var(--color--bg);
	background-color: var(--color--bg);
}

</style>
<!--}}}-->
