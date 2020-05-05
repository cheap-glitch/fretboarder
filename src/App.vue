

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")

	FretboardViewer

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

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
			//- return objectMapToObject(colorscheme, (varName, values) => values[this.isDarkModeOn ? 1 : 0]);
			return objectMapToObject(colorscheme, (varName, values) => values[0]);
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

// Load the reset stylesheet
@use "@cheap-glitch/scss-reset/_reset";

// Load the global styles
//- @use "@/styles/global";

// Override the styles of the slider component
//- @use "@/styles/slider";

</style>
<!--}}}-->
