

<!-- PageFretboarderHelpTour.vue -->


<!--{{{ Pug -->
<template lang='pug'>

v-tour(
	name="help"
	:steps="steps"
	:callbacks="{ onNextStep }"
	)

	//- Tour step
	template(v-slot="tour")
		transition(name="fade")
			v-step.help-tour__step(
				v-for="(step, index) of tour.steps"
				:key="`help-tour-step--${index}`"

				v-if="tour.currentStep === index"
				:step="step"
				:labels="tour.labels"
				:previous-step="tour.previousStep"
				:next-step="tour.nextStep"
				:stop="tour.stop"
				:is-first="tour.isFirst"
				:is-last="tour.isLast"

				v-click-outside="_event => stopTour(_event, tour.stop)"
				)

				//- Footer
				template(v-slot:actions)
					div.help-tour__step__footer

						//- Pagination
						p.help-tour__step__footer__page {{ index + 1 }} / {{ tour.steps.length }}

						//- Prev/next/finish buttons
						div.help-tour__actions
							VButtonText.help-tour__actions__button(
								v-show="!tour.isFirst"
								@click.native.left="tour.previousStep"
								)
								p ← Previous
							VButtonText.help-tour__actions__button(
								v-show="!tour.isLast"
								is-filled
								@click.native.left="tour.nextStep"
								)
								p Next →
							VButtonText.help-tour__actions__button(
								v-show="tour.isLast"
								is-filled
								@click.native.left="tour.stop"
								)
								p Got it!

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapMutations }  from 'vuex'
import { get }           from 'vuex-pathify'

import { MAX_NB_SCALES } from '@/stores/scales'

const helpTourMessages = [
	// 1
	`Welcome to Fretboarder!<br>
	 This guide will take you on a quick tour of the main features.`,

	// 2
	`You can change the instrument and tuning here.<br>
	 Each instrument has a different number of strings and a specific set of tunings you can choose from. Try picking one!`,

	// 3
	`This slider control the number of frets displayed. Try moving both handles to see the effect on the fretboard.`,

	// 4
	`These are the visual settings. From left to right:
	 <ul>
	     <li>Toggle dark mode</li>
	     <li>Toggle note names</li>
	     <li>Switch between left- and right-handed fretting and flip the fretboard accordingly</li>
	 </ul>
	`,

	// 5
	`Other tools:
	 <ul>
	     <li>Remove all scales and arpeggios</li>
	     <li>Export the fretboard image in various formats (PNG, JPG, PDF, …)</li>
	 </ul>
	 `,

	// 6
	`Click here to add new scales and arpeggios.<br>
	 You can display up to ${MAX_NB_SCALES} simultaneously.`,

	// 7
	`Each scale and arpeggio can be configured independently.`,

	// 8
	`You can choose to display scales in their entirety, or only a single position at a time.<br>
	 <em>Conventionally, the first position is always the one where the root is on the first string.</em>`,

	// 9
	`You can use this selector to emphasize a particular interval of the scale.<br>
	 Try clicking on the <strong>R</strong> to highlight the root notes.`,

	// 10
	`These settings provide more control over how each scale is displayed:
	 <ul>
	     <li>Toggle the visibility of the scale</li>
	     <li>Display only this scale (focus it)</li>
	     <li>Display only the intersections, <em>i.e.</em> the notes this scales has in common with other scales and/or arpeggios</li>
	 </ul>`,

	// 11
	`Other tools:
	 <ul>
	     <li>Duplicate the scale</li>
	     <li>Remove the scale</li>
	 </ul>`,

	// 12
	`Hover on the notes to see which interval they correspond with.`,

	// 13
	`That’s it for now!<br>
	 If you notice a nasty bug or if you’d really like to see a particular feature implemented, don’t hesitate to send a quick feedback.`,

	// 13
	`If Fretboarder is useful to you, consider donating to keep it alive and improving!`,

	// 14
	`Also, if you’re interested in lead guitar playing, check out <strong>The Guitar Lick Database</strong> to expand your lick vocabulary.`,
];

const helpTourTargets = [
	...[...Array(6).keys()].map(_n => `#help-tour-step--${_n}`),
	'.FretboardScale .scale-props',
	'.FretboardScale .select-position',
	'.FretboardScale .scale-tools__intervals',
	'.FretboardScale .scale-tools .VButtonIcon:nth-of-type(2)',
	'.FretboardScale .scale-tools .VButtonIcon:nth-last-of-type(2)',
	...[...Array(4).keys()].map(_n => `#help-tour-step--${_n + 12}`),
];

export default {
	name: 'PageFretboarderHelpTour',

	static() {
		return {
			steps: helpTourMessages.map((_message, _index) => ({
				target:  helpTourTargets[_index],
				content: `<p>${_message.replace('<br>', '</p><p>')}</p>`,
			})),
			onNextStep: this.onNextStep,
		}
	},

	computed: {
		...get('scales/scales')
	},

	methods: {
		onNextStep(_step)
		{
			/**
			 * Make sure there is at least one scale before
			 * reaching the step where the scales settings are presented
			 */
			if ((_step + 1) == 6 && this.scales.length == 0)
				this.addScale();

			/**
			 * Make sure there is at least two scales before
			 * reaching the step where the scales tools are presented
			 */
			if ((_step + 1) == 9)
			{
				while (this.scales.length <= 1)
					this.addScale(this.scales.length == 1 ? { tonality: 'C#', model: 'majb'} : {});
			}
		},
		stopTour(_event, _stopTour)
		{
			const el      = _event.target;
			const classes = el.classList;

			const ignoredClasses = [
				'VButtonIcon',
				'VButtonIcon__icon',

				'VSelect',
				'VSelect__bar',
				'VSelect__options',

				'scale-tools__intervals',
				'scale-tools__intervals__item',
			];

			/**
			 * Stop the tour when clicking outside the tooltips, unless
			 * it's on an interactive element
			 *
			 * This allows to try the functionalities during the tour without
			 * accidentally closing it
			 */
			if (this.$store.state.isFretRangeSliderClicked
			|| ignoredClasses.some(_class => classes.contains(_class) || (el.parentElement && el.parentElement.classList.contains(_class))))
			{
				this.$store.commit('setFretRangeSliderClicked', false);
				return;
			}

			_stopTour();
		},
		...mapMutations([
			'scales/addScale'
		]),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.help-tour__step {
	z-index: 100;
}

.help-tour__step__footer {
	display: flex;
	align-items: baseline;
	justify-content: space-between;

	margin-top: 20px;
}

.help-tour__step__footer__page {
	font-size: 1.3rem;

	color: lightgray;

	transform: translateY(4px);
}

.help-tour__actions {
	display: flex;
	@include space-children-h(10px);
}

.help-tour__actions__button {
	color: white;
	border-color: white;
	background-color: white;

	&.is-filled:hover {
		color: $color-vue-tour-bg;
	}
}

</style>
<!--}}}-->


<!--{{{ Global SCSS -->
<style lang='scss'>

.v-step {
	border-radius: 6px;
}

.v-step__content > div {
	@include space-children-v(10px);

	text-align: left;
	line-height: 1.4;

	font-family: $fonts-text;

	ul {
		padding-left: 30px;

		list-style: circle outside;

		cursor: default;
		user-select: none;
	}
}

</style>
<!--}}}-->
