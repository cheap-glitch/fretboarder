

<!-- components/HelpTour.vue -->


<!--{{{ Pug -->
<template lang="pug">

v-tour(
	name="help"
	:steps="steps"
	:callbacks="{ onNextStep }"
	)

	//- Tour step
	template(v-slot="tour"): transition(name="fade")
		v-step.step(
			v-for="(step, index) of tour.steps"
			:key="`help-tour-step--${index}`"

			v-if="tour.currentStep == index"
			:step="step"
			:labels="tour.labels"
			:previous-step="tour.previousStep"
			:next-step="tour.nextStep"
			:stop="tour.stop"
			:is-first="tour.isFirst"
			:is-last="tour.isLast"

			v-click-outside="event => stopTour(event, tour.stop)"
			)

			//- Footer
			template(v-slot:actions)
				div.step__footer

					//- Pagination
					p.step__pagination {{ index + 1 }} / {{ tour.steps.length }}

					//- Prev/next/finish buttons
					div.step__actions
						button.button(
							v-show="!tour.isFirst"
							@click.left="tour.previousStep"
							)
							p.button__text ← Previous

						button.button.is-filled(
							v-show="!tour.isLast"
							@click.left="tour.nextStep"
							)
							p.button__text Next →

						button.button.is-filled(
							v-show="tour.isLast"
							@click.left="tour.stop"
							)
							p.button__text Got it!

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }           from 'vuex-pathify'
import { MAX_NB_SCALES } from '@/stores/scales'

const helpTourMessages = [
	// {{{

	// 1
	`Welcome to Fretboarder!<br>
	 This guide will take you on a quick tour of the main features.`,

	// 2
	`You can change the instrument and tuning here.<br>
	 Each instrument has a different number of strings and a specific set of tunings you can choose from. Try picking one!`,

	// 3
	`This slider control the number of frets displayed. Try moving both handles to see the effect on the fretboard.`,

	// 4
	`These are the main settings &amp; tools. From left to right:
	 <ul>
	     <li>Toggle fret numbers</li>
	     <li>Toggle note names</li>
	     <li>Switch between left- and right-handed fretting and flip the fretboard accordingly</li>
	     <li>Export the fretboard image in various formats (PNG, JPG or SVG)</li>
	 </ul>
	`,

	// 5
	`Click here to add new scales and arpeggios.<br>
	 You can display up to ${MAX_NB_SCALES} simultaneously.`,

	// 6
	`Each scale and arpeggio can be configured independently.`,

	// 7
	`You can choose to display scales in their entirety, or only a single position at a time.<br>
	 <em>Conventionally, the first position is always the one where the root note is on the first string.</em>`,

	// 8
	`You can use this selector to emphasize a particular interval of the scale.<br>
	 Try clicking on the <strong>R</strong> to highlight the root notes.`,

	// 9
	`These settings provide more control over how each scale is displayed:
	 <ul>
	     <li>Toggle the visibility of the scale</li>
	     <li>Display only this scale (focus it)</li>
	     <li>Display only the intersections, <em>i.e.</em> the notes this scales has in common with other scales and/or arpeggios</li>
	 </ul>`,

	// 10
	`Other tools:
	 <ul>
	     <li>Duplicate the scale</li>
	     <li>Remove the scale</li>
	 </ul>`,

	// 11
	`Hover on the notes to see which intervals they match with.`,

	// 12
	`That’s it for now!<br>
	 If you notice a nasty bug or if you’d really like to see a particular feature implemented, don’t hesitate to send a quick feedback.`,

	// 13
	`If Fretboarder is useful to you, consider donating to keep it alive and improving!`,

	// 14
	`Also, if you’re interested in lead guitar playing, check out <strong>The Guitar Lick Database</strong> to expand your lick vocabulary.`,

	// }}}
];

const helpTourTargets = [
	...[...Array(5).keys()].map(n => `#help-tour-step--${n}`),
	'#help-tour--scales .scale-props',
	'#help-tour--scales .select-position',
	'#help-tour--scales .intervals',
	'#help-tour--scales .scale-tools > .VButton',
	'#help-tour--scales .scale-tools > .VButton:nth-last-child(2)',
	...[...Array(4).keys()].map(n => `#help-tour-step--${n + 11}`),
];

export default {
	name: 'HelpTour',

	computed: {
		...get('scales', ['scales'])
	},

	created()
	{
		this.steps = helpTourMessages.map((message, index) => ({
			target:  helpTourTargets[index],
			content: `<p>${message.replace('<br>', '</p><p>')}</p>`,
		}));
	},

	methods: {
		onNextStep(step)
		{
			/**
			 * Make sure there is at least one scale before
			 * reaching the step where the scales settings are presented
			 */
			if ((step + 1) == 4 && this.scales.length == 0)
				this.$store.commit('scales/addScale');

			/**
			 * Make sure there is at least two scales before
			 * reaching the step where the scales tools are presented
			 */
			if ((step + 1) == 8)
			{
				while (this.scales.length <= 1)
					this.$store.commit('scales/addScale', this.scales.length == 1 ? { tonality: 'C#', model: 'majb'} : {});
			}
		},
		stopTour(event, stopTour)
		{
			const el      = event.target;
			const classes = el.classList;

			const ignoredClasses = [
				'VButton',
				'VButton__button',
				'VButton__icon',

				'VSelect',
				'VSelect__bar',
				'VSelect__options',

				'intervals',
				'intervals__item',
			];

			/**
			 * Stop the tour when clicking outside the tooltips, unless
			 * it's on an interactive element
			 *
			 * This allows to try the functionalities during the tour without
			 * accidentally closing it
			 */
			if (this.$store.state.isFretRangeSliderClicked
			|| ignoredClasses.some(name => classes.contains(name) || (el.parentElement && el.parentElement.classList.contains(name))))
			{
				this.$store.commit('setIsFretRangeSliderClicked', false);
				return;
			}

			stopTour();
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.step {
	z-index: 100;
}

.step__footer {
	display: flex;
	align-items: baseline;
	justify-content: space-between;

	margin-top: 20px;
}

.step__pagination {
	font-size: 1.3rem;

	color: lightgray;

	transform: translateY(4px);
}

.step__actions {
	display: flex;
	@include space-children-h(10px);
}

.button,
.button__text {
	cursor: pointer;
}

.button {
	padding: 6px;

	appearance: none;
	background-image: none;

	border: 2px solid var(--color--bg--tooltip);
	border-radius: 6px;

	background-color: var(--color--bg--tooltip);

	transition: border-color 0.2s, background-color 0.2s;

	&.is-filled,
	&:not(.is-filled):hover {
		border-color: white;
	}

	&.is-filled:hover {
		background-color: white;

		.button__text {
			color: var(--color--bg--tooltip);
		}
	}
}

.button__text {
	color: white;
}

</style>
<!--}}}-->


<!--{{{ Global SCSS -->
<style lang="scss">

.v-step {
	border-radius: 6px;
}

.v-step__content > div {
	@include space-children-v(10px);

	text-align: left;
	line-height: 1.4;

	user-select: none;

	ul {
		padding-left: 30px;

		list-style: circle outside;

		cursor: default;
	}
}

</style>
<!--}}}-->
