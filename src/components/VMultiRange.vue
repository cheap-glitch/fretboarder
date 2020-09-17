

<!-- components/VMultiRange.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VMultiRange(
	v-mods="{ isFlipped }"
	:style="`--fill--start: ${values[0]/max * 100}%; --fill--stop: ${values[1]/max * 100}%` "

	@click.left="selectValue"
	)
	each index of [0, 1]
		input.slider(
			type="range"
			:min="min"
			:max="max"

			:value=`values[${index}]`

			@input=` updateValue(${index}, $event)`
			@change=`updateValue(${index}, $event)`
			@click.left.stop
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VMultiRange',

	model: {
		prop:  'values',
		event: 'input',
	},

	props: {
		values: {
			type: Array,
			required: true,
			validator: v => v.length == 2 && v.every(value => typeof value == 'number')
		},
		min: {
			type: Number,
			required: true,
		},
		max: {
			type: Number,
			required: true,
		},
		minGap: {
			type: Number,
			default: 1,
		},
		isFlipped: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		selectValue(event)
		{
			// Compute the selected value using the location of the pointer
			const rect  = this.$el.getBoundingClientRect();
			const value = Math.max(0, Math.min(this.max, this.min + Math.ceil(Math.max(0, event.clientX - rect.x)*this.max / rect.width)));

			// "Trigger" a fake change event
			this.updateValue(1, { type: 'change', target: { value } });
		},
		updateValue(inputIndex, event)
		{
			const newValues  = this.values.map((value, index) => index == inputIndex ? parseInt(event.target.value, 10) : value);
			const missingGap = this.minGap - (newValues[1] - newValues[0]);

			// Prevent the values from being too close or overlapping
			if (missingGap > 0)
			{
				if (inputIndex == 0)
				{
					// Try "pushing" the second thumb forward
					const spaceLeft = this.max - newValues[1];
					newValues[1] += Math.min(spaceLeft, missingGap);

					// Adjust the position of the first thumb accordingly
					newValues[0] -= Math.max(0, missingGap - spaceLeft);
				}
				else if (inputIndex == 1)
				{
					// Try "pushing" the first thumb backward
					const spaceLeft = newValues[0] - this.min;
					newValues[0] -= Math.min(spaceLeft, missingGap);

					// Adjust the position of the second thumb accordingly
					newValues[1] += Math.max(0, missingGap - spaceLeft);
				}
			}

			this.$emit(event.type, newValues);
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VMultiRange {
	position: relative;
	display: grid;

	cursor: pointer;

	&::before, &::after {
		content: "";

		position: absolute;
		top: 50%;
		transform: translateY(-50%);

		height: 4px;

		border-radius: 2px;
	}

	&::before {
		left: 0;
		right: 0;

		background-color: var(--color--border);
	}

	&::after {
		left:  var(--fill--start);
		right: calc(100% - var(--fill--stop));

		background-color: var(--color--hover);
	}

	&.is-flipped {
		transform: scaleX(-1);
	}
}

@mixin track()
{
	border: none;
	appearance: none;
	background: none;
}

@mixin thumb()
{
	@include circle(14px);

	border: none;
	appearance: none;
	background-color: currentcolor;

	// Catch clicks
	pointer-events: auto;
	cursor: grab;

	transition: color 200ms;
}

.slider {
	grid-area: 1 / 1;
	z-index: 1;

	color: var(--color--text--secondary);

	// Let clicks pass through the tracks
	pointer-events: none;

	@include track;
	&::-moz-range-thumb              { @include thumb; }
	&::-moz-range-track              { @include track; }
	&::-webkit-slider-thumb          { @include thumb; }
	&::-webkit-slider-runnable-track { @include track; }

	&:hover {
		color: var(--color--hover);
	}

	&:focus {
		z-index: 2;
		color: var(--color--hover);

		outline: none;
		&::-moz-focus-outer { border-style: none; }

		&::-moz-range-thumb     { cursor: grabbing; }
		&::-webkit-slider-thumb { cursor: grabbing; }
	}
}

</style>
<!--}}}-->
