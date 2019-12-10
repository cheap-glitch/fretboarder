

<!-- PageFretboarderHelpTour.vue -->


<!--{{{ Pug -->
<template lang='pug'>

v-tour(name="help" :steps="steps")
	template(slot-scope="tour")

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

				v-click-outside="tour.stop"
				)

				//- Footer
				template(slot="actions")
					div.help-tour__step__footer

						//- Pagination
						p.help-tour__step__footer__page {{ index + 1 }} / {{ tour.steps.length }}

						//- Finish button
						div(v-if="tour.isLast").help-tour__actions
							button.help-tour__actions__button.button-filled(@click.left="tour.stop") Finish

						//- Prev/next buttons
						div(v-else).help-tour__actions
							button.help-tour__actions__button(@click.left="tour.previousStep") Prev
							button.help-tour__actions__button.button-filled(@click.left="tour.nextStep") Next

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

const helpTourMessages = [
	`Welcome to Fretboarder!<br>
	 This guide will take you on a quick tour of the main features.`,

	`Here you can change the instrument and tuning.<br>
	 Each instrument has a different number of strings and a specific set of tunings you can pick from.`,
];

export default {
	name: 'PageFretboarderHelpTour',

	static() {
		return {
			steps: [...Array(2).keys()].map(_index => ({
				target:  `#help-tour-step--${_index}`,
				content: `<p>${helpTourMessages[_index].replace('<br>', '</p><p>')}</p>`,
			})),
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.help-tour__step {
	z-index: 1000;
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
	appearance: none;

	padding: 6px;

	border: 2px solid transparent;
	border-radius: 6px;

	font-family: 'IBM Plex', helvetica, arial, sans-serif;

	color: white;
	background: none;

	transition: border-color 0.2s;

	&:hover {
		border-color: white;
	}
}

.button-filled {
	border-color: white;

	transition: color 0.2s, background-color 0.2s;

	&:hover {
		color: #50596c;
		background-color: white;
	}
}

</style>
<!--}}}-->


<!--{{{ Global SCSS -->
<style lang='scss'>

.v-step__content > div {
	@include space-children-v(10px);

	text-align: left;
	line-height: 1.4;

	font-family: 'IBM Plex', helvetica, arial, sans-serif;
}

</style>
<!--}}}-->
