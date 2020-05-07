

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App#app(:style="colorscheme")

	FretboardViewer

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }               from 'vuex-pathify'

import { objectMapToObject } from '@/modules/object'
import { colorscheme }       from '@/modules/colorscheme'

import { EventBus }          from '@/modules/bus'
import { mediaQueries }      from '@/stores/main'

import FretboardViewer       from '@/components/FretboardViewer'

export default {
	name: 'App',

	components: {
		FretboardViewer,
	},

	computed: {
		colorscheme()
		{
			return objectMapToObject(colorscheme, (varName, values) => values[this.isDarkModeOn ? 1 : 0]);
		},
		...get([
			'isDarkModeOn'
		]),
	},

	created()
	{
		if (this.$store.state.scales.scales.length == 0)
			this.$store.commit('scales/addScale');
	},

	mounted()
	{
		// Register every keypress on the page
		window.addEventListener('keydown', this.registerKeypress, { passive: true });

		// Listen to any changes on the device type and layout orientation
		mediaQueries.isMobileDevice.addListener(this.updateDeviceType);
		mediaQueries.isLayoutLandscape.addListener(this.updateLayoutOrientation);
	},

	destroyed()
	{
		// Clear event listeners
		window.removeEventListener('keydown', this.registerKeypress, { passive: true });
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
		registerKeypress(event)
		{
			EventBus.$emit('keypress', event.key);
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	flex: 1 1 auto;

	padding: 40px 40px;

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

// Override the styles of the slider component
//- @use "@/styles/slider";

</style>
<!--}}}-->
