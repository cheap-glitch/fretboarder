

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")#app: router-view

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapObjectToObject } from '@/modules/object'
import { colorscheme }       from '@/modules/colorscheme'

import { mediaQueries }      from '@/stores/main'

export default {
	name: 'App',

	computed: {
		colorscheme()
		{
			return mapObjectToObject(colorscheme, (varName, values) => values[this.$store.state.isDarkModeOn ? 1 : 0]);
		},
	},

	created()
	{
		//- this.feedbackMail = {
		//- 	subject: encodeURIComponent("Feedback on Fretboarder 🎸"),
		//- 	body:    encodeURIComponent("Thank you for providing feedback on Fretboarder!\nIf you wish to report a bug, please specify your OS and browser to help us resolve it faster.\n----------\n\n"),
		//- };

		// Add a sequence if there is none at startup
		if (this.$store.state.sequences.sequences.length == 0)
			this.$store.commit('sequences/add');
	},

	mounted()
	{
		// Listen to any changes on the device type and layout orientation
		mediaQueries.isMobileDevice.addListener(this.updateDeviceType);
		mediaQueries.isLayoutLandscape.addListener(this.updateLayoutOrientation);
	},

	destroyed()
	{
		// Clear event listeners
		mediaQueries.isMobileDevice.removeListener(this.updateDeviceType);
		mediaQueries.isLayoutLandscape.removeListener(this.updateLayoutOrientation);
	},

	methods: {
		updateDeviceType(event)
		{
			this.$store.commit('isMobileDevice', event.matches);
		},
		updateLayoutOrientation(event)
		{
			this.$store.commit('isLayoutLandscape', event.matches);
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	flex: 1 1 auto;

	padding: 20px;

	background-color: var(--color--bg);
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

@use "@cheap-glitch/scss-reset/_reset";
@use "@/styles/global";

</style>
<!--}}}-->
