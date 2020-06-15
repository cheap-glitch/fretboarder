

<!-- components/FretboardSequencesItemInterval.vue -->


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
	VPopup(
		:target="$refs.button || false"
		:is-open="isTootlipOpen"
		)
		p.tooltip__text Highlight {{ name }} notes

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { intervalsNames, intervalsShorthands } from '@/modules/music'

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
		shortName() { return intervalsShorthands[this.value];          },
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardSequencesItemInterval {
	display: flex;
}

.button {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	flex: 1 1 100%;

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

.button__note {
	color: var(--color--text);
	cursor: pointer;

	.button.is-selected             & { color: var(--color--highlight); }
	.button:not(.is-selected):hover & { color: var(--color--hover);     }
}

.button__interval {
	color: var(--color--text--secondary);
	cursor: pointer;

	font-size: 1.35rem;

	.button.is-selected             & { color: var(--color--text); }
	.button:not(.is-selected):hover & { color: var(--color--text); }
}

.tooltip__text {
	color: white;
}

</style>
<!--}}}-->
