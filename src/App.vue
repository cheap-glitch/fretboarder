

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
				h1.logo
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
				@click="$store.commit('toggleIsDarkModeOn')"
				)
				fa-icon(:icon="['fas', 'sun']")
				div.dark-mode-toggle__switch(v-mods="{ isDarkModeOn }")
				fa-icon(:icon="['fas', 'moon']")

		//----------------------------------------------------------------------
		//- Page content
		//----------------------------------------------------------------------

		//- Tools & settings
		FretboardSettings.fretboard-settings(v-if="!isMobileDevice")

		//- Fretboard
		FretboardViewer.fretboard-viewer#help-tour-step--11(:is-vertical="isMobileDevice")

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

import colorscheme        from '@/modules/colorscheme'
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
		window.addEventListener('keydown', this.registerKeypress,  { passive: true });

		// Update the width of the window on every resize
		window.addEventListener('resize',  this.updateClientWidth, { passive: true });
	},

	destroyed()
	{
		// Clear the event listeners
		window.removeEventListener('keydown', this.registerKeypress,  { passive: true });
		window.removeEventListener('resize',  this.updateClientWidth, { passive: true });
	},

	methods: {
		registerKeypress(event)
		{
			EventBus.$emit('keypress', event.key);
		},
		updateClientWidth()
		{
			this.$store.commit('setClientWidth', window.innerWidth);
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

@use '@/styles/colors' as *;

.App {
	flex: 1 1 auto;

	background-color: var(--color--bg);
	transition: background-color 0.2s;
}

.page {
	padding: 20px;

	@include mq($from: desktop)
	{
		@include space-children-v(40px);
		padding-bottom: 0;
	}
}

.fretboard-settings {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

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
	background-color: var(--color--logo--bg);

	transition: color 0.2s, background-color 0.2s;

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

	transition: color 0.2s;

	&:hover {
		color: var(--color--hover);
	}
}

.nav__link__text {
	cursor: pointer;
}

.link-support:hover { color: $color--crimson;  }
.link-tgld:hover    { color: $color--cinnabar; }

.dark-mode-toggle {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	color: var(--color--text--secondary);

	cursor: pointer;
}

.dark-mode-toggle__switch {
	position: relative;

	width: 20px;
	height: 12px;
	@include pill;

	border: 2px solid var(--color--border);

	&::after {
		content: '';

		position: absolute;
		top: 0;
		left: 0;

		@include circle(8px);

		background-color: var(--color--highlight);

		transition: transform 0.2s;
	}

	&.is-dark-mode-on::after {
		transform: translateX(8px);
	}
}

.mobile-actions {
	@include space-children-v(10px);

	position: fixed;
	z-index: 1000;
	bottom: 10px;
	right: 10px;
}

.mobile-actions__item {
	@include center-content;
	@include circle(48px);

	font-size: 22px;

	color: white;

	filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));

	cursor: pointer;

	&:nth-child(1) { background-color: $color--azure;          }
	&:nth-child(2) { background-color: var(--color--logo--bg); }
}

</style>
<!--}}}-->


<!--{{{ Global styles -->
<style lang="scss">

@use '@cheap-glitch/scss-reset/_reset';
@use '@/styles/global';
@use '@/styles/slider';

@include font-face('IBM Plex', './assets/fonts/ibm-plex/ibm-plex');

</style>
<!--}}}-->
