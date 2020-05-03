

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")

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
			@click="$store.commit('toggleIsDarkModeOn')"
			)
			fa-icon.dark-mode-toggle__sun(:icon="['fas', 'sun']")
			div.dark-mode-toggle__switch
			fa-icon.dark-mode-toggle__moon(:icon="['fas', 'moon']")

	//----------------------------------------------------------------------
	//- Page content
	//----------------------------------------------------------------------

	//- Tools & settings
	component(
		:is="isMobileDevice ? 'VModal' : 'div'"

		title="Settings"
		:is-open="isModalSettingsOpen"

		@close="isModalSettingsOpen = false"
		)
		FretboardSettings.fretboard-settings

	//- Fretboard
	FretboardViewer(
		:is-flipped="isFretboardFlipped && !isMobileDevice"
		:is-vertical="isMobileDevice && !isLayoutLandscape"
		)

	//- Scales & arpeggios
	component(
		:is="isMobileDevice ? 'VModal' : 'div'"

		title="Scales"
		:is-open="isModalScalesOpen"

		@close="isModalScalesOpen = false"
		)
		ScalesList.fretboard-scales

	//----------------------------------------------------------------------
	//- Mobile actions & modals
	//----------------------------------------------------------------------

	div.mobile-actions(v-if="isMobileDevice")
		div.mobile-actions__item(@click.left="isModalScalesOpen   = true"): fa-icon(icon="list-music")
		div.mobile-actions__item(@click.left="isModalSettingsOpen = true"): fa-icon(icon="cog")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }            from 'vuex-pathify'

import { colorscheme    } from '@/modules/colorscheme'
import { objectMapToObj } from '@/modules/object'
import { EventBus       } from '@/modules/bus'
import { mediaQueries   } from '@/stores/main'

import FretboardSettings  from '@/components/FretboardSettings'
import FretboardViewer    from '@/components/FretboardViewer'
import ScalesList         from '@/components/ScalesList'

export default {
	name: 'App',

	components: {
		FretboardSettings,
		FretboardViewer,
		ScalesList,
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
			'isDarkModeOn',
			'isMobileDevice',
			'isLayoutLandscape',

			'fretboard/instrument',
			'fretboard/isFretboardFlipped',
		]),
	},

	created()
	{
		if (this.$store.state.scales.scales.length == 0)
			this.$store.commit('scales/addScale');
	},

	mounted()
	{
		// Register all key presses on the page
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

/**
 * Layout
 * -----------------------------------------------------------------------------
 */

.App {
	flex: 1 1 auto;

	padding: 20px;

	background-color: var(--color--bg);

	@include mq($until: desktop, $and: '(orientation: landscape)')
	{
		display: flex;
		align-items: center;
	}

	@include mq($until: desktop)
	{
		padding-bottom: 0;
	}
}

@include mq($from: desktop)
{
	.header             { margin-bottom: 80px;  }
	.fretboard-settings { margin-bottom: 30px;  }
	.fretboard-scales   { margin-top:    100px; }
}

/**
 * Header
 * -----------------------------------------------------------------------------
 */

.header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
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
	z-index: 100;
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

// Load the reset stylesheet
@use "@cheap-glitch/scss-reset/_reset";

// Load the global styles
@use "@/styles/global";

// Override the styles of the slider component
@use "@/styles/slider";

</style>
<!--}}}-->
