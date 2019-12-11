

<!-- PageFretboarderHelpTour.vue -->


<!--{{{ Pug -->
<template lang='pug'>

v-tour(name="help" :steps="steps")
	template(v-slot="tour")

		//- Tour step
		transition(name="fade")
			v-step.help-tour__step(
				v-for="(step, index) of tour.steps"
				:key="`v-tour-step--${index}`"

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
								p Previous
							VButtonText.help-tour__actions__button(
								v-show="!tour.isLast"
								is-filled
								@click.native.left="tour.nextStep"
								)
								p Next
							VButtonText.help-tour__actions__button(
								v-show="tour.isLast"
								is-filled
								@click.native.left="tour.stop"
								)
								p Finish

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

const helpTourMessages = [
	`Welcome to Fretboarder!<br>
	 This guide will take you on a quick tour of the main features.`,

	`You can change the instrument and tuning here.<br>
	 Each instrument has a different number of strings and a specific set of tunings you can choose from. Try picking one!`,

	`This slider control the number of frets displayed. Try moving both handles to see the effect on the fretboard.`,

	`These are the visual settings. From left to right:
	 <ul>
	     <li>Toggle dark mode</li>
	     <li>Toggle note names</li>
	     <li>Switch between left- and right-handed fretting and flip the fretboard accordingly</li>
	 </ul>
	`,

	`Other tools:
	 <ul>
	     <li>Remove all scales and arpeggios</li>
	     <li>Export the fretboard image in various formats (PNG, JPG, PDF, …)</li>
	 </ul>
	 `,
];

export default {
	name: 'PageFretboarderHelpTour',

	static() {
		return {
			steps: helpTourMessages.map((_message, _index) => ({
				target:  `#help-tour-step--${_index}`,
				content: `<p>${_message.replace('<br>', '</p><p>')}</p>`,
			})),
		}
	},

	methods: {
		stopTour(_event, _stopTour)
		{
			const el      = _event.target;
			const classes = el.classList;

			const ignoredClasses = [
				'VButtonIcon',

				'VSelect',
				'VSelect__bar',
				'VSelect__options',
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
	@include space-children-h(10px);
}

.help-tour__actions__button {
	color: white;
	border-color: white;
	background-color: white;

	&.is-filled:hover {
		color: #50596c;
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
		padding-left: 40px;

		list-style: circle outside;

		cursor: default;
		user-select: none;
	}
}

</style>
<!--}}}-->
