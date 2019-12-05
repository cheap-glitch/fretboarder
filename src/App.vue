

<!-- App.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.App
	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------
	header.page-header
		h1.page-header__title
			fa-icon(:icon="['far', 'guitar']")
			|
			| Fretboarder
		//- nav.page-header__nav
			a.page-header__nav__link(
				href="https://www.theguitarlickdatabase.com"
				target="_blank"
				rel="external nofollow noopener noreferrer"
				)
				p The Guitar Lick Database
				fa-icon(:icon="['far', 'external-link-square-alt']")

	//----------------------------------------------------------------------
	//- Body
	//----------------------------------------------------------------------
	router-view

	//----------------------------------------------------------------------
	//- Footer
	//----------------------------------------------------------------------
	footer.page-footer
		p.page-footer__text Fretboarder v2.0 by cheap glitch
		a.page-footer__link(
			href="https://twitter.com/cheap_glitch"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			fa-icon(:icon="['fab', 'twitter']")
		a.page-footer__link(
			href="https://github.com/cheap-glitch/fretboarder"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			fa-icon(:icon="['fab', 'github']")

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
<style lang='scss' scoped>

.App {
	display: flex;
	align-items: stretch;
	flex-direction: column;
	@include space-children-v(40px);

	padding: 20px 40px;

	min-height: 100%;
}

.page-header {
	display: flex;
	@include space-children-h(20px);
}

.page-header__title {
	font-size: 30px;
	font-weight: bold;
}

.page-header__nav {
	display: flex;
}

.page-header__nav__link {
	display: flex;
	@include space-children-h(5px);

	cursor: pointer;

	& > * {
		cursor: pointer;
	}
}

.page-footer {
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	@include space-children-h(10px);

	flex: 1 1 100%;
}

.page-footer__text,
.page-footer__link {
	font-size: 1.3rem;

	color: gray;
}

.page-footer__link {
	cursor: pointer;

	transition: color 0.2s;

	&:hover {
		color: orange;
	}
}

</style>
<!--}}}-->


<!--{{{ Global styles -->
<style lang='scss'>

// Load the fonts
@include font-face('IBM Plex', './assets/fonts/ibm-plex/ibm-plex');

// Apply the reset stylesheet
@import '@/styles/reset';

// Load the global styles
@import '@/styles/global';

// Enable full-page layout
html,
body {
	height: 100%;
}

</style>
<!--}}}-->
