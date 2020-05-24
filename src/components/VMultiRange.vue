

<!-- components/VMultiRange.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VMultiRange: each index in [0, 1]
	input.slider(type="range" :min="min" :max="max" :value=`values[${index}]` @input=`e => updateValue(${index}, e)`)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VMultiRange',

	model: {
		prop:  'values',
		event: 'change',
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
			this.$emit('change', this.values.map((value, index) => index == inputIndex ? parseInt(event.target.value) : value));
		}
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VMultiRange {
	display: grid;

	background-color: var(--color--bg--highlight);
}

@mixin track()
{
	border: none;
	appearance: none;
	background: none;
}

@mixin thumb()
{
	@include circle(20px);

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
		outline: 1px solid var(--color--hover);

		&::-moz-range-thumb     { cursor: grabbing; }
		&::-webkit-slider-thumb { cursor: grabbing; }
	}
}

</style>
<!--}}}-->
