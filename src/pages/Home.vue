

<!-- pages/Home.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.Home

	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------

	//- header.header
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

	//- component(
		:is="isMobileDevice ? 'VModal' : 'div'"
		modal-title="Settings"
		:is-open="isModalSettingsOpen"

		@close="isModalSettingsOpen = false"
		)
		FretboardSettings

	//- div.fretboard-wrapper#fretboard-wrapper: FretboardViewer(:is-vertical="isMobileDevice && !isLayoutLandscape")
	FretboardSequences

	//- component(
		:is="isMobileDevice ? 'VModal' : 'div'"
		modal-title="Scales"
		:is-open="isModalScalesOpen"

		@close="isModalScalesOpen = false"
		)
		ScalesList

	//----------------------------------------------------------------------
	//- Mobile actions
	//----------------------------------------------------------------------

	//- div.mobile-actions
		div.mobile-actions__item(@click.left="isModalScalesOpen   = true"): fa-icon(icon="list-music")
		div.mobile-actions__item(@click.left="isModalSettingsOpen = true"): fa-icon(icon="cog")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }            from 'vuex-pathify'

import FretboardViewer    from '@/components/FretboardViewer'
import FretboardSequences from '@/components/FretboardSequences'

export default {
	name: 'Home',

	components: {
		FretboardViewer,
		FretboardSequences,
	},

	computed: {
		/*
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
		*/
		...get([
			'isMobileDevice',
			'isLayoutLandscape',
		]),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.Home {
	@include space-children-v(60px);
}

@include mq($from: desktop)
{
	.fretboard-wrapper {
		padding: 70px 0 40px 0;
		overflow-x: auto;
	}
}

/*
@include mq($until: desktop)
{
	.Home {
		display: flex;

		@media (orientation: portrait)  { justify-content: center; }
		@media (orientation: landscape) { align-items:     center; }
	}

}
*/

/**
 * Header
 * -----------------------------------------------------------------------------
 */

/*
.header {
	display: none;

	@include mq($from: desktop)
	{
		display: flex;
		align-items: flex-start;
		justify-content: space-between;

		padding-bottom: 60px;
	}
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
*/

/**
 * Mobile actions
 * -----------------------------------------------------------------------------
 */

/*
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

	@include mq($from: desktop)
	{
		display: none;
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
*/

</style>
<!--}}}-->
