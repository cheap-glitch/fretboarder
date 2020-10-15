<!--{{{ Pug -->
<template lang="pug">

div.FretboardSequencesItemInterval

	//- Button
	button.button(
		ref="button"
		v-mods="{ isSelected }"

		@click.left="$emit('update-interval', isSelected ? null : value)"

		@mouseenter="isTootlipOpen = true"
		@mouseleave="isTootlipOpen = false"
		)
		p.button__note {{ note }}
		p.button__interval(v-html="shortName")

	//- Tooltip
	VPopup.tooltip(
		v-if="!isMobileDevice"

		:target="$refs.button || false"
		:is-open="isTootlipOpen"
		)
		p.tooltip__text Highlight {{ name }} notes

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                     from 'vuex-pathify'

import { intervalsNames, degrees } from '@/modules/music'

export default {
	name: 'FretboardSequencesItemInterval',

	props: {
		value: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
			required: true,
		},
		isSelected: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isTootlipOpen: false,
		}
	},

	computed: {
		name()      { return intervalsNames[this.value].toLowerCase(); },
		shortName() { return degrees[this.value];                      },

		...get([
			'isMobileDevice',
		]),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardSequencesItemInterval {
	display: flex;

	@include mq($until: desktop) {
		// Simulate a border inside a grid
		box-shadow: 0 0 0 1px var(--color--border);
	}
}

.button {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	flex: 1 1 100%;

	padding: 14px;

	border: none;
	appearance: none;
	background-color: transparent;

	transition: color 200ms, border-color 200ms, background-color 200ms;

	cursor: pointer;

	&.is-selected {
		background-color: var(--color--bg--highlight);
	}

	&:focus {
		border-color: var(--color--hover);
	}

	@include mq($from: desktop) {
		@include pill;
		padding: 2px 8px;

		border: 1px solid var(--color--border);

		&:hover {
			background-color: var(--color--bg--highlight);
		}
	}
}

.button__note {
	color: var(--color--text);
	cursor: pointer;

	.button.is-selected             & { color: var(--color--highlight); }
	.button:not(.is-selected):hover & { color: var(--color--hover);     }
}

.button__interval {
	font-size: 1.35rem;

	color: var(--color--text--secondary);

	cursor: pointer;

	.button.is-selected             & { color: var(--color--text); }
	.button:not(.is-selected):hover & { color: var(--color--text); }
}

.tooltip {
	padding: 8px;

	color: var(--color--bg--tooltip);
	background-color: var(--color--bg--tooltip);
}

.tooltip__text {
	color: var(--color--text--inverted);
}

</style>
<!--}}}-->
