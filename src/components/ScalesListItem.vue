

<!-- components/ScalesListItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ScalesListItem(:style="{ 'border-color': color }")

	div.color-dot(:style="{ 'background-color': color }")

	//----------------------------------------------------------------------
	//- Scale properties
	//----------------------------------------------------------------------

	//- Type
	VSelect.select-type(
		:value="type"
		:options="{ scale: 'Scale', arpeggio: 'Arpeggio' }"
		@change="updateType"
		)
	//- Tonality
	VSelect.select-tonality(
		:value="tonality"
		:options="tonalities"
		@change="v => updateScale('tonality', v)"
		)
	//- Model
	VSelect.select-model(
		:value="model"
		:options="modelsNames"
		@change="updateModel"

		v-mods="{ isArpeggio: type == 'arpeggio' }"
		)
	//- Position
	//- VSelect.select-position(
		v-show="type == 'scale'"
		:value="position"
		:options="positions"
		is-value-number
		@change="v => updateScale('position', v)"
		)

		//----------------------------------------------------------------------
		//- Tools
		//----------------------------------------------------------------------
		//- div.tools

			//- Intervals
			div.intervals
				div.intervals__item(
					v-for="(interval, intervalIndex) in intervals"
					:key="`scale--${index}--interval--${intervalIndex}`"
					ref="interval"

					v-mods="{ isSelected: highlightedInterval == interval.value }"

					@click.left="updateScale('highlightedInterval', highlightedInterval == interval.value ? null : interval.value)"
					@mouseenter="hoveredInterval = intervalIndex"
					@mouseleave="hoveredInterval = null"
					)
					p.intervals__item__text {{ interval.name }}

			div.tools__separator

			div.toolbar

				//- Show/hide
				VButton.toolbar__item(
					:icon="isVisible ? 'eye' : 'eye-slash'"
					size="small"
					:tooltip="isVisible ? 'Hide' : 'Show'"
					tooltip-placement="bottom"

					@click="updateScale('isVisible', !isVisible)"
					)
				//- Focus
				VButton.toolbar__item(
					v-show="nbScales > 1"

					icon="bullseye"
					size="small"
					:tooltip="isFocused ? 'Unfocus' : 'Focus'"
					tooltip-placement="bottom"

					:is-active="isFocused"
					@click="$store.commit('scales/toggleFocusScale', id)"
					)
				//- Show intersections only
				VButton.toolbar__item(
					v-show="nbScales > 1"

					:icon="['fas', 'intersection']"
					size="small"
					tooltip="Show only intersections with other scales"
					tooltip-placement="bottom"

					:is-active="isIntersected"
					@click="updateScale('isIntersected', !isIntersected)"
					)

				div.tools__separator

				//- Duplicate
				VButton.toolbar__item(
					icon="copy"
					size="small"
					tooltip="Duplicate"
					tooltip-placement="bottom"

					:is-disabled="nbScales == MAX_NB_SCALES"
					@click="$store.commit('scales/addScale', id)"
					)
				//- Remove
				VButton.toolbar__item(
					icon="times-circle"
					size="small"
					tooltip="Remove"
					tooltip-placement="bottom"

					@click="$store.commit('scales/removeScale', id)"
					)

	//- Interval tooltips
	//- VTooltip.intervals-tooltip(
		v-for="(interval, intervalIndex) in intervals"
		:key="`scale--${index}--interval--${intervalIndex}--tooltip`"

		:is-open="hoveredInterval === intervalIndex"

		:target="$refs.interval ? $refs.interval[intervalIndex] : false"
		placement="bottom"
		:delay="500"
		)
		p Highlight {{ intervalsNames[interval.value].toLowerCase() }} notes

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { MAX_NB_SCALES }                                 from '@/stores/scales'
import { scales, arpeggios, notesNames, intervalsNames } from '@/modules/music'

export default {
	name: 'ScalesListItem',

	props: {
		index: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			required: true,
			validator: v => ['arpeggio', 'scale'].includes(v)
		},
		model: {
			type: String,
			required: true,
		},
		tonality: {
			type: String,
			required: true,
		},
		position: {
			type: Number,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		nbScales: {
			type: Number,
			required: true,
		},
		highlightedInterval: {
			type: Number,
			default: null,
		},
		isVisible: {
			type: Boolean,
			default: true,
		},
		isFocused: {
			type: Boolean,
			default: false,
		},
		isIntersected: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			hoveredInterval: null,
		}
	},

	computed: {
		/*
		intervals()
		{
			let rootInterval = 0;

			return [
				{ value: 0, name: 'R' },
				...this.models[this.model].model.slice(0, -1).map(function(interval)
				{
					rootInterval += interval;

					switch(rootInterval)
					{
						case 1:  return { value: rootInterval, name: '2m' };
						case 2:  return { value: rootInterval, name: '2M' };
						case 3:  return { value: rootInterval, name: '3m' };
						case 4:  return { value: rootInterval, name: '3M' };
						case 5:  return { value: rootInterval, name: '4'  };
						case 6:  return { value: rootInterval, name: '5♭' };
						case 7:  return { value: rootInterval, name: '5'  };
						case 8:  return { value: rootInterval, name: '6m' };
						case 9:  return { value: rootInterval, name: '6M' };
						case 10: return { value: rootInterval, name: '7m' };
						case 11: return { value: rootInterval, name: '7M' };
					}
				})
			];
		},
		*/
		modelsNames()
		{
			return Object.keys(this.models).map(key => ({ name: this.models[key].name, value: key }));
		},
		models()
		{
			return (this.type == 'scale') ? scales : arpeggios;
		},
	},

	created()
	{
		this.MAX_NB_SCALES  = MAX_NB_SCALES;
		this.tonalities     = notesNames;
		this.intervalsNames = intervalsNames;
		/*
		this.positions      = {
			0: 'Whole',
			1: '1<sup>st</sup> pos',
			2: '2<sup>nd</sup> pos',
			3: '3<sup>rd</sup> pos',
			4: '4<sup>th</sup> pos',
			5: '5<sup>th</sup> pos',
		}
		*/
	},

	methods: {
		updateType(type)
		{
			// Reset the model when the type of scale is changed
			this.updateModel('maj');
			this.updateScale('type', type);
		},
		updateModel(model)
		{
			// Reset the highlighted interval when the model of the scale is changed
			this.updateScale('highlightedInterval',  null);
			this.updateScale('model', model);
		},
		updateScale(prop, value)
		{
			this.$store.commit('scales/updateScale', { index: this.index, prop, value });
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.ScalesListItem {
	@include mq($until: desktop)
	{
		border-width: 2px;
		border-style: solid;
		border-radius: 10px;
	}

	@include mq($from: desktop)
	{
		display: flex;
		align-items: center;
		@include space-children-h(10px);
	}
}

.color-dot {
	@include circle(10px);

	@include mq($until: desktop)
	{
		display: none;
	}
}

//- .settings {
//- 	flex: 1 1 100%;

//- 	@include mq($until: desktop)
//- 	{
//- 		display: grid;
//- 		grid-template-columns: repeat(5, [col] 1fr);

//- 		.select-type     { grid-column: col 1 / span 4; }
//- 		.select-tonality { grid-column: col 5 / span 1; }
//- 		.select-model    { grid-column: col 1 / span 3; }
//- 		.select-position { grid-column: col 4 / span 2; }

//- 		.select-type,
//- 		.select-tonality,
//- 		.select-model,
//- 		.select-position {
//- 			border-bottom: 1px solid var(--color--border);
//- 		}

//- 		.select-type, .select-model {
//- 			border-right: 1px solid var(--color--border);
//- 		}

//- 		.select-model.is-arpeggio {
//- 			grid-column: col 1 / span 5;

//- 			border-right: none;
//- 		}
//- 	}

//- 	@include mq($from: desktop)
//- 	{
//- 		display: flex;
//- 		align-items: center;
//- 		@include space-children-h(10px);

//- 		margin-right: 30px;

//- 		.select-type     { max-width: 120px; min-width: 120px; }
//- 		.select-tonality { max-width: 60px;  min-width: 60px;  }
//- 		.select-model    { max-width: 220px; min-width: 220px; }
//- 		.select-position { max-width: 100px; min-width: 100px; }
//- 	}
//- }

//- .tools {
//- 	@include mq($from: desktop)
//- 	{
//- 		display: flex;
//- 		align-items: center;
//- 		@include space-children-h(10px);
//- 	}
//- }

//- .tools__separator {
//- 	display: none;

//- 	@include mq($from: desktop)
//- 	{
//- 		display: block;

//- 		@include circle(4px);
//- 		flex: 0 0 auto;

//- 		background-color: var(--color--border);
//- 	}
//- }

//- .intervals {
//- 	display: flex;

//- 	@include mq($until: desktop)
//- 	{
//- 		border-bottom: 1px solid var(--color--border);
//- 	}
//- }

//- .intervals__item {
//- 	padding: 10px 0;

//- 	color: var(--color--text);

//- 	cursor: pointer;

//- 	&:not(:last-child) {
//- 		border-right: 1px solid var(--color--border);
//- 	}

//- 	&.is-selected {
//- 		color: var(--color--highlight);
//- 		background-color: var(--color--bg--highlight);
//- 	}

//- 	@include mq($until: desktop)
//- 	{
//- 		flex: 1 1 100%;
//- 		text-align: center;
//- 	}

//- 	@include mq($from: desktop)
//- 	{
//- 		padding: 2px 8px;

//- 		border: 1px solid var(--color--border);

//- 		&:not(:last-child) {
//- 			border-right: none;
//- 		}

//- 		&:first-child {
//- 			padding-left: 10px;

//- 			border-radius: 1e3px 0 0 1e3px;
//- 		}

//- 		&:last-child {
//- 			padding-right: 10px;

//- 			border-radius: 0 1e3px 1e3px 0;
//- 		}

//- 		&:not(.is-selected):hover {
//- 			color: var(--color--hover);
//- 			background-color: var(--color--bg--highlight);
//- 		}
//- 	}
//- }

//- .intervals__item__text {
//- 	cursor: pointer;
//- }

//- .toolbar {
//- 	display: flex;

//- 	@include mq($from: desktop)
//- 	{
//- 		align-items: center;
//- 		@include space-children-h(10px);
//- 	}
//- }

//- .toolbar__item {
//- 	@include mq($until: desktop)
//- 	{
//- 		flex: 1 1 100%;

//- 		padding: 10px;

//- 		&:not(:last-child) {
//- 			border-right: 1px solid var(--color--border);
//- 		}
//- 	}
//- }

//- .intervals-tooltip {
//- 	@include mq($until: desktop)
//- 	{
//- 		display: none;
//- 	}
//- }

</style>
<!--}}}-->
