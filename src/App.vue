

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App#app(:style="colorscheme")

	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------
	header.header

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

				//- GitHub & Twitter links
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

				//- Feedback
				a.nav__link(
					:href="`mailto:${mailto}`"
					@click.left="mailto = `cheap.glitch@gmail.com?subject=${feedbackMail.subject}&body=${feedbackMail.body}`"
					)
					fa-icon(:icon="['far', 'paper-plane']")
					p.nav__link__text Send feedback

				//- Patreon page
				a.nav__link.link-support(
					href="https://www.patreon.com/cheap_glitch"
					target="_blank"
					rel="external nofollow noopener noreferrer"
					)
					fa-icon(:icon="['far', 'heart']")
					p.nav__link__text Support the app!

				//- TGLD
				a.nav__link.link-tgld(
					href="https://www.theguitarlickdatabase.com"
					target="_blank"
					rel="external nofollow noopener noreferrer"
					)
					p.nav__link__text The Guitar Lick Database
					fa-icon(:icon="['far', 'external-link-square-alt']")

		//- Light/dark switch
		div.dark-mode-toggle(
			v-mods="{ isDarkModeOn }"
			@click="$store.commit('toggle.isDarkModeOn')"
			)
			fa-icon.dark-mode-toggle__sun(:icon="['fas', 'sun']")
			div.dark-mode-toggle__switch
			fa-icon.dark-mode-toggle__moon(:icon="['fas', 'moon']")

	//----------------------------------------------------------------------
	//- Page content
	//----------------------------------------------------------------------

	FretboardSettings
	FretboardViewer(:is-vertical="isMobileDevice && !isLayoutLandscape")
	ScalesList

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }               from 'vuex-pathify'

import { objectMapToObject } from '@/modules/object'
import { colorscheme }       from '@/modules/colorscheme'

import { EventBus }          from '@/modules/bus'
import { mediaQueries }      from '@/stores/main'

import ScalesList            from '@/components/ScalesList'
import FretboardViewer       from '@/components/FretboardViewer'
import FretboardSettings     from '@/components/FretboardSettings'

export default {
	name: 'App',

	components: {
		ScalesList,
		FretboardViewer,
		FretboardSettings,
	},

	data() {
		return {
			mailto: '',
		}
	},

	computed: {
		colorscheme()
		{
			return objectMapToObject(colorscheme, (varName, values) => values[this.isDarkModeOn ? 1 : 0]);
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
			'isDarkModeOn',
			'isMobileDevice',
			'isLayoutLandscape',

			'fretboard/instrument',
		]),
	},

	created()
	{
		this.feedbackMail = {
			subject: encodeURIComponent("Feedback on Fretboarder 🎸"),
			body:    encodeURIComponent("Thank you for providing feedback on Fretboarder!\nIf you wish to report a bug, please indicate your OS and browser to help us resolve it faster.\n----------\n\n"),
		};

		if (this.$store.state.scales.scales.length == 0)
			this.$store.commit('scales/addScale');
	},

	mounted()
	{
		// Register every keypress on the page
		window.addEventListener('keydown', this.registerKeypress, { passive: true });

		// Listen to any changes on the device type and layout orientation
		mediaQueries.isMobileDevice.addListener(this.updateDeviceType);
		mediaQueries.isLayoutLandscape.addListener(this.updateLayoutOrientation);
	},

	destroyed()
	{
		// Clear event listeners
		window.removeEventListener('keydown', this.registerKeypress, { passive: true });
		mediaQueries.isMobileDevice.removeListener(this.updateDeviceType);
		mediaQueries.isLayoutLandscape.removeListener(this.updateLayoutOrientation);
	},

	methods: {
		updateDeviceType(event)
		{
			this.$store.commit('isMobileDevice', event.matches);
		},
		updateLayoutOrientation(event)
		{
			this.$store.commit('isLayoutLandscape', event.matches);
		},
		registerKeypress(event)
		{
			EventBus.$emit('keypress', event.key);
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	flex: 1 1 auto;

	padding: 20px;

	background-color: var(--color--bg);
}

.FretboardSettings { margin-top: 40px; }
.FretboardViewer   { margin-top: 40px; }
.ScalesList        { margin-top: 60px; }

/**
 * Header
 * -----------------------------------------------------------------------------
 */

.header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	padding-bottom: 60px;
}

.header__nav {
	display: flex;
	align-items: baseline;
	@include space-children-h(20px);
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

	transition: color 0.2s;
}

.nav {
	display: flex;
	@include space-children-h(20px);

	opacity: 0;
	transition: opacity 0.2s;

	.header:hover & { opacity: 1; }
}

.nav__link {
	display: flex;
	align-items: center;
	@include space-children-h(6px);

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

	&.is-dark-mode-on:hover       .dark-mode-toggle__sun,
	&:not(.is-dark-mode-on):hover .dark-mode-toggle__moon {
		color: var(--color--hover);
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

		background-color: var(--color--hover);

		transition: transform 0.2s;

		.dark-mode-toggle.is-dark-mode-on & {
			transform: translateX(8px);
		}
	}
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

// Load the reset stylesheet
@use "@cheap-glitch/scss-reset/_reset";

// Load the global styles
@use "@/styles/global";

// Override the default styles of the slider component
@use "@/styles/slider";

</style>
<!--}}}-->
