

<!-- components/ScalesListItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ScalesListItem(:style="{ 'border-color': color }")

	div.color-dot(:style="{ 'background-color': color }")

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
	div.tools

		//- Intervals
		div.intervals: div.intervals__item(
			v-for="(interval, intervalIndex) in intervals"
			:key="`scale--${index}--interval--${interval.value}`"
			ref="interval"

			v-mods="{ isSelected: highlightedInterval == interval.value }"

			@click.left="updateScale('highlightedInterval', highlightedInterval == interval.value ? null : interval.value)"
			@mouseenter="hoveredInterval = intervalIndex"
			@mouseleave="hoveredInterval = null"
			)
			p.interval__item__note {{ interval.note }}
			p.interval__item__name(v-html="interval.name")

		//- div.tools__separator

			//- Show/hide
			VButton.toolbar__item(
				:icon="isVisible ? 'eye' : 'eye-slash'"
				:tooltip="isVisible ? 'Hide' : 'Show'"
				tooltip-placement="bottom"

				@click="updateScale('isVisible', !isVisible)"
				)
			//- Focus
			VButton.toolbar__item(
				v-show="nbScales > 1"

				icon="bullseye"
				:tooltip="isFocused ? 'Unfocus' : 'Focus'"
				tooltip-placement="bottom"

				:is-active="isFocused"
				@click="$store.commit('scales/toggleFocusScale', id)"
				)
			//- Show intersections only
			VButton.toolbar__item(
				v-show="nbScales > 1"

				:icon="['fas', 'intersection']"
				tooltip="Show only intersections with other scales"
				tooltip-placement="bottom"

				:is-active="isIntersected"
				@click="updateScale('isIntersected', !isIntersected)"
				)

			div.tools__separator

			//- Duplicate
			VButton.toolbar__item(
				icon="copy"
				tooltip="Duplicate"
				tooltip-placement="bottom"

				:is-disabled="nbScales == MAX_NB_SCALES"
				@click="$store.commit('scales/addScale', id)"
				)
			//- Remove
			VButton.toolbar__item(
				icon="times-circle"
				tooltip="Remove"
				tooltip-placement="bottom"

				@click="$store.commit('scales/removeScale', id)"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { MAX_NB_SCALES }                                   from '@/stores/scales'
import { notes, scales, arpeggios }                        from '@/modules/music'
import { notesNames, intervalsNames, intervalsShortNames } from '@/modules/music'

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
		intervals()
		{
			return [0, ...this.models[this.model].model].map(interval => ({
				note:  notesNames[notes[(notes.indexOf(this.tonality) + interval) % notes.length]],
				name:  intervalsShortNames[interval],
				value: interval,
			}))
		},
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

.intervals {
	display: flex;
}

.intervals__item {
	display: flex;
	@include space-children-h(10px);

	padding: 2px 8px;

	border: 1px solid var(--color--border);

	cursor: pointer;

	&:not(:last-child) {
		border-right: none;
	}

	&:first-child { padding-left:  12px; border-radius: 1e3px 0 0 1e3px; }
	&:last-child  { padding-right: 12px; border-radius: 0 1e3px 1e3px 0; }

	&.is-selected, &:hover {
		background-color: var(--color--bg--highlight);
	}
}

.interval__item__note {
	color: var(--color--text);
	cursor: pointer;

	.intervals__item.is-selected             & { color: var(--color--highlight); }
	.intervals__item:not(.is-selected):hover & { color: var(--color--hover);     }
}

.interval__item__name {
	color: var(--color--text--secondary);
	cursor: pointer;

	font-size: 1.2rem;
}

.color-dot {
	@include mq($from: desktop)
	{
		@include circle(10px);
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
