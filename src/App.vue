

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme"): router-view

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { objectMapToObject } from '@/modules/object'
import { colorscheme }       from '@/modules/colorscheme'

import { mediaQueries }      from '@/stores/main'

export default {
	name: 'App',

	data() {
		return {
			mailto: '',
		}
	},

	computed: {
		colorscheme()
		{
			return objectMapToObject(colorscheme, (varName, values) => values[this.$store.state.isDarkModeOn ? 1 : 0]);
		},
		instrumentIcon()
		{
			switch (this.instrument)
			{
				case 'bass':
					return 'guitar-electric';

				case 'banjo-4':
				case 'banjo-5':
					return 'banjo';

				case 'mandolin':
					return 'mandolin';

				default:
					return 'guitar';
			}
		},
	},

	created()
	{
		this.feedbackMail = {
			subject: encodeURIComponent("Feedback on Fretboarder 🎸"),
			body:    encodeURIComponent("Thank you for providing feedback on Fretboarder!\nIf you wish to report a bug, please specify your OS and browser to help us resolve it faster.\n----------\n\n"),
		};

		if (this.$store.state.scales.scales.length == 0)
			this.$store.commit('scales/addScale');
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
			this.isModalScalesOpen = this.isModalSettingsOpen = false;
		},
		updateLayoutOrientation(event)
		{
			this.$store.commit('isLayoutLandscape', event.matches);
			this.isModalScalesOpen = this.isModalSettingsOpen = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	flex: 1 1 auto;

	padding: 10px;

	background-color: var(--color--bg);
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

// Load the reset stylesheet
@use "@cheap-glitch/scss-reset/_reset";

// Load the global styles
@use "@/styles/global";

</style>
<!--}}}-->
