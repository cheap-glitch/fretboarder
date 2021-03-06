<!--{{{ Pug -->
<template lang="pug">

div.App#app(:style="colorscheme")

	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------
	header.header
		//- Logo
		div.header__logo(v-show="!isMobileDevice || subpage == 'fretboard'")
			fa-icon.logo__icon(
				:icon="['far', instrumentIcon]"
				v-mods="{ isUkulele: instrument == 'ukulele' }"
				)
			h1.logo__text Fretboarder

		//- Settings (desktop)
		FretboardSettings(v-if="!isMobileDevice")

		//- Sub-pages links (mobile)
		nav.header__sublinks(v-if="isMobileDevice")
			div.sublinks__item(v-show="isMobileDevice && subpage == 'fretboard'" @click.left="subpage = 'sequences'"): fa-icon(:icon="['far', 'list-music']")
			div.sublinks__item(v-show="isMobileDevice && subpage == 'fretboard'" @click.left="subpage =  'settings'"): fa-icon(:icon="['far', 'cog']")
			div.sublinks__item(v-show="isMobileDevice && subpage != 'fretboard'" @click.left="subpage = 'fretboard'"): fa-icon(:icon="['far', 'arrow-left']")

		//- Sub-pages headers
		h1.header__subpage-header(v-show="isMobileDevice && subpage == 'sequences'") Scales & arpeggios
		h1.header__subpage-header(v-show="isMobileDevice && subpage ==  'settings'") Settings

	//----------------------------------------------------------------------
	//- Body
	//----------------------------------------------------------------------
	div#canvas-wrapper(v-show="false")

	//- Settings (mobile)
	FretboardSettings(v-if="isMobileDevice && subpage == 'settings'")

	//- Fretboard
	div.fretboard-wrapper#fretboard-wrapper(
		v-show="!isMobileDevice || subpage == 'fretboard'"
		v-mods="{ isLargeInstrument }"
		)
		FretboardViewer(
			:is-vertical="isMobileDevice && !isLayoutLandscape"
			v-mods="{ isLargeInstrument }"
			)

	//- Scales & arpeggios
	div: FretboardSequences(v-show="!isMobileDevice || subpage == 'sequences'")

	//----------------------------------------------------------------------
	//- Footer
	//----------------------------------------------------------------------
	footer.footer(v-if="!isMobileDevice"): nav.nav
		//- GitHub & Twitter
		a.nav__link(
			href="https://github.com/cheap-glitch/fretboarder"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			fa-icon(:icon="['fab', 'github']")
			p.nav__link__text GitHub
		a.nav__link(
			href="https://twitter.com/cheap_glitch"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			fa-icon(:icon="['fab', 'twitter']")
			p.nav__link__text Twitter

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
			p.nav__link__text Support the app

		//- TGLD
		a.nav__link.link-tgld(
			href="https://www.theguitarlickdatabase.com"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			)
			p.nav__link__text The Guitar Lick Database
			fa-icon(:icon="['far', 'external-link-square-alt']")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }               from 'vuex-pathify'

import { colorscheme }       from '@/modules/colorscheme'
import { mapObjectToObject } from '@/modules/object'
import { instruments }       from '@/modules/music'

import { mediaQueries }      from '@/stores/main'

import FretboardSettings     from '@/components/FretboardSettings'
import FretboardViewer       from '@/components/FretboardViewer'
import FretboardSequences    from '@/components/FretboardSequences'

export default {
	name: 'App',

	components: {
		FretboardSettings,
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
		colorscheme() {
			return mapObjectToObject(colorscheme, (varName, values) => values[this.isDarkModeOn ? 1 : 0]);
		},
		instrumentIcon() {
			switch (this.instrument) {
				case 'bass':     return 'guitar-electric';
				case 'banjo-4':  return 'banjo';
				case 'banjo-5':  return 'banjo';
				case 'mandolin': return 'mandolin';
				default:         return 'guitar';
			}
		},
		isLargeInstrument() {
			return instruments[this.instrument].nbStrings > 7;
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

	created() {
		this.feedbackMail = {
			subject: encodeURIComponent("Feedback on Fretboarder 🎸"),
			body:    encodeURIComponent("Thank you for providing feedback on Fretboarder!\nIf you wish to report a bug, please specify your OS and browser to help us resolve it faster.\n----------\n\n"),
		};

		// Add a sequence if there is none at startup
		if (this.$store.state.sequences.sequences.length == 0)
			this.$store.commit('sequences/add');
	},

	mounted() {
		// Listen to any changes on the device type and layout orientation
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].addListener(this[`update.${mq}`]));
	},

	destroyed() {
		// Clear event listeners
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].removeListener(this[`update.${mq}`]));
	},

	methods: Object.fromEntries(Object.keys(mediaQueries).map(mq => [`update.${mq}`, function(event) { return this.$store.commit(mq, event.matches); }])),
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
	display: flex;
	flex-direction: column;

	flex: 1 1 auto;

	background-color: var(--color--bg);

	@include mq($from: desktop) {
		padding: 12px;
	}
}

.fretboard-wrapper {
	@include mq($until: desktop) {
		@media (orientation: portrait) {
			margin: 20px 0;

			&.is-large-instrument {
				overflow-x: scroll;

				margin: 0;
				padding: 20px;
			}
		}

		@media (orientation: landscape) {
			overflow-x: scroll;

			padding: 40px 20px;
		}
	}

	@include mq($from: desktop) {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		overflow-x: auto;

		min-height: 33vh;

		margin-bottom: 60px;
		padding: 70px 0 40px;
	}
}

/**
 * Header
 * -----------------------------------------------------------------------------
 */

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	@include mq($until: desktop) {
		background-color: var(--color--bg--tooltip);
	}

	@include mq($from: desktop) {
		margin-bottom: 40px;
	}
}

.header__logo {
	display: flex;
	align-items: center;
	@include space-children-h(8px);

	padding: 10px;

	border-radius: 6px;

	color: var(--color--text--inverted);

	@include mq($from: desktop) {
		@include space-children-h(5px);

		padding: 4px 6px;

		color: var(--color--bg);
		background-color: var(--color--border);

		&:hover {
			background-color: var(--color--hover);
		}
	}
}

.logo__icon {
	font-size: 20px;

	&.is-ukulele { font-size: 14px; }
}

.logo__text {
	font-size: 20px;
	font-weight: bold;

	transition: color 200ms;

	@include mq($from: desktop) {
		font-size: 24px;
	}
}

.header__sublinks {
	display: flex;
	justify-content: flex-end;

	padding: 10px;
}

.sublinks__item {
	@include center-content;
	@include circle(36px);

	font-size: 18px;

	border: 1px solid var(--color--text--inverted);

	color: var(--color--text--inverted);

	cursor: pointer;

	&:first-child {
		margin-right: 10px;
	}
}

.header__subpage-header {
	flex: 1 1 100%;

	font-size: 18px;
	font-weight: bold;

	color: var(--color--text--inverted);
}

/**
 * Footer
 * -----------------------------------------------------------------------------
 */

.footer {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	flex: 1 1 100%;

	margin-top: 40px;
}

.nav {
	display: flex;
	justify-content: flex-end;
	@include space-children-h(20px);
}

.nav__link {
	display: flex;
	align-items: center;
	@include space-children-h(6px);

	font-size: 1.35rem;

	color: var(--color--text--secondary);

	cursor: pointer;

	&:hover {
		color: var(--color--hover);
	}
}

.nav__link__text {
	cursor: pointer;
}

.link-support    { color: var(--color--red);    }
.link-tgld:hover { color: var(--color--orange); }

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

@use "@cheap-glitch/scss-reset/_reset";
@use "@/styles/global";

</style>
<!--}}}-->
