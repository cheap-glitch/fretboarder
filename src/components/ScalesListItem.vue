

<!-- components/ScalesListItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.ScalesListItem

	div.wrapper(:style="{ 'border-color': color }")

		div.color-dot(:style="{ 'background-color': color }")

		//----------------------------------------------------------------------
		//- Scale properties
		//----------------------------------------------------------------------
		div.scale-props

			//- Type
			VSelect.select-type(
				id="scale-type"
				:value="type"
				:options="{ scale: 'Scale', arpeggio: 'Arpeggio' }"
				@change="updateType"
				)
			//- Tonality
			VSelect.select-tonality(
				id="scale-tonality"
				:value="tonality"
				:options="tonalities"
				@change="v => update('tonality', v)"
				)
			//- Model
			VSelect.select-model(
				id="scale-model"
				:value="model"
				:options="modelsNames"
				@change="updateModel"
				)
			//- Position
			VSelect.select-position(
				v-show="type == 'scale'"
				id="scale-position"
				:value="position"
				:options="positions"
				is-value-number
				@change="v => update('position', v)"
				)

		//----------------------------------------------------------------------
		//- Tools
		//----------------------------------------------------------------------
		div.scale-tools(v-if="!isMobileDevice")

			//- Intervals
			div.intervals
				div.intervals__item(
					v-for="(interval, index) in intervals"
					:key="`scale-${id}-interval--${index}`"
					ref="interval"

					v-mods="{ isSelected: highlightedNote == interval.value }"

					@click.left="update('highlightedNote', highlightedNote == interval.value ? null : interval.value)"
					@mouseenter="hoveredInterval = index"
					@mouseleave="hoveredInterval = null"
					)
					p.intervals__item__text {{ interval.name }}

			div.scale-tools__separator

			//- Show/hide
			VButtonIcon(
				:icon="isVisible ? 'eye' : 'eye-slash'"
				size="small"
				:tooltip="isVisible ? 'Hide' : 'Show'"
				tooltip-placement="bottom"

				@click="update('isVisible', !isVisible)"
				)
			//- Focus
			VButtonIcon(
				v-show="nbScales > 1"

				icon="bullseye"
				size="small"
				:tooltip="isFocused ? 'Unfocus' : 'Focus'"
				tooltip-placement="bottom"

				:is-active="isFocused"
				@click="toggleFocusScale(id)"
				)
			//- Show intersections only
			VButtonIcon(
				v-show="nbScales > 1"

				:icon="['fas', 'intersection']"
				size="small"
				tooltip="Show only intersections with other scales"
				tooltip-placement="bottom"

				:is-active="isShowingIntersections"
				@click="update('isShowingIntersections', !isShowingIntersections)"
				)

			div.scale-tools__separator

			//- Duplicate
			VButtonIcon(
				icon="copy"
				size="small"
				tooltip="Duplicate"
				tooltip-placement="bottom"

				:is-disabled="nbScales == MAX_NB_SCALES"
				@click="addScale(id)"
				)
			//- Remove
			VButtonIcon(
				icon="times-circle"
				size="small"
				tooltip="Remove"
				tooltip-placement="bottom"

				@click="removeScale(id)"
				)

	//- Interval tooltips
	template(v-if="!isMobileDevice")
		VTooltip(
			v-for="(interval, index) in intervals"
			:key="`scale-${id}-interval--${index}--tooltip`"

			:is-open="hoveredInterval === index"

			:target="$refs.interval ? $refs.interval[index] : false"
			placement="bottom"
			:delay="500"
			)
			p Highlight {{ intervalsNames[interval.value].toLowerCase() }} notes

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapMutations }  from 'vuex'
import { get }           from 'vuex-pathify'

import data              from '@/modules/data'
import { objectMap }     from '@/modules/object'
import { MAX_NB_SCALES } from '@/stores/scales'

export default {
	name: 'ScalesListItem',

	props: {
		id: {
			type: Number,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
			validator: v => ['arpeggio', 'scale'].includes(v)
		},
		tonality: {
			type: String,
			required: true,
		},
		model: {
			type: String,
			required: true,
		},
		position: {
			type: Number,
			required: true,
		},
		highlightedNote: {
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
		isShowingIntersections: {
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
		nbScales()
		{
			return this.scales.length;
		},
		models()
		{
			return (this.type == 'scale') ? data.scales : data.arpeggios;
		},
		modelsNames()
		{
			return objectMap(this.models, (key, model) => ({ name: model.name, value: key }));
		},
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
		...get([
			'scales/scales',
			'isMobileDevice',
		]),
	},

	created()
	{
		this.MAX_NB_SCALES  = MAX_NB_SCALES;
		this.tonalities     = data.tonalities,
		this.intervalsNames = data.intervalsNames,
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
		updateType(v)
		{
			// Reset the model and the highlighted note when the type of scale is changed
			this.update('model',           'maj');
			this.update('highlightedNote',  null);

			this.update('type', v);
		},
		updateModel(v)
		{
			// Reset the highlighted note when the mode of the scale is changed
			this.update('highlightedNote',  null);

			this.update('model', v);
		},
		update(prop, value)
		{
			this.updateScale({ id: this.id, prop: prop, value: value });
		},
		...mapMutations('scales', [
			'addScale',
			'updateScale',
			'toggleFocusScale',
			'removeScale',
		]),
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.wrapper {
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
		justify-content: space-between;
	}
}

.color-dot {
	@include circle(10px);
	flex: 0 0 auto;

	margin-right: 10px;

	@include mq($until: desktop)
	{
		display: none;
	}
}

.scale-props {
	flex: 1 1 100%;

	@include mq($until: desktop)
	{
		display: grid;
		grid-template-columns: repeat(5, [col] 1fr);
	}

	@include mq($from: desktop)
	{
		display: flex;
		align-items: center;
		@include space-children-h(10px);

		margin-right: 30px;
	}
}

.scale-tools {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.scale-tools__separator {
	@include circle(4px);
	flex: 0 0 auto;

	background-color: var(--color--border);
}

.scale-props {
	@include mq($until: desktop)
	{
		.select-type     { grid-column: col 1 / span 4; }
		.select-tonality { grid-column: col 5 / span 1; }
		.select-model    { grid-column: col 1 / span 3; }
		.select-position { grid-column: col 4 / span 2; }

		.select-type, .select-tonality {
			border-bottom: 1px solid var(--color--border);
		}

		.select-type, .select-model {
			border-right: 1px solid var(--color--border);
		}
	}

	@include mq($from: desktop)
	{
		.select-type     { max-width: 120px; min-width: 120px; }
		.select-tonality { max-width: 60px;  min-width: 60px;  }
		.select-model    { max-width: 220px; min-width: 220px; }
		.select-position { max-width: 100px; min-width: 100px; }
	}
}

.intervals {
	display: flex;
}

.intervals__item {
	padding: 2px 8px;

	border: 1px solid var(--color--border);

	color: var(--color--text);

	cursor: pointer;

	transition: color 0.2s, background-color 0.2s;

	&:not(:last-child) {
		border-right: none;
	}

	&:first-child {
		padding-left: 10px;

		border-radius: 1e3px 0 0 1e3px;
	}

	&:last-child {
		padding-right: 10px;

		border-radius: 0 1e3px 1e3px 0;
	}

	&:hover {
		color: var(--color--hover);
		background-color: var(--color--bg--highlight);
	}

	&.is-selected {
		color: var(--color--highlight);
		background-color: var(--color--bg--highlight);
	}
}

.intervals__item__text {
	cursor: pointer;
}

</style>
<!--}}}-->
