

<!-- App.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.App: router-view

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'App',
}

</script>
<!--}}}-->


<!--{{{ Global styles -->
<style lang='scss'>

// Load the fonts
@include font-face('IBM Plex', './assets/fonts/ibm-plex/ibm-plex');

// Apply the reset stylesheet
@import '@/styles/reset';

// Load the global styles
@import '@/styles/global';

</style>
<!--}}}-->
