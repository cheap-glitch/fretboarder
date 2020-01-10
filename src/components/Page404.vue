

<!-- Page404.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.Page404
	fa-icon.background(icon="empty-set")
	section.wrapper
		h1.title Sorry, but this page doesn’t exist!
		VButtonText.link(
			mode="link"
			to="/"
			is-filled
			)
			p Go to the Fretboarder page

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'Page404',
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.Page404 {
	@include center-content;

	position: relative;
	flex: 2 1 100%;
}

.wrapper {
	@include center-column;
	@include space-children-v(20px);

	z-index: 10;
}

.title {
	font-size: 3rem;
}

.link {
	color: $color-azure;
	border-color: $color-azure;
	background-color: $color-azure;

	&:hover {
		color: snow;
	}
}

.background {
	position: absolute;
	top: 0;

	font-size: 600px;

	color: #f4f4f4;
}

</style>
<!--}}}-->
