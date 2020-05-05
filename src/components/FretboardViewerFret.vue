

<!-- components/FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'FretboardViewerFret',
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewerFret {
	position: relative;

	height: layout.$fret-height;

	border-right: layout.$fret-thickness solid var(--color--fret);
}

</style>
<!--}}}-->
