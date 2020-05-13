

<!-- components/ScalesListItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ScalesListItem(:style="{ 'border-color': color }")

	//- Tooltip for the hovered interval
	div(v-if="!isMobileDevice"): VTooltip(
		v-for="(interval, intervalIndex) in intervals"
		:key="`interval--${interval.value}--tooltip`"

		:target="$refs.intervals ? ($refs.intervals[hoveredIntervalIndex] || false) : false"
		:is-open="hoveredIntervalIndex == intervalIndex"

		placement="bottom"
		:delay="500"
		)
		p Highlight {{ intervals[intervalIndex].name.toLowerCase() }} notes

	//----------------------------------------------------------------------
	//- Scale properties
	//----------------------------------------------------------------------
	div.properties

		div.color-dot(:style="{ 'background-color': color }")

		div.empty-space

		//- Type
		VSelect(
			:value="type"
			:options="{ scale: 'Scale', arpeggio: 'Arpeggio' }"
			@change="updateType"
			)
		//- Tonality
		VSelect(
			:value="tonality"
			:options="tonalities"
			@change="v => updateScale('tonality', v)"
			)
		//- Model
		VSelect(
			:value="model"
			:options="modelsNames"
			@change="updateModel"

			v-mods="{ isArpeggio: type == 'arpeggio' }"
			:style="{ width: '250px' }"
			)
		//- Position
		VSelect(
			:value="position"
			:options="positions"
			is-value-number
			@change="v => updateScale('position', v)"

			:style="type == 'arpeggio' ? { opacity: 0, 'z-index': -1 } : {}"
			)

	//----------------------------------------------------------------------
	//- Intervals
	//----------------------------------------------------------------------

	div.empty-space

	div.intervals: div.intervals__item(
		v-for="(interval, intervalIndex) in intervals"
		:key="`scale--${index}--interval--${interval.value}`"
		ref="intervals"

		v-mods="{ isSelected: highlightedInterval == interval.value }"

		@click.left="updateScale('highlightedInterval', highlightedInterval == interval.value ? null : interval.value)"
		@mouseenter="hoveredIntervalIndex = intervalIndex"
		@mouseleave="hoveredIntervalIndex = null"
		)
		p.interval__item__note {{ interval.note }}
		p.interval__item__name(v-html="interval.shortName")

	div.empty-space

	//----------------------------------------------------------------------
	//- Tools
	//----------------------------------------------------------------------

	div.tools

		//- Show/hide
		VButton(
			:icon="isVisible ? 'eye' : 'eye-slash'"
			is-flipped
			title="Hide"
			tooltip-text="Toggle visibility"
			tooltip-placement="bottom"

			@click="updateScale('isVisible', !isVisible)"
			)
		//- Focus
		VButton.toolbar__item(
			v-show="nbScales > 1"

			icon="bullseye"
			title="Focus"
			tooltip-text="Toggle focus"
			tooltip-placement="bottom"

			:is-active="isFocused"
			@click="$store.commit('scales/toggleFocusScale', index)"
			)
		//- Show intersections only
		VButton.toolbar__item(
			v-show="nbScales > 1"

			:icon="['fas', 'intersection']"
			title="Intersect"
			tooltip-text="Show only intersections with other scales"
			tooltip-placement="bottom"

			:is-active="isIntersected"
			@click="updateScale('isIntersected', !isIntersected)"
			)

		div.separator

		//- Duplicate
		VButton.toolbar__item(
			icon="copy"
			title="Duplicate"
			tooltip-text="Duplicate"
			tooltip-placement="bottom"

			:is-disabled="nbScales == MAX_NB_SCALES"
			@click="$store.commit('scales/duplicateScale', index)"
			)
		//- Remove
		VButton.toolbar__item(
			icon="times-circle"
			title="Delete"
			tooltip-text="Delete"
			tooltip-placement="bottom"

			@click="$store.commit('scales/removeScale', index)"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                                             from 'vuex-pathify'

import { MAX_NB_SCALES }                                   from '@/modules/consts'
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
			hoveredIntervalIndex: null,
		}
	},

	computed: {
		intervals()
		{
			return [0, ...this.models[this.model].model].map(interval => ({
				value:     interval,
				note:      notesNames[notes[(notes.indexOf(this.tonality) + interval) % notes.length]],
				name:      intervalsNames[interval],
				shortName: intervalsShortNames[interval],
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
		isMobileDevice: get('isMobileDevice'),
	},

	created()
	{
		this.MAX_NB_SCALES  = MAX_NB_SCALES;
		this.tonalities     = notesNames;
		this.positions      = {
			0: 'Whole',
			1: '1<sup>st</sup> pos',
			2: '2<sup>nd</sup> pos',
			3: '3<sup>rd</sup> pos',
			4: '4<sup>th</sup> pos',
			5: '5<sup>th</sup> pos',
		}
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
	// Prevent the tooltips from placing
	// themselves in a corner of the page
	position: relative;

	@include mq($until: desktop)
	{
		@include space-children-v(40px);

		padding: 10px;

		border-width: 2px;
		border-style: solid;
		border-radius: 10px;
	}

	@include mq($from: desktop, $until: scale-item-h)
	{
		@include center-column;
		@include space-children-v(10px);
	}

	@include mq($from: scale-item-h)
	{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		@include space-children-h(10px);
	}
}

.properties {
	@include mq($until: desktop)
	{
		@include space-children-v(20px);
	}

	@include mq($from: desktop)
	{
		display: flex;
		align-items: center;
		@include space-children-h(10px);
	}
}

.color-dot {
	display: none;

	@include mq($from: desktop)
	{
		display: block;

		@include circle(10px);
	}
}

.empty-space {
	@include mq($until: desktop)
	{
		display: none;
	}
}

.intervals {
	display: none;

	@include mq($from: desktop)
	{
		display: flex;
	}
}

.intervals__item {
	display: flex;
	justify-content: space-between;

	width: 60px;

	padding: 2px 8px;

	border: 1px solid var(--color--border);

	cursor: pointer;

	&:not(:last-child) {
		border-right: none;
	}

	&:first-child {
		padding-left: 12px;
		border-radius: 1e3px 0 0 1e3px;
	}
	&:last-child {
		border-radius: 0 1e3px 1e3px 0;
	}

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

	.intervals__item.is-selected & { color: var(--color--text); }
}

.tools {
	display: flex;
	align-items: center;

	@include mq($until: desktop)
	{
		margin-top: 20px;
	}

	@include mq($from: desktop)
	{
		@include space-children-h(10px);
	}

	@include mq($from: scale-item-h)
	{
		margin-left: auto;
	}
}

.separator {
	@include circle(4px);
	background-color: var(--color--bg--highlight);

	@include mq($until: desktop)
	{
		display: none;
	}
}

</style>
<!--}}}-->
