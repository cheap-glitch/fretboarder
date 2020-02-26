

<!-- components/PageFretboarderMobileToolbar.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.PageFretboarderMobileToolbar

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'PageFretboarderMobileToolbar',
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.PageFretboarderMobileToolbar {
	display: flex;

	position: fixed;
	z-index: 1000;
	left: 0;
	right: 0;
	bottom: 0;

	// @TEMP
	height: 60px;

	border-top: 1px solid gray;

	background-color: snow;

	@include mq($from: desktop)
	{
		display: none;
	}
}

</style>
<!--}}}-->
