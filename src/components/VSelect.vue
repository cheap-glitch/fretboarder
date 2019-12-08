

<!-- VSelect.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.VSelect(ref="vselectbar")

	//- Select bar
	div.VSelect__bar(
		v-mods="{ isDisabled }"
		v-click-outside="close"
		@click.left="toggleOpen"
		)
		p.VSelect__bar__text(
			v-mods="{ isDisabled }"
			) {{ selected.name }}

		fa-icon.VSelect__bar__chevron(
			:icon="['far', 'chevron-down']"
			v-mods="{ isOpened, isDisabled }"
			)

	//- Options
	transition(name="fade")
		div.VSelect__options(
			v-show="isOpened"
			v-mods="{ isOpeningDirectionUp: openingDirection == 'up' }"
			)
			p.VSelect__options__item(
				v-for="option in optionsList"
				:key="`key--v-select-${id}--${option.value}`"

				@click.left="select(option)"
				) {{ option.name }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapObject } from '@/modules/object.js'

export default {
	name: 'VSelect',

	model: {
		prop:  'value',
		event: 'change',
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		options: {
			type: [Array, Object],
			required: true,
		},
		value: {
			type: [Number, String],
			required: true,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isOpened:          false,
			openingDirection:  'down',
		}
	},

	computed: {
		optionsList()
		{
			// If the options are passed as an object, build an option array from the keys and values
			return Array.isArray(this.options) ? this.options : mapObject(this.options, (_key, _value) => ({ name: _value, value: _key }));
		},
		selected()
		{
			return this?.optionsList?.find(_option => _option.value == this.value) ?? { value: 'loading', name: 'Loading…' };
		},
	},

	watch: {
		isOpened: 'updateOpeningDirection',
	},

	methods: {
		select(_option)
		{
			this.$emit('change', _option.value);
		},
		toggleOpen()
		{
			if (!this.isDisabled) this.isOpened = !this.isOpened;
		},
		close()
		{
			this.isOpened = false;
		},
		updateOpeningDirection()
		{
			if (!this.isOpened) return;

			const windowHeight  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			const elemYPosition = this.$refs.vselectbar.getBoundingClientRect().top;

			// If the element is positioned low in the viewport,
			// open the options menu upward instead of downward to avoid vertical overflow
			this.openingDirection = (windowHeight - elemYPosition < 380) ? 'up' : 'down';
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

@import '@/styles/transitions';

.VSelect {
	position: relative;

	flex: 1 1 auto;
	max-width: 200px;
}

.VSelect__bar,
.VSelect__options {
	border: 1px solid $color-azure;

	background-color: $color-mirage;
}

.VSelect__bar {
	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 8px;

	cursor: pointer;

	&.is-disabled {
		border-color: gray;

		background-color: lightgray;

		cursor: not-allowed;
	}
}

.VSelect__bar__text,
.VSelect__bar__chevron,
.VSelect__options__item {
	color: $color-nepal;

	cursor: pointer;
	user-select: none;

	&.is-disabled {
		color: gray;

		cursor: not-allowed;
	}
}

.VSelect__bar__chevron {
	font-size: 0.8em;

	@include flip;
}

.VSelect__options {
	overflow-y: auto;

	position: absolute;
	z-index: 1000;
	left: 0;
	right: 0;

	max-height: 300px;

	&.is-opening-direction-up {
		bottom: 100%;
		border-bottom: none;
	}

	&:not(.is-opening-direction-up) {
		top: 100%;
		border-top: none;
	}
}

.VSelect__options__item {
	padding: 8px;

	&:hover {
		background-color: $color-oxford-blue;
	}

	&:not(:last-child) {
		border-bottom: 1px solid $color-ebony-clay;
	}
}

</style>
<!--}}}-->
