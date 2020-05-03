

<!-- VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VSelect(ref="vselectbar")

	//- Select bar
	div.bar(
		v-mods="{ isOpen, isDisabled }"
		v-click-outside="close"
		@click.left="toggleOpen"
		)
		p.bar__text(
			v-mods="{ isDisabled }"
			v-html="selected.name"
			)

		fa-icon.bar__chevron(
			:icon="['far', 'chevron-down']"
			v-mods="{ isOpen, isDisabled, isFlipped: isChevronFlipped }"
			)

	//- Options
	transition(name="fade")
		div.options(
			ref="options"
			v-show="isOpen"
			v-mods="{ isOpeningAbove: openingDirection == 'above' }"
			)
			div.options__button-close(
				@click.left.stop="isOpen = false"
				)
				fa-icon(:icon="['far', 'arrow-left']")
			p.options__item(
				v-for="option in optionsList"
				:key="`key--v-select-${id}--${option.value}`"

				v-html="option.name"

				@click.left="select(option)"
				)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                     from 'vuex-pathify'
import { disableBodyScroll       } from 'body-scroll-lock'
import { enableBodyScroll        } from 'body-scroll-lock'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'

import { EventBus  }               from '@/modules/bus'
import { objectMap }               from '@/modules/object'

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
			isOpen:           false,
			openingDirection: 'below',
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
			return (this.openingDirection == 'below' &&  this.isOpen)
			    || (this.openingDirection == 'above' && !this.isOpen)
		},
		isMobileDevice: get('isMobileDevice'),
	},

	watch: {
		'$store.fretboard.instrument': 'updateOpeningDirection',
	},

	created()
	{
		EventBus.$on('keypress', key => this.jumpToOption(key));

		// Store the timestamp and value of the last alphabetic keypress
		this.lastKeypressTime  = 0;
		this.lastKeypressValue = '';
	},

	mounted()
	{
		this.updateOpeningDirection();
	},

	destroyed()
	{
		EventBus.$off('keypress');
		clearAllBodyScrollLocks();
	},

	methods: {
		select(option)
		{
			this.$emit('change', this.isValueNumber ? Number.parseInt(option.value, 10) : option.value);
		},
		toggleOpen()
		{
			if (this.isDisabled) return;

			// Desktop: update the opening direction before opening
			if (!this.isMobileDevice && !this.isOpen)
				this.updateOpeningDirection();

			// Mobile: lock the scrolling on the body
			if (this.isMobileDevice)
			{
				if (this.isOpen)
					enableBodyScroll(this.$refs.options);
				else
					disableBodyScroll(this.$refs.options);
			}

			this.isOpen = !this.isOpen;
		},
		close()
		{
			this.isOpen = false;
		},
		updateOpeningDirection()
		{
			const windowHeight  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			const elemYPosition = this.$refs.vselectbar.getBoundingClientRect().top;

			/**
			 * If the element is positioned low in the viewport,
			 * open the options menu upward instead of downward to avoid vertical overflow
			 */
			this.openingDirection = (windowHeight - elemYPosition < 380) ? 'above' : 'below';
		},
		jumpToOption(key)
		{
			if (!this.isOpen) return;

			// Ignore non-alphabetic keys
			if (!/^[a-zA-z]$/.test(key)) return;

			// If the keypress followed the last one quickly, append to the search string instead of replacing it
			const now = Date.now();
			this.lastKeypressValue = (now - this.lastKeypressTime < 500) ? this.lastKeypressValue + key : key;
			this.lastKeypressTime  = now;

			// Search for an option whose name starts with the given key and scroll to it
			const index = this.optionsList.findIndex(option => option.name.toLowerCase().startsWith(this.lastKeypressValue.toLowerCase()));
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

	@include mq($from: desktop)
	{
		max-width: 200px;
	}
}

.bar {
	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 14px;

	cursor: pointer;

	&.is-disabled {
		border-color: gray;

		background-color: lightgray;

		cursor: not-allowed;
	}

	@include mq($until: desktop)
	{
		height: 100%;
	}

	@include mq($from: desktop)
	{
		padding: 8px;

		border: 1px solid var(--color--border);

		background-color: var(--color--bg--accent);

		&:not(.is-disabled) {
			&:hover, &.is-open {
				border-color: var(--color--hover);
				background-color: var(--color--bg--highlight);
			}
		}
	}
}

.bar__text,
.bar__chevron,
.options__item,
.options__button-close {
	cursor: pointer;

	color: var(--color--text);

	&.is-disabled {
		color: gray;

		cursor: not-allowed;
	}
}

.bar__chevron {
	font-size: 0.6em;

	color: var(--color--text--secondary);

	@include mq($from: desktop)
	{
		transition: transform 0.2s;

		&.is-flipped {
			transform: rotate(180deg);
		}
	}
}

.options {
	overflow-y: auto;

	background-color: var(--color--bg--accent);

	/**
	 * On mobile: modal
	 */
	@include mq($until: desktop)
	{
		position: fixed;
		z-index: 1000;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		-webkit-overflow-scrolling: touch;
	}

	/**
	 * On desktop: popup
	 */
	@include mq($from: desktop)
	{
		position: absolute;
		z-index: 1000;
		left: 0;
		right: 0;

		border: 1px solid var(--color--hover);

		max-height: 300px;

		&.is-opening-above {
			bottom: 100%;
			border-bottom: none;
		}

		&:not(.is-opening-above) {
			top: 100%;
			border-top: none;
		}
	}
}

.options__item,
.options__button-close {
	padding: 20px;

	&:not(:last-child) {
		border-bottom: 1px solid var(--color--border);
	}

	&:hover {
		background-color: var(--color--bg--highlight);
	}

	@include mq($from: desktop)
	{
		padding: 8px;
	}
}

.options__button-close {
	@include mq($from: desktop)
	{
		display: none;
	}
}

</style>
<!--}}}-->
