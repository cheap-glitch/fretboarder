

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

import { colorscheme }       from '@/modules/colorscheme'
import { objectMapToObject } from '@/modules/object'

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
