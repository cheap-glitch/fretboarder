

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App
	FretboardViewer

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import FretboardViewer from '@/components/FretboardViewer'

export default {
	name: 'App',

	components: {
		FretboardViewer,
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
