

<!-- components/FretboardSequencesItem.vue -->


<!--{{{ Pug -->
<template lang="pug">

mixin extra-tools
	//- Focus
	VButton(
		icon="bullseye"
		title="Focus"

		v-show="nbSequences > 1"
		:is-active="isFocused"

		@click="$store.commit('sequences/toggleFocus', index)"
		)
	//- Show intersections only
	VButton(
		:icon="['fas', 'intersection']"
		title="Intersect"

		v-show="nbSequences > 1"
		:is-active="isIntersected"

		@click="update('isIntersected', !isIntersected)"
		)
	//- Duplicate
	VButton(
		icon="copy"
		title="Duplicate"

		:is-disabled="nbSequences == MAX_NB_SEQUENCES"

		@click="$store.commit('sequences/duplicate', index)"
		)

div.FretboardSequencesItem

	div.infos(
		v-if="isMobileDevice"

		:style="{ 'border-color': color, 'background-color': color }"
		v-mods="{ isSettingsPanelOpen }"

		@click.left="isSettingsPanelOpen = !isSettingsPanelOpen"
		)
		p {{ infos }}
		fa-icon(:icon="['far', isSettingsPanelOpen ? 'minus' : 'ellipsis-v']")

	transition(name="fade"): div.settings(
		v-show="isSettingsPanelOpen || !isMobileDevice"
		:style="{ 'border-color': color }"
		)

		//----------------------------------------------------------------------
		//- Properties
		//----------------------------------------------------------------------
		div.properties
			div.dot(
				v-if="!isMobileDevice"
				:style="{ 'background-color': color }"
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
				:options="[{ label: 'Scales', options: scales }, { label: 'Arpeggios', options: arpeggios }]"
				:label-formatter="(value, label) => `${label} ${value.startsWith('arp-') ? 'arp.' : 'scale'}`"

				@change="v => update('model', v)"
				)

		//----------------------------------------------------------------------
		//- Intervals
		//----------------------------------------------------------------------
		div.intervals: button.intervals__item(
			v-for="interval of intervals"
			:key="`sequence--${index}--interval--${interval.value}`"

			v-mods="{ isSelected: highlightedInterval == interval.value }"
			@click.left="update('highlightedInterval', highlightedInterval == interval.value ? null : interval.value)"
			)

			p.interval__item__note {{ interval.note }}
			p.interval__item__name(v-html="interval.name")

		//----------------------------------------------------------------------
		//- Tools
		//----------------------------------------------------------------------
		div.tools
			//- Show/Hide
			VButton(
				:icon="isVisible ? 'eye' : 'eye-slash'"
				is-flipped
				:title="isVisible ? 'Hide' : 'Show'"

				@click="update('isVisible', !isVisible)"
				)
			//- Extra tools
			template(v-if="isMobileDevice || isWideScreen")
				+extra-tools
			template(v-else)
				VButton(
					ref="extraToolsButton"
					icon="ellipsis-h"

					@click="isExtraToolsMenuOpen = !isExtraToolsMenuOpen"
					)
				VPopup.tools__extra(
					:target="($refs.extraToolsButton && $refs.extraToolsButton.$el) || false"
					placement="bottom"
					is-menu

					:is-open="isExtraToolsMenuOpen"
					v-click-outside="clickOutsideHandler"
					)
					+extra-tools
			//- Remove
			VButton(
				icon="times-circle"
				title="Remove"

				@click="$store.commit('sequences/remove', index)"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                                            from 'vuex-pathify'

import { MAX_NB_SEQUENCES }                               from '@/modules/constants'
import { filterObject }                                   from '@/modules/object'
import { notes, notesNames, models, intervalsShortNames } from '@/modules/music'

export default {
	name: 'FretboardSequencesItem',

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
			isSettingsPanelOpen:  false,
			isExtraToolsMenuOpen: false,
		}
	},

	computed: {
		infos()
		{
			return `${notesNames[this.tonality]} ${models[this.model].name} ${this.model.startsWith('arp-') ? 'arpeggio' : 'scale'}`;
		},
		intervals()
		{
			return [0, ...models[this.model].intervals].map(interval => ({
				value: interval,
				note:  notesNames[notes[(notes.indexOf(this.tonality) + interval) % notes.length]],
				name:  intervalsShortNames[interval],
			}))
		},
		...get([
			'isMobileDevice',
			'isWideScreen',
		]),
	},

	created()
	{
		this.tonalities       = notesNames;
		this.scales           = filterObject(models, key => !key.startsWith('arp-'));
		this.arpeggios        = filterObject(models, key =>  key.startsWith('arp-'));
		this.MAX_NB_SEQUENCES = MAX_NB_SEQUENCES;
	},

	methods: {
		clickOutsideHandler(event)
		{
			if (!this.$refs.extraToolsButton.$el.contains(event.target))
				this.isExtraToolsMenuOpen = false;
		},
		update(prop, value)
		{
			// Reset the highlighted interval when the model of the sequence is changed
			if (prop == 'model')
				this.update('highlightedInterval', null);

			this.$store.commit('sequences/update', { index: this.index, prop, value });
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

	&.is-settings-panel-open {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
}

.settings {
	@include mq($until: desktop)
	{
		@include space-children-v(30px);

		padding: 20px 20px 10px 20px;

		border-width: 2px;
		border-style: solid;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;

		border-top: none;
	}

	@include mq($from: desktop)
	{
		display: flex;
		align-items: flex-start;
		@include space-children-h(20px);

		border-radius: 10px;
	}
}

.properties {
	display: flex;
	flex-wrap: wrap;
	@include space-children-h(10px);

	@include mq($until: desktop)
	{
		.VSelect { margin-bottom: 10px; }
	}

	@include mq($from: desktop)
	{
		flex: 0 0 auto;
		align-items: center;
		justify-content: flex-end;
	}
}

.intervals {
	display: grid;

	grid-gap: 10px;
	grid-auto-rows: auto;
	grid-template-columns: repeat(auto-fill, 60px);

	@include mq($until: desktop)
	{
		&.intervals { margin-bottom: 40px; }
	}

	@include mq($from: desktop)
	{
		align-content: center;

		flex: 1 1 100%;
		align-self: stretch;
	}
}

.intervals__item {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	@include pill;
	padding: 2px 8px;

	border: 1px solid var(--color--border);

	cursor: pointer;
	appearance: none;
	background-color: transparent;

	transition: color 200ms, border-color 200ms, background-color 200ms;

	&.is-selected, &:hover {
		background-color: var(--color--bg--highlight);
	}

	&:focus {
		border-color: var(--color--hover);
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

	.intervals__item.is-selected             & { color: var(--color--text); }
	.intervals__item:not(.is-selected):hover & { color: var(--color--text); }
}

.tools {
	display: flex;

	@include mq($until: desktop)
	{
		flex-wrap: wrap;

		.VButton { margin: 0 10px 10px 0; }
	}

	@include mq($from: desktop)
	{
		@include space-children-h(10px);
	}
}

.tools__extra {
	@include center-column;
	@include space-children-v(10px);
}

</style>
<!--}}}-->
