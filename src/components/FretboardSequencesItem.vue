<!--{{{ Pug -->
<template lang="pug">

mixin extra-tools
	//- Focus
	VButton(
		text="Focus"
		icon="bullseye"

		v-show="nbSequences > 1"
		:is-active="isFocused"

		@click="$store.commit('sequences/toggleFocus', index)"
		)
	//- Show intersections only
	VButton(
		text="Intersect"
		:icon="['fas', 'intersection']"

		v-show="nbSequences > 1"
		:is-active="isIntersected"

		@click="update('isIntersected', !isIntersected)"
		)
	//- Duplicate
	VButton(
		text="Duplicate"
		icon="copy"

		:is-disabled="nbSequences == MAX_NB_SEQUENCES"

		@click="$store.commit('sequences/duplicate', index)"
		)

div.FretboardSequencesItem
	//- Infos (mobile)
	div.infos(
		v-if="isMobileDevice"

		:style="{ borderColor: color, backgroundColor: color }"
		v-mods="{ isOpen }"

		@click.left="isOpenedByUser = !isOpenedByUser"
		)
		p {{ infos }}
		fa-icon(
			v-show="nbSequences > 1"
			:icon="['far', isOpen ? 'minus' : 'ellipsis-v']"
			)

	//- Settings & tools
	transition(name="fade"): div.settings(
		v-show="isOpen || !isMobileDevice"
		:style="{ borderColor: color }"
		)

		//----------------------------------------------------------------------
		//- Properties
		//----------------------------------------------------------------------
		div.properties
			div.dot(
				v-if="!isMobileDevice"
				:style="{ backgroundColor: color }"
				)

			//- Tonality
			VSelect(
				:value="tonality"
				:options="tonalities"

				@change="v => update('tonality', v)"
				)
			//- Model
			VSelect(
				:value="model"
				:options="modelOptions"
				:label-formatter="(value, label) => `${label} ${isArpeggio(value) ? 'arp.' : 'scale'}`"

				@change="v => update('model', v)"
				)
			//- Model
			VSelect(
				:value="position"
				:options="positions"
				:is-disabled="!hasPositions"

				@change="v => update('position', parseInt(v, 10))"
				)

		//----------------------------------------------------------------------
		//- Intervals
		//----------------------------------------------------------------------
		div.intervals
			FretboardSequencesItemInterval(
				v-for="interval of intervals"
				:key="`sequence--${index}--interval--${interval.value}`"

				v-bind="interval"
				:is-selected="highlightedInterval == interval.value"

				@update-interval="v => update('highlightedInterval', v)"
				)

		//----------------------------------------------------------------------
		//- Tools
		//----------------------------------------------------------------------
		div.tools
			//- Show/Hide
			VButton(
				:text="isVisible ? 'Hide' : 'Show'"
				:icon="isVisible ? 'eye' : 'eye-slash'"
				is-flipped

				@click="update('isVisible', !isVisible)"
				)

			//- Extra tools
			template(v-if="isMobileDevice || isWideScreen"): +extra-tools
			template(v-else): VPopupMenu(icon="ellipsis-h"): div.tools__extra: +extra-tools

			//- Remove
			VButton(
				text="Remove"
				icon="times-circle"

				@click="$store.commit('sequences/remove', index)"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                        from 'vuex-pathify'

import { MAX_NB_SEQUENCES }           from '@/modules/constants'
import { models, notes, notesNames }  from '@/modules/music'
import { modelOptions }               from '@/modules/models'

import FretboardSequencesItemInterval from '@/components/FretboardSequencesItemInterval'

export default {
	name: 'FretboardSequencesItem',

	components: {
		FretboardSequencesItemInterval,
	},

	props: {
		index: {
			type: Number,
			required: true,
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
		color: {
			type: String,
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
		nbSequences: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			isOpenedByUser: false,
		}
	},

	computed: {
		infos() {
			return `${notesNames[this.tonality]} ${models[this.model].name} ${this.isArpeggio(this.model) ? 'arpeggio' : 'scale'}`;
		},
		intervals() {
			return [0, ...models[this.model].intervals].map(interval => ({
				note:  notesNames[notes[(notes.indexOf(this.tonality) + interval) % notes.length]],
				value: interval,
			}))
		},
		hasPositions() {
			return ('positions' in models[this.model]);
		},
		isOpen() {
			return this.isOpenedByUser || this.nbSequences == 1;
		},

		...get([
			'isMobileDevice',
			'isWideScreen',
		]),
	},

	created() {
		this.tonalities       = notesNames;
		this.modelOptions     = modelOptions;
		this.MAX_NB_SEQUENCES = MAX_NB_SEQUENCES;

		this.positions = {
			0: 'Whole',
			1: '1st pos.',
			2: '2nd pos.',
			3: '3rd pos.',
			4: '4th pos.',
			5: '5th pos.',
		};
	},

	methods: {
		update(prop, value) {
			this.$store.commit('sequences/update', { index: this.index, prop, value });
		},
		isArpeggio(model) {
			return model.startsWith('arp-');
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.dot {
	@include circle(10px);
	flex: 0 0 auto;

	&.dot.dot { margin-right: 20px; }
}

.infos {
	display: flex;
	justify-content: space-between;

	padding: 10px;

	border-width: 2px;
	border-style: solid;
	border-radius: 10px;

	border-bottom: none;

	color: white;

	transition: border-radius 200ms;

	&.is-open {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
}

.settings {
	@include mq($until: desktop) {
		@include space-children-v(30px);

		padding: 20px 20px 10px 20px;

		border-width: 2px;
		border-style: solid;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;

		border-top: none;
	}

	@include mq($from: desktop) {
		display: flex;
		align-items: flex-start;
		@include space-children-h(40px);

		border-radius: 10px;
	}
}

.properties {
	display: flex;
	flex-wrap: wrap;
	@include space-children-h(10px);

	@include mq($until: desktop) {
		.VSelect { margin-bottom: 10px; }
	}

	@include mq($from: desktop) {
		flex: 0 0 auto;
		align-items: center;
		justify-content: flex-end;
	}
}

.intervals {
	display: grid;

	gap: 10px;
	grid-auto-rows: auto;
	grid-template-columns: repeat(auto-fill, 60px);

	@include mq($until: desktop) {
		&.intervals { margin-bottom: 40px; }
	}

	@include mq($from: desktop) {
		align-content: center;

		flex: 1 1 100%;
		align-self: stretch;
	}
}

.tools {
	display: flex;

	@include mq($until: desktop) {
		flex-wrap: wrap;
		.VButton { margin: 0 10px 10px 0; }
	}

	@include mq($from: desktop) {
		@include space-children-h(10px);
	}
}

.tools__extra {
	@include center-column;
	@include space-children-v(10px);
}

</style>
<!--}}}-->
