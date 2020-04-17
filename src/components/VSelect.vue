

<!-- VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VSelect(ref="vselectbar")

	//- Select bar
	div.VSelect__bar(
		v-mods="{ isDisabled }"
		v-click-outside="close"
		@click.left="toggleOpen"
		)
		p.VSelect__bar__text(
			v-mods="{ isDisabled }"
			v-html="selected.name"
			)

		fa-icon.VSelect__bar__chevron(
			:icon="['far', 'chevron-down']"
			v-mods="{ isOpened, isDisabled, isFlipped: isChevronFlipped }"
			)

	//- Options
	transition(name="fade")
		div.VSelect__options(
			ref="options"

			v-show="isOpened"
			v-mods="{ isOpeningDirectionUp: openingDirection == 'up' }"
			)
			p.VSelect__options__item(
				v-for="option in optionsList"
				:key="`key--v-select-${id}--${option.value}`"

				v-html="option.name"

				@click.left="select(option)"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }       from 'vuex-pathify'

import { EventBus  } from '@/modules/bus'
import { objectMap } from '@/modules/object'

// Store the timestamp and value of the last alphabetic keypress
let lastKeypressTime  = 0;
let lastKeypressValue = '';

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
		isValueNumber: {
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
			return Array.isArray(this.options) ? this.options : objectMap(this.options, (key, value) => ({ name: value, value: key }));
		},
		selected()
		{
			return this?.optionsList?.find(option => option.value == this.value) ?? { value: 'loading', name: 'Loading…' };
		},
		isChevronFlipped()
		{
			return (this.openingDirection == 'down' &&  this.isOpened)
			    || (this.openingDirection == 'up'   && !this.isOpened)
		},
		...get([
			'instrument',
		]),
	},

	watch: {
		instrument: 'updateOpeningDirection',
	},

	created()
	{
		EventBus.$on('keypress', key => this.jumpToOption(key));
	},

	mounted()
	{
		this.updateOpeningDirection();
	},

	destroyed()
	{
		EventBus.$off('keypress');
	},

	methods: {
		select(option)
		{
			this.$emit('change', this.isValueNumber ? Number.parseInt(option.value, 10) : option.value);
		},
		toggleOpen()
		{
			if (!this.isDisabled)
			{
				if (!this.isOpened)
					this.updateOpeningDirection();

				this.isOpened = !this.isOpened;
			}
		},
		close()
		{
			this.isOpened = false;
		},
		updateOpeningDirection()
		{
			const windowHeight  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			const elemYPosition = this.$refs.vselectbar.getBoundingClientRect().top;

			// If the element is positioned low in the viewport,
			// open the options menu upward instead of downward to avoid vertical overflow
			this.openingDirection = windowHeight - elemYPosition < 380
				? 'up'
				: 'down';
		},
		jumpToOption(key)
		{
			if (!this.isOpened) return;

			// Ignore non-alphabetic keys
			if (!/^[a-zA-z]$/.test(key)) return;

			// If the keypress followed the last one quickly, append to the search string instead of replacing it
			const now = Date.now();
			lastKeypressValue = (now - lastKeypressTime < 500) ? lastKeypressValue + key : key;
			lastKeypressTime  = now;

			// Search for an option whose name starts with the given key and scroll to it
			const index = this.optionsList.findIndex(option => option.name.toLowerCase().startsWith(lastKeypressValue.toLowerCase()));
			if (index !== -1)
			{
				const optionBoxHeight = this.$refs.options.children.item(0).offsetHeight || 35;
				this.$refs.options.scrollTo({ top: index*optionBoxHeight, behavior: 'auto' });
			}
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VSelect {
	position: relative;

	flex: 1 1 auto;
	max-width: 200px;
}

.VSelect__bar,
.VSelect__options {
	border: 1px solid var(--color--select--border);

	background-color: var(--color--select--bg);

	transition: background-color 0.2s;
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

	&:not(.is-disabled):hover {
		background-color: var(--color--select-bar--bg--hover);
	}
}

.VSelect__bar__text,
.VSelect__bar__chevron,
.VSelect__options__item {
	cursor: pointer;
	user-select: none;

	color: var(--color--select--text);

	transition: color 0.2s;

	&.is-disabled {
		color: gray;

		cursor: not-allowed;
	}
}

.VSelect__bar__chevron {
	font-size: 0.8em;

	@include flip;

	&.is-flipped {
		transform: rotate(180deg);
	}
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
		background-color: var(--color--select-item--bg--hover);
	}

	&:not(:last-child) {
		border-bottom: 1px solid var(--color--separator);
	}
}

</style>
<!--}}}-->
