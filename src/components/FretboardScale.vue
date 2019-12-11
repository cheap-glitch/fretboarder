

<!-- FretboardScale.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardScale

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
			@change="_v => update('tonality', _v)"
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
			@change="_v => update('position', _v)"
			)

	//----------------------------------------------------------------------
	//- Tools
	//----------------------------------------------------------------------
	div.scale-tools

		//- Intervals
		div.intervals
			div.intervals__item(
				v-for="(interval, index) in intervals"
				:key="`scale-${id}-interval--${index}`"

				v-mods="{ isSelected: highlightedNote == interval.value }"
				:title="`Highlight ${intervalsNames[interval.value].toLowerCase()} notes`"

				@click.left="update('highlightedNote', highlightedNote == interval.value ? null : interval.value)"
				)
				p.intervals__item__text {{ interval.name }}

		div.scale-tools__separator(v-mods="darkMode")

		//- Show/hide
		VButtonIcon(
			:icon="isVisible ? 'eye' : 'eye-slash'"
			size="small"
			:tooltip="isVisible ? 'Hide' : 'Show'"
			@click="update('isVisible', !isVisible)"
			)
		//- Focus
		VButtonIcon(
			v-show="nbScales > 1"
			icon="bullseye"
			size="small"
			tooltip="Focus"
			:is-active="isFocused"
			@click="toggleFocusScale(id)"
			)
		//- Show intersections only
		VButtonIcon(
			v-show="nbScales > 1"
			:icon="['fas', 'intersection']"
			size="small"
			tooltip="Show only intersections with other scales"
			:is-active="isShowingIntersections"
			@click="update('isShowingIntersections', !isShowingIntersections)"
			)

		div.scale-tools__separator(v-mods="darkMode")

		//- Duplicate
		VButtonIcon(
			icon="copy"
			size="small"
			tooltip="Duplicate"
			@click="duplicateScale(id)"

			:is-disabled="nbScales == 5"
			)
		//- Remove
		VButtonIcon(
			icon="trash-alt"
			size="small"
			tooltip="Remove"
			@click="removeScale(id)"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import {
	mapState,
	mapGetters,
	mapMutations
} from 'vuex'

import data                     from '@/modules/data'
import { mapObject }            from '@/modules/object'

export default {
	name: 'FretboardScale',

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
			validator: _v => ['arpeggio', 'scale'].includes(_v)
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

	static() {
		return {
			tonalities:      data.tonalities,
			intervalsNames:  data.intervalsNames,

			positions: {
				0: 'Whole',
				1: '1<sup>st</sup> pos',
				2: '2<sup>nd</sup> pos',
				3: '3<sup>rd</sup> pos',
				4: '4<sup>th</sup> pos',
				5: '5<sup>th</sup> pos',
			}
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
			return mapObject(this.models, (_key, _model) => ({ name: _model.name, value: _key }));
		},
		intervals()
		{
			let rootInterval = 0;

			return [
				{ value: 0, name: 'R' },
				...this.models[this.model].model.slice(0, -1).map(function(_interval)
				{
					rootInterval += _interval;

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
		...mapState('scales', [
			'scales',
		]),
		...mapGetters([
			'darkMode',
		]),
		...mapMutations('scales', [
			'updateScaleProp',
			'toggleFocusScale',
			'duplicateScale',
			'removeScale',
		])
	},

	methods: {
		updateType(_v)
		{
			// Reset the model and the highlighted note when the type of scale is changed
			this.update('model',           'maj');
			this.update('highlightedNote',  null);

			this.update('type', _v);
		},
		updateModel(_v)
		{
			// Reset the highlighted note when the mode of the scale is changed
			this.update('highlightedNote',  null);

			this.update('model', _v);
		},
		update(_prop, _value)
		{
			this.updateScaleProp({ id: this.id, prop: _prop, value: _value });
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.FretboardScale {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.color-dot {
	@include circle(10px);
	flex: 0 0 auto;

	margin-right: 10px;
}

.scale-props,
.scale-tools {
	display: flex;
	align-items: center;
	@include space-children-h(10px);
}

.scale-props {
	flex: 1 1 100%;

	margin-right: 30px;
}

.scale-tools__separator {
	@include circle(4px);
	flex: 0 0 auto;

	background-color: lightgray;

	&.dark-mode {
		background-color: $color-ebony-clay;
	}
}

.select-type     { max-width: 120px; min-width: 120px; }
.select-tonality { max-width: 60px;  min-width: 60px;  }
.select-model    { max-width: 220px; min-width: 220px; }
.select-position { max-width: 100px; min-width: 100px; }

.intervals {
	display: flex;
}

.intervals__item {
	padding: 2px 8px;

	border: 1px solid lightgray;

	cursor: pointer;

	transition: background-color 0.2s;

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
		background-color: #f0f0f0;
	}

	&.is-selected {
		color: white;
		background-color: $color-sun;
	}
}

.intervals__item__text {
	font-family: $fonts-text;

	cursor: pointer;
}

</style>
<!--}}}-->
