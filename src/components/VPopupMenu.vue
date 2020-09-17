

<!-- components/VPopupMenu.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VPopupMenu
	VButton(
		ref="button"

		:icon="icon"
		:text="text"

		@click="isOpen = !isOpen"
		)
	VPopup.popup(
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
		text: {
			type: String,
			default: '',
		},
		forceClosing: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isOpen: false,
		}
	},

	watch: {
		forceClosing()
		{
			this.isOpen = false;
		},
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

.popup {
	z-index: 2000;

	color: var(--color--bg);
	background-color: var(--color--bg);
}

</style>
<!--}}}-->
