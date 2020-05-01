

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")

	//- Help tour
	HelpTour(v-if="!isMobileDevice")

	//- Page content
	section.page

		//----------------------------------------------------------------------
		//- Header
		//----------------------------------------------------------------------
		header.header(v-if="!isMobileDevice")

			div.header__nav

				//- Logo
				div.logo
					fa-icon.logo__icon(
						:icon="['far', instrumentIcon]"
						v-mods="{ isUkulele: instrument == 'ukulele' }"
						)
					h1.logo__text Fretboarder

				//- Links
				nav.nav

					//- GitHub & Twitter
					div.nav__social#help-tour-step--12
						a.nav__link(
							href="https://github.com/cheap-glitch/fretboarder"
							target="_blank"
							rel="external nofollow noopener noreferrer"
							)
							fa-icon(:icon="['fab', 'github']")
						a.nav__link(
							href="https://twitter.com/cheap_glitch"
							target="_blank"
							rel="external nofollow noopener noreferrer"
							)
							fa-icon(:icon="['fab', 'twitter']")

					//- Quick help
					div.nav__link#help-tour-step--0(
						@click.left="startHelpTour"
						)
						fa-icon(:icon="['far', 'question-circle']")
						p.nav__link__text Help

					//- Patreon page
					a.nav__link.link-support#help-tour-step--13(
						href="https://www.patreon.com/cheap_glitch"
						target="_blank"
						rel="external nofollow noopener noreferrer"
						)
						fa-icon(:icon="['far', 'heart']")
						p.nav__link__text Support the app!

					//- TGLD
					a.nav__link.link-tgld#help-tour-step--14(
						href="https://www.theguitarlickdatabase.com"
						target="_blank"
						rel="external nofollow noopener noreferrer"
						)
						p.nav__link__text The Guitar Lick Database
						fa-icon(:icon="['far', 'external-link-square-alt']")

			//- Light/dark switch
			div.dark-mode-toggle(
				v-mods="{ isDarkModeOn }"
				@click="$store.commit('toggleIsDarkModeOn')"
				)
				fa-icon.dark-mode-toggle__sun(:icon="['fas', 'sun']")
				div.dark-mode-toggle__switch
				fa-icon.dark-mode-toggle__moon(:icon="['fas', 'moon']")

		//----------------------------------------------------------------------
		//- Page content
		//----------------------------------------------------------------------

		//- Tools & settings
		FretboardSettings.fretboard-settings(v-if="!isMobileDevice")

		//- Fretboard
		FretboardViewer.fretboard-viewer#help-tour-step--11(:is-vertical="isMobileDevice && layoutOrientation == 'portrait'")

		//- Scales & arpeggios
		ScalesList.fretboard-scales#help-tour--scales(v-if="!isMobileDevice")

	//----------------------------------------------------------------------
	//- Mobile actions & modals
	//----------------------------------------------------------------------

	div.mobile-actions(v-if="isMobileDevice")
		div.mobile-actions__item(@click.left="isModalScalesOpen   = true"): fa-icon(icon="list-music")
		div.mobile-actions__item(@click.left="isModalSettingsOpen = true"): fa-icon(icon="cog")

	//- Scales & arpeggios
	VModal(
		v-if="isMobileDevice"

		:is-open="isModalScalesOpen"
		@close="isModalScalesOpen = false"
		)
		ScalesList

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }            from 'vuex-pathify'

import { colorscheme }    from '@/modules/colorscheme'
import { objectMapToObj } from '@/modules/object'
import { EventBus }       from '@/modules/bus'

import FretboardSettings  from '@/components/FretboardSettings'
import FretboardViewer    from '@/components/FretboardViewer'
import ScalesList         from '@/components/ScalesList'
import HelpTour           from '@/components/HelpTour'

export default {
	name: 'App',

	components: {
		FretboardSettings,
		FretboardViewer,
		ScalesList,
		HelpTour,
	},

	data() {
		return {
			isModalScalesOpen:   false,
			isModalSettingsOpen: false,
		}
	},

	computed: {
		colorscheme()
		{
			return objectMapToObj(colorscheme, (varName, values) => values[this.isDarkModeOn ? 1 : 0]);
		},
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
		...get([
			'instrument',
			'scales/scales',

			'isDarkModeOn',
			'isMobileDevice',
			'layoutOrientation',
		]),
	},

	mounted()
	{
		if (this.scales.length == 0)
			this.$store.commit('scales/addScale');
	},

	created()
	{
		// Register all key presses on the page
		window.addEventListener('keydown', this.registerKeypress, { passive: true });

		// Update the width of the window on every resize
		window.addEventListener('resize',  this.updateClientSize, { passive: true });
	},

	destroyed()
	{
		// Clear the event listeners
		window.removeEventListener('keydown', this.registerKeypress, { passive: true });
		window.removeEventListener('resize',  this.updateClientSize, { passive: true });
	},

	methods: {
		registerKeypress(event)
		{
			EventBus.$emit('keypress', event.key);
		},
		updateClientSize()
		{
			this.$store.commit('setClientWidth',  window.innerWidth);
			this.$store.commit('setClientHeight', window.innerHeight);
		},
		startHelpTour()
		{
			const helpTour = this.$tours['help'];

			if (helpTour.currentStep == -1)
				helpTour.start();
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

/**
 * Layout
 * -----------------------------------------------------------------------------
 */

.App {
	flex: 1 1 auto;

	background-color: var(--color--bg);

	@include mq($until: desktop)
	{
		@media (orientation: landscape)
		{
			display: flex;
			align-items: center;
		}
	}
}

.page {
	padding: 20px;

	@include mq($from: desktop)
	{
		padding-bottom: 0;
	}
}

.header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	margin-bottom: 60px;
}

.fretboard-settings {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	margin-bottom: 30px;
}

.fretboard-viewer {
	margin-bottom: 40px;
}

/**
 * Header
 * -----------------------------------------------------------------------------
 */

.header__nav {
	display: flex;
	align-items: baseline;
	@include space-children-h(26px);
}

.logo {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	padding: 4px 6px;

	border-radius: 6px;

	color: var(--color--bg);
	background-color: var(--color--border);

	&:hover {
		background-color: var(--color--hover);
	}
}

.logo__icon {
	font-size: 20px;

	&.is-ukulele {
		font-size: 14px;
	}
}

.logo__text {
	font-size: 24px;
	font-weight: bold;
}

.nav {
	display: flex;
	@include space-children-h(20px);
}

.nav__social {
	display: flex;
	@include space-children-h(10px);
}

.nav__link {
	display: flex;
	align-items: center;
	@include space-children-h(4px);

	font-size: 1.4rem;

	color: var(--color--text--secondary);

	cursor: pointer;

	&:hover {
		color: var(--color--hover);
	}
}

.nav__link__text {
	cursor: pointer;
}

.link-support:hover { color: var(--color--red);    }
.link-tgld:hover    { color: var(--color--orange); }

.dark-mode-toggle {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	color: var(--color--text--secondary);

	cursor: pointer;

	&.is-dark-mode-on {
		&:hover .dark-mode-toggle__sun {
			color: var(--color--hover);
		}

		.dark-mode-toggle__switch::after {
			transform: translateX(8px);
		}
	}

	&:not(.is-dark-mode-on) {
		&:hover .dark-mode-toggle__moon {
			color: var(--color--hover);
		}
	}
}

.dark-mode-toggle__switch {
	position: relative;

	width: 20px;
	height: 12px;
	@include pill;

	border: 2px solid var(--color--border);

	&::after {
		content: "";

		position: absolute;
		top: 0;
		left: 0;

		@include circle(8px);

		background-color: var(--color--highlight);

		transition: transform 0.2s;
	}
}

/**
 * Mobile actions
 * -----------------------------------------------------------------------------
 */

.mobile-actions {
	position: fixed;
	z-index: 1000;
	bottom: 10px;
	right: 10px;

	@media (orientation: portrait)
	{
		@include space-children-v(10px);
	}

	@media (orientation: landscape)
	{
		display: flex;
		@include space-children-h(10px);
	}
}

.mobile-actions__item {
	@include center-content;
	@include circle(48px);

	font-size: 22px;

	color: white;

	filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5)) brightness(1);

	cursor: pointer;

	transition: filter 0.2s;

	&:nth-child(1) { background-color: var(--color--hover);       }
	&:nth-child(2) { background-color: var(--color--bg--tooltip); }

	&:hover {
		filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.5)) brightness(1.2);
	}
}

</style>
<!--}}}-->


<!--{{{ Global styles -->
<style lang="scss">

// Load reset stylesheet
@use "@cheap-glitch/scss-reset/_reset";

// Load global styles
@use "@/styles/global";

// Override styles of the slider component
@use "@/styles/slider";

// Load IBM Plex
@include font-face("IBM Plex", "./assets/fonts/ibm-plex/ibm-plex");

// Define the fallback font stack
@font-face {
	font-family: "sytem";
	src: local("Ubuntu Light"), local("Segoe UI Light"), local("Roboto-Light"), local("DroidSans"), local("Tahoma");
}

</style>
<!--}}}-->
