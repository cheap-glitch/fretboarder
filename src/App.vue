

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App#app(:style="colorscheme")

	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------
	header.header
		div.header__section.hero
			//- Logo
			div.logo
				fa-icon.logo__icon(
					:icon="['far', instrumentIcon]"
					v-mods="{ isUkulele: instrument == 'ukulele' }"
					)
				h1.logo__text Fretboarder

			//- {{{ Links
			//- nav.nav(v-if="!isMobileDevice")
				//- GitHub & Twitter
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
			//- }}}

		div.header__section.settings(v-if="!isMobileDevice")
			//- Desktop settings
			FretboardTools

			//- Dark mode toggle switch
			div.dark-mode-toggle(
				v-mods="{ isDarkModeOn }"
				@click="$store.commit('toggle.isDarkModeOn')"
				)
				fa-icon.dark-mode-toggle__sun(:icon="['fas', 'sun']")
				div.dark-mode-toggle__switch
				fa-icon.dark-mode-toggle__moon(:icon="['fas', 'moon']")

		//- Sub-pages links
		nav.sublinks(v-if="isMobileDevice")
			div.sublinks__item(v-show="subpage == 'fretboard'" @click.left="subpage = 'sequences'"): fa-icon(:icon="['far', 'list-music']")
			div.sublinks__item(v-show="subpage == 'fretboard'" @click.left="subpage =     'tools'"): fa-icon(:icon="['far', 'cog']")
			div.sublinks__item(v-show="subpage != 'fretboard'" @click.left="subpage = 'fretboard'"): fa-icon(:icon="['far', 'arrow-left']")

	//----------------------------------------------------------------------
	//- Page content
	//----------------------------------------------------------------------
	div#canvas-wrapper(v-show="false")

	//- Tools
	transition(name="fade"): FretboardTools(v-if="isMobileDevice && subpage == 'tools'")

	//- Fretboard
	transition(name="fade"): div.fretboard-wrapper#fretboard-wrapper(v-show="!isMobileDevice || subpage == 'fretboard'")
		FretboardViewer(:is-vertical="isMobileDevice && !isLayoutLandscape")

	//- Scales & arpeggios
	transition(name="fade"): FretboardSequences(v-show="!isMobileDevice || subpage == 'sequences'")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }               from 'vuex-pathify'

import { mapObjectToObject } from '@/modules/object'
import { mapObjectKeys }     from '@/modules/object'
import { colorscheme }       from '@/modules/colorscheme'

import { mediaQueries }      from '@/stores/main'

import FretboardTools        from '@/components/FretboardTools'
import FretboardViewer       from '@/components/FretboardViewer'
import FretboardSequences    from '@/components/FretboardSequences'

export default {
	name: 'App',

	components: {
		FretboardTools,
		FretboardViewer,
		FretboardSequences,
	},

	data() {
		return {
			mailto:  '',
			subpage: 'fretboard',
		}
	},

	computed: {
		colorscheme()
		{
			return mapObjectToObject(colorscheme, (varName, values) => values[this.isDarkModeOn ? 1 : 0]);
		},
		instrumentIcon()
		{
			switch (this.instrument)
			{
				case 'bass':     return 'guitar-electric';
				case 'banjo-4':  return 'banjo';
				case 'banjo-5':  return 'banjo';
				case 'mandolin': return 'mandolin';
				default:         return 'guitar';
			}
		},

		...get('fretboard', [
			'instrument'
		]),

		...get([
			'isDarkModeOn',
			'isMobileDevice',
			'isLayoutLandscape',
		]),
	},

	created()
	{
		this.feedbackMail = {
			subject: encodeURIComponent("Feedback on Fretboarder 🎸"),
			body:    encodeURIComponent("Thank you for providing feedback on Fretboarder!\nIf you wish to report a bug, please specify your OS and browser to help us resolve it faster.\n----------\n\n"),
		};

		// Add a sequence if there is none at startup
		if (this.$store.state.sequences.sequences.length == 0)
			this.$store.commit('sequences/add');
	},

	mounted()
	{
		// Listen to any changes on the device type and layout orientation
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].addListener(this[`update.${mq}`]));
	},

	destroyed()
	{
		// Clear event listeners
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].removeListener(this[`update.${mq}`]));
	},

	methods: {
		...mapObjectKeys(mapObjectToObject(mediaQueries, mq => (function(event) { this.$store.commit(mq, event.matches); })), mq => `update.${mq}`),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	flex: 1 1 auto;

	padding: 12px;

	background-color: var(--color--bg);
}

/**
 * Layout
 * -----------------------------------------------------------------------------
 */

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	margin-bottom: 40px;
}

.header__section {
	display: flex;
	align-items: center;
	@include space-children-h(20px);
}

.fretboard-wrapper {
	@include mq($until: desktop, $and: '(orientation: portrait)')
	{
		display: flex;
		justify-content: center;
	}

	@include mq($from: desktop)
	{
		display: flex;
		flex-direction: column;
		justify-content: flex-end;

		overflow-x: auto;

		min-height: 33vh;

		margin-bottom: 60px;
		padding: 70px 0 40px 0;
	}
}

.FretboardSequences {
	@include mq($from: desktop)
	{
		padding: 0 10px;
	}
}

/**
 * Logo & links
 * -----------------------------------------------------------------------------
 */

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
	font-size: 18px;

	&.is-ukulele { font-size: 12px; }

	@include mq($from: desktop)
	{
		font-size: 20px;

		&.is-ukulele { font-size: 14px; }
	}
}

.logo__text {
	font-size: 20px;
	font-weight: bold;

	transition: color 0.2s;

	@include mq($from: desktop)
	{
		font-size: 24px;
	}
}

.nav {
	position: relative;

	display: flex;
	@include space-children-h(18px);

	opacity: 0;
	transition: opacity 200ms;

	background-color: var(--color--bg);

	.header__section:first-child:hover & { opacity: 1; }
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

/**
 * Settings
 * -----------------------------------------------------------------------------
 */

.settings {
	justify-content: flex-end;
}

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

/**
 * Mobile sublinks
 * -----------------------------------------------------------------------------
 */

.sublinks {
	display: flex;
	justify-content: flex-end;
}

.sublinks__item {
	@include center-content;
	@include circle(42px);

	font-size: 20px;

	color: white;
	background-color: var(--color--bg--popup);

	cursor: pointer;

	&:first-child {
		margin-right: 10px;
	}
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

@use "@cheap-glitch/scss-reset/_reset";
@use "@/styles/global";

</style>
<!--}}}-->
