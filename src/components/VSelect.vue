

<!-- VSelect.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.VSelect(ref="selectbar")

	//- Select bar
	div.bar(
		v-mods="{ isOpen }"
		v-click-outside="close"
		@click.left="toggle"
		)
		div
			p.bar__filler(v-html="longestName")
			p.bar__text(v-html="selected.name")
		fa-icon.bar__chevron(
			:icon="['far', 'chevron-down']"
			v-mods="{ isOpen, isFlipped: isChevronFlipped }"
			)

	//- Options
	transition(name="fade")
		div.options(
			ref="options"
			v-show="isOpen"
			:class="`is-opening-${openingDirection}`"
			)
			div.options__button-close(@click.left.stop="isOpen = false"): fa-icon(:icon="['far', 'arrow-left']")
			p.options__item(
				v-for="option in optionsList"
				:key="`option--${option.name}`"

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

import { layout }                  from '@/modules/layout'
import { EventBus }                from '@/modules/bus'

export default {
	name: 'VSelect',

	model: {
		prop:  'value',
		event: 'change',
	},

	props: {
		options: {
			type: [Array, Object],
			required: true,
		},
		value: {
			type: [Number, String],
			required: true,
		},
		isValueNumber: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isOpen: false,
			openingDirection: 'below',
		}
	},

	computed: {
		selected()
		{
			return this.optionsList.find(option => option.value === this.value) || { name: 'Loading…', value: null };
		},
		longestName()
		{
			let maxLength        = 0;
			let longestNameIndex = 0;

			this.optionsList.forEach(function(option, index)
			{
				if (option.name.length > maxLength)
				{
					maxLength        = option.name.length;
					longestNameIndex = index;
				}
			});

			return this.optionsList[longestNameIndex].name;
		},
		optionsList()
		{
			return Array.isArray(this.options)
				? this.options
				// If the options are passed as an object, build an array of options from the keys and values
				: Object.keys(this.options).map(key => ({ name: this.options[key], value: key }));
		},
		isChevronFlipped()
		{
			return (this.openingDirection == 'below' &&  this.isOpen) || (this.openingDirection == 'above' && !this.isOpen);
		},
		isMobileDevice: get('isMobileDevice'),
	},

	watch: {
		'$store.state.fretboard.instrument': 'updateOpeningDirection',
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
		updateOpeningDirection()
		{
			const windowHeight  = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			const elemYPosition = this.$refs.selectbar.getBoundingClientRect().top;

			/**
			 * If the element is positioned low in the viewport,
			 * open the options menu upward instead of downward to avoid vertical overflow
			 */
			this.openingDirection = ((windowHeight - elemYPosition) < (layout.selectBarHeight.int + layout.selectOptionsHeight.int)) ? 'above' : 'below';
		},
		jumpToOption(key)
		{
			if (!this.isOpen) return;

			// Ignore non-alphabetic keys
			if (!/^[a-zA-z]$/.test(key)) return;

			// If the keypress followed the last one in less than 500 ms, append to the search string instead of replacing it
			const now = Date.now();
			this.lastKeypressValue = (now - this.lastKeypressTime < 500) ? this.lastKeypressValue + key : key;
			this.lastKeypressTime  = now;

			// Search for an option whose name starts with the given key and scroll to it
			const index = this.optionsList.findIndex(option => option.name.toLowerCase().startsWith(this.lastKeypressValue.toLowerCase()));
			if (index !== -1)
			{
				const optionBoxHeight = this.$refs.options.children.item(0).offsetHeight || layout.selectOptionsItemHeight.int;
				this.$refs.options.scrollTo({ top: index*optionBoxHeight, behavior: 'auto' });
			}
		},
		toggle()
		{
			// Desktop: update the opening direction before opening
			if (!this.isMobileDevice && !this.isOpen)
				this.updateOpeningDirection();

			// Mobile: lock the scrolling on the body
			if (this.isMobileDevice)
				(this.isOpen ? enableBodyScroll : disableBodyScroll)(this.$refs.options);

			this.isOpen = !this.isOpen;
		},
		select(option)
		{
			this.$emit('change', this.isValueNumber ? Number.parseInt(option.value, 10) : option.value);
		},
		close()
		{
			this.isOpen = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.VSelect {
	position: relative;
	display: inline-block;
}

.bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	@include space-children-h(10px);

	padding: 8px;

	border: 1px solid var(--color--border);
	background-color: var(--color--bg--accent);

	cursor: pointer;

	&:hover, &.is-open {
		border-color: var(--color--hover);
		background-color: var(--color--bg--highlight);
	}
}

.bar__filler {
	opacity: 0;

	cursor: pointer;
}

.bar__text {
	position: absolute;
	top: 8px;
	left: 8px;
	z-index: 10;

	color: var(--color--text);

	cursor: pointer;
}

.bar__chevron {
	font-size: 0.6em;

	color: var(--color--text--secondary);

	transition: transform 0.2s;

	&.is-flipped {
		transform: rotate(180deg);
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

		max-height: layout.$select-options-height;

		&.is-opening-above {
			bottom: 100%;
			border-bottom: none;
		}

		&.is-opening-below {
			top: 100%;
			border-top: none;
		}
	}
}

.options__item,
.options__button-close {
	padding: 20px;

	color: var(--color--text);

	cursor: pointer;

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
