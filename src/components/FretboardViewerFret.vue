

<!-- components/FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret

	//- Tooltip to show the intervals of the hovered fret
	VPopup.tooltip(
		:target="$refs.note || false"
		:boundary="isMobileDevice ? 'app' : 'fretboard-wrapper'"
		:is-open="showTooltip"
		)
		div.intervals
			div.intervals__item(
				v-for="interval of intervals"
				:key="`interval--${string + 1}--${number}--${interval.value}`"
				)
				div.intervals__item__dot(
					v-for="seq of interval.sequences"
					:key="`dot--${seq}`"

					:style="{ backgroundColor: colors[seq] }"
					)
				p.intervals__item__text {{ interval.name }}

	div.fret(v-mods="{ isOpenString, isStartingFret, isFirstFret, isOnLastString, isFretboardFlipped, isFretboardVertical }")

		div.fret__inlay(v-show="isShowingInlay")

		p.fret__note(
			ref="note"

			v-mods="{ isActive, isHighlighted, isShowingNoteInfos, isOpenString, isFretboardFlipped, isFretboardVertical }"
			:style="noteBg"

			@mouseenter="showTooltip = isActive"
			@mouseleave="showTooltip = false"

			v-html="infos"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                                 from 'vuex-pathify'

import { notesNames }                          from '@/modules/music'
import { intervalsNames, intervalsShorthands } from '@/modules/music'

export default {
	name: 'FretboardViewerFret',

	props: {
		string: {
			type: Number,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
			required: true,
		},
		sequences: {
			type: Array,
			required: true,
		},
		displayedInfos: {
			type: String,
			required: true,
			validator: v => ['none', 'name', 'interval'].includes(v)
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
		isFretboardFlipped: {
			type: Boolean,
			default: false,
		},
		isFretboardVertical: {
			type: Boolean,
			default: false,
		},
		fretMin: {
			type: Number,
			required: true,
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
			// Make a list of intervals, each with the list of sequences that contain them
			const intervals = this.sequences.reduce(function(list, seq)
			{
				const index = list.findIndex(item => item.value == seq.interval);

				// If the interval is not in the list
				if (index === -1)
				{
					list.push({
						name:      intervalsNames[seq.interval],
						value:     seq.interval,
						sequences: [seq.index],
					});
				}
				// If the interval is already in the list
				else
				{
					list[index].sequences.push(seq.index);
				}

				return list;
			}, []);

			// Sort the intervals and their sequences to keep the same visual order
			intervals.sort((a, b) => a.value - b.value);
			intervals.forEach(interval => interval.sequences.sort());

			return intervals;
		},
		noteBg()
		{
			if (!this.isActive) return { 'background-color': 'var(--color--bg--highlight)' };

			// Build a solid gradient with the colors of every sequence the fret note belongs to
			const stripeWidth = Math.ceil(100 / this.sequences.length);
			const gradient    = [...this.sequences].reverse().map((seq, index) => `${this.colors[seq.index]} ${index*stripeWidth}% ${(index + 1)*stripeWidth}%`);

			return { background: `linear-gradient(-45deg, ${gradient})` };
		},
		colors()
		{
			return this.$store.state.sequences.sequences.map(seq => seq.color);
		},
		infos()
		{
			return (this.displayedInfos == 'interval' && this.isActive)
				? intervalsShorthands[this.sequences[0].interval]
				: notesNames[this.note];
		},
		isActive()
		{
			return this.sequences.length > 0;
		},
		isOpenString()
		{
			return this.number == 0;
		},
		isStartingFret()
		{
			return this.number == this.fretMin && this.number > 0;
		},
		isFirstFret()
		{
			return this.number == 1;
		},
		isShowingNoteInfos()
		{
			return this.displayedInfos != 'none';
		},

		...get(['isMobileDevice']),
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
			&.is-starting-fret     { border-right-width:  layout.$fretbar-thickness; }
			&.is-first-fret        { border-right-width:  layout.$nut-thickness;     }
		}

		&:not(.is-fretboard-flipped) {
			&:not(.is-open-string) { border-right-width:  layout.$fretbar-thickness; }
			&.is-starting-fret     { border-left-width:   layout.$fretbar-thickness; }
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

	transition: opacity 200ms, filter 200ms, border-radius 200ms;

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

		&.is-highlighted        { border-radius: 0; }
		&.is-showing-note-infos { color: white;     }
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

/**
 * Intervals tooltip
 */
.tooltip {
	padding: 8px;

	color: var(--color--bg--tooltip);
	background-color: var(--color--bg--tooltip);
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
	flex: 0 0 auto;
}

.intervals__item__text {
	color: white;
}

</style>
<!--}}}-->
