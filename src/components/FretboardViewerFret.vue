

<!-- components/FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret

	VTooltip(
		:target="$refs.note || false"
		:is-open="showTooltip"
		)
		div.intervals
			div.intervals__item(
				v-for="interval in intervals"
				:key="`interval--${string + 1}--${number}--${interval.value}`"
				)
				div.intervals__item__dot(
					v-for="scale in interval.scales"
					:key="`dot--${scale}`"

					:style="{ 'background-color': scalesColors[scale] }"
					)
				p {{ interval.name }}

	div.fret(v-mods="{ isOpenString, isFirstFret, isOnLastString, isFretboardFlipped, isFretboardVertical }")

		div.fret__inlay(v-show="isShowingInlay")

		p.fret__note(
			ref="note"

			v-mods="{ isActive, isHighlighted, isShowingNoteName, isOpenString, isFretboardFlipped, isFretboardVertical }"
			:style="noteBg"

			@mouseenter="mouseenterHandler"
			@mouseleave="mouseleaveHandler"
			) {{ noteName }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { notesNames, intervalsNames } from '@/modules/music'

export default {
	name: 'FretboardViewerFret',

	props: {
		note: {
			type: String,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
		string: {
			type: Number,
			required: true,
		},
		scales: {
			type: Array,
			required: true,
		},
		scalesColors: {
			type: Array,
			required: true,
		},
		isHighlighted: {
			type: Boolean,
			default: false,
		},
		isOnLastString: {
			type: Boolean,
			default: false,
		},
		isShowingInlay: {
			type: Boolean,
			default: false,
		},
		isShowingNoteName: {
			type: Boolean,
			default: false,
		},
		isFretboardFlipped: {
			type: Boolean,
			default: false,
		},
		isFretboardVertical: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			showTooltip: false,
		}
	},

	computed: {
		intervals()
		{
			// Make a list of intervals, each with the list of scales that contain them
			const intervals = this.scales.reduce(function(list, scale)
			{
				const index = list.findIndex(item => item.value == scale.interval);

				// If the interval is not in the list
				if (index === -1)
				{
					list.push({
						name:   intervalsNames[scale.interval],
						value:  scale.interval,
						scales: [scale.index],
					});
				}
				// If the interval is already in the list
				else
				{
					list[index].scales.push(scale.index);
				}

				return list;
			}, []);

			// Sort the intervals and their scales to keep the same visual order
			intervals.sort((a, b) => a.value - b.value);
			intervals.forEach(interval => interval.scales.sort());

			return intervals;
		},
		noteBg()
		{
			if (!this.isActive) return { 'background-color': 'var(--color--bg--highlight)' };

			// Build a solid gradient with the colors of every scale the fret note belongs to
			const stripeWidth = Math.ceil(100 / this.scales.length);
			const gradient    = this.scales.map((scale, index) => `${this.scalesColors[scale.index]} ${index*stripeWidth}% ${(index + 1)*stripeWidth}%`);

			return { background: `linear-gradient(-45deg, ${gradient})` };
		},
		noteName()
		{
			return notesNames[this.note];
		},
		isActive()
		{
			return this.scales.length > 0;
		},
		isOpenString()
		{
			return this.number == 0;
		},
		isFirstFret()
		{
			return this.number == 1;
		},
	},

	methods: {
		mouseenterHandler()
		{
			if (this.isActive)
				this.showTooltip = true;
		},
		mouseleaveHandler()
		{
			this.showTooltip = false;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.fret {
	position: relative;
	height: 100%;

	border-width: 0;
	border-style: solid;
	border-color: var(--color--border);

	/**
	 * Size
	 */
	&.is-fretboard-vertical {
		&.is-on-last-string       { width: 0; }
		&:not(.is-on-last-string) { width: layout.$fret-width; }
	}

	&:not(.is-fretboard-vertical):not(.is-on-last-string) {
		height: layout.$fret-width;
	}

	/**
	 * Borders
	 */
	&.is-fretboard-vertical {
		&:not(.is-open-string)         { border-bottom-width: layout.$fretbar-thickness; }
		&.is-first-fret                { border-top-width:    layout.$nut-thickness;     }
	}

	&:not(.is-fretboard-vertical) {
		&.is-fretboard-flipped {
			&:not(.is-open-string) { border-left-width:   layout.$fretbar-thickness; }
			&.is-first-fret        { border-right-width:  layout.$nut-thickness;     }
		}

		&:not(.is-fretboard-flipped) {
			&:not(.is-open-string) { border-right-width:  layout.$fretbar-thickness; }
			&.is-first-fret        { border-left-width:   layout.$nut-thickness;     }
		}
	}
}

.fret__note {
	position: absolute;
	z-index: 10;
	@include center-content;

	@include circle(layout.$note-size);

	color: transparent;
	opacity: 0;
	font-weight: bold;

	transition: opacity 0.2s, filter 0.2s;

	/**
	 * Placement
	 */
	&.is-fretboard-vertical {
		left: 0;

		&.is-open-string {
			top: 0;
			transform: translateX(-50%);
		}

		&:not(.is-open-string) {
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	&:not(.is-fretboard-vertical) {
		&.is-open-string {
			top: 0;
			transform: translateY(-50%);

			&.is-fretboard-flipped        { right: 0; }
			&:not(.is-fretboard-flipped)  { left:  0; }
		}

		&:not(.is-open-string) {
			transform: translate(-50%, -50%);

			&.is-fretboard-vertical       { top: 50%; left:   0; }
			&:not(.is-fretboard-vertical) { top:   0; left: 50%; }
		}
	}

	/**
	 * Display
	 */
	&.is-active {
		opacity: 1;

		&:hover {
			filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.4));
		}

		&.is-highlighted       { border-radius: 0; }
		&.is-showing-note-name { color: white;     }
	}

	&:not(.is-active) {
		border: 2px dashed var(--color--border);

		&:hover, &.is-open-string {
			color: var(--color--text);
			opacity: 1;
		}
	}
}

.fret__inlay {
	@include center-position;
	@include circle(15px);

	background-color: var(--color--bg--highlight);
}

.intervals {
	display: flex;
	@include space-children-h(10px);
}

.intervals__item {
	display: flex;
	align-items: center;
	@include space-children-h(5px);
}

.intervals__item__dot {
	@include circle(10px);
}

</style>
<!--}}}-->
