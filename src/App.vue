

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")

	//----------------------------------------------------------------------
	//- Page content
	//----------------------------------------------------------------------
	section.page

		//- Tools & settings
		FretboardSettings.fretboard-settings(v-if="!isMobileDevice")

		//- Fretboard
		FretboardViewer#help-tour-step--12(:is-vertical="isMobileDevice")

		//- Scales & arpeggios
		ScalesList.fretboard-scales(v-if="!isMobileDevice")

		//- Help tour
		HelpTour

	//----------------------------------------------------------------------
	//- Footer
	//----------------------------------------------------------------------
	footer.footer

		//- Logo
		h1.logo
			fa-icon.logo__icon(
				:icon="['far', instrumentIcon]"
				v-mods="{ isUkulele: instrument == 'ukulele' }"
				)
			h1.logo__text Fretboarder

		//- Light/dark switch
		div.dark-mode-toggle(
			@click="$store.commit('toggleIsDarkModeOn')"
			)
			fa-icon(:icon="['fas', 'sun']")
			div.dark-mode-toggle__switch(v-mods="{ isDarkModeOn }")
			fa-icon(:icon="['fas', 'moon']")

		//- nav.header__nav
			//- Quick help
			VButtonText.header__nav__link#help-tour-step--0(
				@click.native.left="startHelpTour"
				)
				fa-icon.header__nav__link__icon(:icon="['far', 'question-circle']")
				p.header__nav__link__text--small Help
				p.header__nav__link__text--wide  Quick help

			//- Github link
			VButtonText.header__nav__link#help-tour-step--13(
				mode="link-external"
				href="https://github.com/cheap-glitch/fretboarder/issues"
				)
				fa-icon.header__nav__link__icon(:icon="['far', 'bug']")
				p.header__nav__link__text--small Bugs
				p.header__nav__link__text--wide  Bugs report / Feature request

			//- Patreon link
			VButtonText.header__nav__link.support-link#help-tour-step--14(
				mode="link-external"
				is-filled
				href="https://www.patreon.com/cheap_glitch"

				v-mods="{ isDarkModeOn }"
				)
				fa-icon.header__nav__link__icon(:icon="['far', 'heart']")
				p Support

			//- TGLD link
			VButtonText.header__nav__link#help-tour-step--15(
				mode="link-external"
				href="https://www.theguitarlickdatabase.com"
				)
				p.header__nav__link__text--small TGLD
				p.header__nav__link__text--wide  The Guitar Lick Database
				fa-icon.header__nav__link__icon(:icon="['far', 'external-link-square-alt']")

		//- p.page-footer__text Fretboarder v2.0 by cheap glitch
		//- a.page-footer__link(
			href="https://twitter.com/cheap_glitch"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			fa-icon(:icon="['fab', 'twitter']")
		//- a.page-footer__link(
			href="https://github.com/cheap-glitch/fretboarder"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			fa-icon(:icon="['fab', 'github']")

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

import { mapMutations }   from 'vuex'
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
			this.addScale();
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
		...mapMutations(['addScale']),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/colors' as *;

.App {
	display: flex;
	align-items: stretch;
	flex-direction: column;
	overflow-y: hidden;

	padding: 20px;

	min-height: 100%;

	background-color: var(--color--bg);

	transition: background-color 0.2s;
}

.page {
	flex: 1 1 100%;
}

.fretboard-settings { margin-bottom: 40px; }
.fretboard-scales   { margin-top:    60px; }

.footer {
	display: flex;
}

.logo {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	padding: 2px 6px;

	border-radius: 6px;

	color: var(--color--bg);
	background-color: var(--color--logo--bg);

	transition: color 0.2s, background-color 0.2s;
}

.logo__icon {
	font-size: 20px;

	&.is-ukulele {
		font-size: 15px;
	}
}

.logo__text {
	font-size: 25px;
	font-weight: bold;
}

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

		background-color: $color--sun;

		transition: transform 0.2s;
	}

	&.is-dark-mode-on::after {
		transform: translateX(20px);
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

	box-shadow: -4px -4px 8px 2px rgba(0, 0, 0, 0.6);

	cursor: pointer;

	&:nth-child(1) { background-color: $color--azure; }
	&:nth-child(2) { background-color: #aaa;          }
}

/*
.header__nav {
	display: flex;
	align-items: center;
	@include space-children-h(6px);

	@include mq($from: wideHeader)
	{
		@include space-children-h(10px);
	}
}

.header__nav__link {
	color: var(--color--text--secondary);
	border-color: var(--color--border);
}

.header__nav__link__icon {
	transform: translateY(1px);
}

.header__nav__link__text--small {
	@include mq($from: wideHeader)
	{
		display: none;
	}
}

.header__nav__link__text--wide {
	display: none;

	@include mq($from: wideHeader)
	{
		display: inline;
	}
}

.support-link {
	color: $color--crimson;
	border-color: $color--crimson;
	background-color: $color--crimson;

	&:hover {
		color: var(--color--support-link--text--hover);
	}

	&.is-dark-mode-on {
		filter: brightness(0.8);
	}
}

.page-footer {
	display: none;
	align-items: flex-end;
	justify-content: flex-end;
	@include space-children-h(10px);

	flex: 1 1 100%;

	@include mq($from: desktop)
	{
		display: flex;
	}
}

.page-footer__text,
.page-footer__link {
	font-size: 1.3rem;

	color: var(--color--text--secondary);
}

.page-footer__link {
	cursor: pointer;

	transition: color 0.2s;

	&:hover {
		color: $color--sun;
	}
}
*/

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
