

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")

	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------
	header.header
		h1.header__title
			fa-icon.header__title__logo(
				:icon="['far', instrumentIcon]"
				v-mods="{ isUkulele: instrument == 'ukulele' }"
				)
			h1.header__title__text Fretboarder

		nav.header__nav
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

	//----------------------------------------------------------------------
	//- Body
	//----------------------------------------------------------------------
	PageFretboarder
	PageFretboarderHelpTour
	v-tour(name="export-menu" :steps="exportMenuTooltip")
		template(v-slot="tour")
			transition(name="fade")
				v-step.export-menu(
					v-if="tour.currentStep == 0"

					:step="tour.steps[0]"
					:labels="tour.labels"
					:stop="tour.stop"

					v-click-outside="tour.stop"
					)
					template(v-slot:actions)
						div.export-menu__actions
							VButtonText.export-menu__actions__button(
								v-for="format in ['png', 'jpg', 'svg', 'pdf']"
								:key="`export-button--${format}`"

								is-filled
								@click.native.left="exportFretboardToFile(format)"
								)
								p {{ format.toUpperCase() }}

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

import { get }                  from 'vuex-pathify'
import { saveAs }               from 'file-saver'

import { EventBus }             from '@/modules/bus'
import data                     from '@/modules/data'
import colorscheme              from '@/modules/colorscheme'
import { objectMapToObj }       from '@/modules/object'
import * as exportFretboard     from '@/modules/export'

import PageFretboarder          from '@/components/PageFretboarder'
import PageFretboarderHelpTour  from '@/components/PageFretboarderHelpTour'

export default {
	name: 'App',

	components: {
		PageFretboarder,
		PageFretboarderHelpTour,
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
			'tuning',
			'fretRange',
			'scales/activeScales',

			'isFretboardFlipped',
			'isDisplayingNotesName',
			'isDarkModeOn',
		]),
	},

	created()
	{
		// Register all key presses on the page
		window.addEventListener('keydown', this.registerKeypress,  { passive: true });

		// Update the width of the window on every resize
		window.addEventListener('resize',  this.updateClientWidth, { passive: true });

		this.exportMenuTooltip = [{
			target:  '#button-export-menu',
			content: `<strong>Choose a format to export in</strong><br>
				  <em>If you want to print this  fretboard, choose PDF. The SVG format is useful
				      for embedding in web pages as it will scale perfectly when resized.</em>`
		}];
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
		exportFretboardToFile(format)
		{
			// Close the export menu tootlip
			this.$tours['export-menu'].stop();

			const svg = exportFretboard.exportFretboardToSVG(
				data.instruments[this.instrument].nbStrings,
				this.fretRange[0],
				this.fretRange[1],
				data.tunings[this.instrument][this.tuning],
				this.activeScales,
				this.isFretboardFlipped,
				this.isDisplayingNotesName,
				format != 'svg',
			);

			switch (format)
			{
				case 'png':
				case 'jpg':
					exportFretboard.exportSVGToImage(svg, format);
					break;

				case 'svg':
					saveAs(svg.blob, 'fretboard.svg');
					break;

				case 'pdf':
					exportFretboard.exportSVGToPDF(svg);
					break;
			}
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use 'sass:color';

.App {
	display: flex;
	align-items: stretch;
	flex-direction: column;
	overflow-y: hidden;

	padding: 20px 40px;

	min-height: 100%;

	background-color: var(--color--bg);

	transition: background-color 0.2s;
}

.export-menu {
	z-index: 100;
}

.export-menu__actions {
	display: flex;
	justify-content: center;
	@include space-children-h(10px);

	margin-top: 40px;
}

.export-menu__actions__button {
	color: white;
	border-color: white;
	background-color: white;

	&:hover {
		color: $color-slate-gray;
	}
}

/**
 * Header
 * -----------------------------------------------------------------------------
 */
.header {
	display: none;
	justify-content: space-between;

	margin-bottom: 60px;

	@include mq($from: desktop)
	{
		display: flex;
	}
}

.header__title {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	padding: 2px 6px;

	border-radius: 6px;

	color: var(--color--bg);
	background-color: var(--color--logo--bg);
}

.header__title__logo {
	font-size: 25px;

	&.is-ukulele {
		font-size: 20px;
	}
}

.header__title__text {
	font-size: 30px;
	font-weight: bold;
}

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
	color: var(--color--text-2);
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
	color: $color-crimson;
	border-color: $color-crimson;
	background-color: $color-crimson;

	&:hover {
		color: var(--color--support-link--text--hover);
	}

	&.is-dark-mode-on {
		filter: brightness(0.8);
	}
}

/**
 * Footer
 * -----------------------------------------------------------------------------
 */
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

	color: var(--color--text-2);
}

.page-footer__link {
	cursor: pointer;

	transition: color 0.2s;

	&:hover {
		color: $color-sun;
	}
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
