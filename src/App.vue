

<!-- App.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.App(v-mods="darkMode")

	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------
	header.page-header
		h1.page-header__title
			fa-icon.page-header__title__logo(
				:icon="['far', instrumentIcon]"
				v-mods="{ isUkulele: instrument == 'ukulele' }"
				)
			h1.page-header__title__text Fretboarder
		nav.page-header__nav
			a.page-header__nav__link(
				href="https://github.com/cheap-glitch/fretboarder/issues"
				target="_blank"
				rel="external nofollow noopener noreferrer"
				)
				fa-icon(:icon="['far', 'bug']")
				p Report a bug
			a.page-header__nav__link.support-link(
				href="https://www.patreon.com/cheap_glitch"
				target="_blank"
				rel="external nofollow noopener noreferrer"
				)
				fa-icon(:icon="['far', 'heart']")
				p Support
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

import { mapState, mapGetters } from 'vuex'

export default {
	name: 'App',

	computed: {
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

		...mapState([
			'instrument',
		]),
		...mapGetters([
			'darkMode',
		])
	}
}

</script>
<!--}}}-->


<!--{{{ Global styles -->
<style lang='scss' scoped>

.App {
	display: flex;
	align-items: stretch;
	flex-direction: column;
	overflow-y: hidden;

	padding: 20px 40px;

	min-height: 100%;

	background-color: snow;

	transition: background-color 0.2s;

	&.dark-mode {
		background-color: $color-mirage;
	}
}

.page-header {
	display: flex;
	justify-content: space-between;

	margin-bottom: 60px;
}

.page-header__title {
	display: flex;
	align-items: center;
	@include space-children-h(5px);
}

.page-header__title__logo {
	font-size: 25px;

	&.is-ukulele {
		font-size: 20px;
	}
}

.page-header__title__text {
	font-size: 30px;
	font-weight: bold;
}

.page-header__nav {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.page-header__nav__link {
	display: flex;
	@include space-children-h(5px);

	padding: 6px;

	border: 2px solid transparent;
	border-radius: 6px;

	text-decoration: none;

	color: gray;

	cursor: pointer;

	transition: border-color 0.2s;

	& > * {
		cursor: pointer;
	}

	&:hover {
		border-color: gray;
	}
}

.support-link {
	color: $color-crimson;
	border-color: $color-crimson;

	transition: all 0.2s;

	&:hover {
		color: white;
		border-color: $color-crimson;
		background-color: $color-crimson;
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

</style>
<!--}}}-->
