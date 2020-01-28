

<!-- App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(v-mods="darkMode")

	//----------------------------------------------------------------------
	//- Header
	//----------------------------------------------------------------------
	header.page-header
		h1.page-header__title(v-mods="darkMode")
			fa-icon.page-header__title__logo(
				:icon="['far', instrumentIcon]"
				v-mods="{ isUkulele: instrument == 'ukulele' }"
				)
			h1.page-header__title__text Fretboarder

		nav.page-header__nav
			//- Quick help
			VButtonText.page-header__nav__link#help-tour-step--0(
				v-mods="darkMode"
				@click.native.left="startHelpTour"
				)
				fa-icon.page-header__nav__link__icon(:icon="['far', 'question-circle']")
				p Quick help

			//- Github link
			VButtonText.page-header__nav__link#help-tour-step--13(
				mode="link-external"
				href="https://github.com/cheap-glitch/fretboarder/issues"
				v-mods="darkMode"
				)
				fa-icon.page-header__nav__link__icon(:icon="['far', 'bug']")
				p Bug report / Feature request

			//- Patreon link
			VButtonText.page-header__nav__link.support-link#help-tour-step--14(
				mode="link-external"
				is-filled
				href="https://www.patreon.com/cheap_glitch"
				v-mods="darkMode"
				)
				fa-icon.page-header__nav__link__icon(:icon="['far', 'heart']")
				p Support

			//- TGLD link
			VButtonText.page-header__nav__link#help-tour-step--15(
				mode="link-external"
				href="https://www.theguitarlickdatabase.com"
				v-mods="darkMode"
				)
				p The Guitar Lick Database
				fa-icon.page-header__nav__link__icon(:icon="['far', 'external-link-square-alt']")

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
		p.page-footer__text(v-mods="darkMode") Fretboarder v2.0 by cheap glitch
		a.page-footer__link(
			href="https://twitter.com/cheap_glitch"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			v-mods="darkMode"
			)
			fa-icon(:icon="['fab', 'twitter']")
		a.page-footer__link(
			href="https://github.com/cheap-glitch/fretboarder"
			target="_blank"
			rel="external nofollow noopener noreferrer"
			v-mods="darkMode"
			)
			fa-icon(:icon="['fab', 'github']")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                  from 'vuex-pathify'
import { saveAs }               from 'file-saver'

import data                     from '@/modules/data'
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

			'darkMode',
		]),
	},

	created()
	{
		this.exportMenuTooltip = [{
			target:  '#button-export-menu',
			content: `<strong>Choose a format to export in</strong><br>
				  <em>If you want to print this  fretboard, choose PDF. The SVG format is useful
				      for embedding in web pages as it will scale perfectly when resized.</em>`
		}];
	},

	methods: {
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

	background-color: snow;

	transition: background-color 0.2s;

	&.dark-mode {
		background-color: $color-mirage;
	}
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
		color: $color-vue-tour-bg;
	}
}

/**
 * Header
 * -----------------------------------------------------------------------------
 */
.page-header {
	display: flex;
	justify-content: space-between;

	margin-bottom: 60px;
}

.page-header__title {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	padding: 2px 6px;

	border-radius: 6px;

	color: snow;

	background-color: lightgray;

	&.dark-mode {
		color: $color-mirage;
		background-color: $color-oxford-blue;
	}
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
	color: gray;
	border-color: lightgray;

	&.dark-mode {
		color: $color-oxford-blue-2;
		border-color: $color-oxford-blue;

		transition: color 0.4s, border-color 0.2s;

		&:hover {
			color: $color-nepal;
		}
	}
}

.page-header__nav__link__icon {
	transform: translateY(1px);
}

.support-link,
.support-link.dark-mode {
	color: $color-crimson;
	border-color: $color-crimson;
	background-color: $color-crimson;
}

.support-link.dark-mode {
	filter: brightness(0.8);
}

.support-link:hover {
	color: white;

	&.dark-mode {
		color: $color-mirage;
	}
}

/**
 * Footer
 * -----------------------------------------------------------------------------
 */
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

	&.dark-mode {
		color: $color-oxford-blue-2;
	}
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

// Apply the reset stylesheet
@use '@cheap-glitch/scss-reset/_reset';

// Load the global styles
@use '@/styles/global';

// Load the styles for the slider component
@use '~vue-slider-component/lib/theme/default' with (
	$themeColor: $color-azure,
);

// Load the fonts
@include font-face('IBM Plex', './assets/fonts/ibm-plex/ibm-plex');

// Improved styles for the slider component
.vue-slider                  { cursor: pointer;  }
.vue-slider-dot-handle       { cursor: grab;     }
.vue-slider-dot-handle-focus { cursor: grabbing; }

.vue-slider-dot-tooltip-inner {
	padding: 6px;
}

.vue-slider-dot-tooltip-inner {
	font-family: $fonts-text;
}

</style>
<!--}}}-->
