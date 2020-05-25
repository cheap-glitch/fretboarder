

<!-- components/VMultiRange.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VMultiRange: each index in [0, 1]
	input.slider(
		type="range"
		:min="min"
		:max="max"

		:value=`values[${index}]`

		@input=` updateValue(${index}, $event)`
		@change=`updateValue(${index}, $event)`
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
	},

	methods: {
		updateValue(inputIndex, event)
		{
			this.$emit(event.type, this.values.map((value, index) => index == inputIndex ? parseInt(event.target.value) : value));
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

	&::before {
		content: "";

		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);

		height: 4px;

		border-radius: 2px;

		background-color: var(--color--border);
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
