

<!-- FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret

	//- Intervals tooltip
	VTooltip(
		:target="$refs.note || false"
		:is-open="isHovered"
		)
		div.intervals
			div.intervals__item(
				v-for="(interval, index) in intervals"
				:key="`fret-info--${index}`"
				)
				div.intervals__item__color-dot(
					v-for="color in interval.colors"
					:key="`fret-interval--${index}--color--${color}`"
					:style="{ 'background-color': color }"
					)
				p {{ interval.name }}

	div.fret(v-mods="{ isVertical, isFretboardFlipped, isOnLastString, isFirstFret, isOpenString, isFretOne }")

		//- Inlay
		div.fret__inlay(v-if="isDisplayingInlay")

		//- Note
		div.fret__note(
			ref="note"

			v-mods="{ isVertical, isActive, isHighlightedNote, isOpenString, isFretboardFlipped }"
			:style="noteColors"

			@mouseenter="isHovered = true"
			@mouseleave="isHovered = false"
			)
			transition(name="fade")
				p.fret__note__name(v-show="isDisplayingNotesName || isOpenString") {{ noteName }}

		//- Note placeholder
		div.fret__placeholder(
			v-if="isOpenString"
			v-show="!isActive"
			v-mods="{ isOpenString, isFretboardFlipped }"
			)
			p.fret__placeholder__name {{ noteName }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }       from 'vuex-pathify'

import data          from '@/modules/data'

export default {
	name: 'FretboardViewerFret',

	props: {
		index: {
			type: Number,
			required: true,
		},
		string: {
			type: Number,
			required: true,
		},
		fret: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
			required: true,
			validator: v => data.notes.includes(v)
		},
		scales: {
			type: Array,
			required: true,
		},
		intervals: {
			type: Array,
			required: true,
		},
		isVertical: {
			type: Boolean,
			default: false,
		},
		isHighlightedNote: {
			type: Boolean,
			default: false,
		},
		isDisplayingInlay: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			noteColors: {},
			isHovered:  false,
		}
	},

	computed: {
		noteName()
		{
			return data.tonalities[this.note];
		},
		isActive()
		{
			return this.scales.length > 0;
		},
		isOnLastString()
		{
			return this.string == 0;
		},
		isOpenString()
		{
			return this.fret == 0;
		},
		isFretOne()
		{
			return this.fret == 1;
		},
		isFirstFret()
		{
			return this.fretRange[0] == 0 ? (this.fret == 1) : (this.fret == this.fretRange[0]);
		},
		...get([
			'fretRange',

			'isFretboardFlipped',
			'isDisplayingNotesName',
		]),
	},

	watch: {
		scales: 'updateNoteColors',
	},

	mounted() {
		this.updateNoteColors();
	},

	methods: {
		updateNoteColors()
		{
			if (!this.isActive) return;

			// Build a solid gradient with the colors of every active scale the note belongs to
			//- const blurZoneSize  = Math.ceil
			const fillingSize   = Math.ceil(100 / this.scales.length);
			const getColorStops = (scale, index) => `${scale.color} ${index*fillingSize}% ${(index + 1)*fillingSize}%`;
			//- const getColorStops = (scale, index, scales) => `${scale.color} ${index*fillingSize + (index > 0)*3}% ${(index + 1)*fillingSize - (index < scales.length - 1)*3}%`;
			this.noteColors     = { background: `linear-gradient(-45deg, ${this.scales.map(getColorStops)})`};
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.fret {
	display: flex;

	position: relative;
	z-index: 10;

	border: 0 solid var(--color--fret);

	&.is-open-string {
		display: block;
	}

	// Horizontal fretboard
	&:not(.is-vertical) {
		justify-content: center;

		&:not(.is-on-last-string) {
			height: 42px;
		}

		// String
		&:not(.is-open-string) {
			border-top-width: 2px;
			border-top-color: var(--color--string);
		}

		// Fret
		&:not(.is-open-string):not(.is-on-last-string) {
			&.is-fretboard-flipped        { border-left-width:  2px; }
			&:not(.is-fretboard-flipped)  { border-right-width: 2px; }
		}

		// Nut
		&.is-first-fret {
			&.is-fretboard-flipped        { border-right-width: 2px; }
			&:not(.is-fretboard-flipped)  { border-left-width:  2px; }
		}

		&.is-fret-one {
			&.is-fretboard-flipped        { border-right-width: 5px; }
			&:not(.is-fretboard-flipped)  { border-left-width:  5px; }
		}
	}

	// Vertical fretboard
	&.is-vertical {
		height: 100%;
		align-items: center;

		// String
		&:not(.is-open-string) {
			border-left-width: 2px;
			border-left-color: var(--color--string--border);
		}

		// Fret
		&:not(.is-open-string):not(.is-on-last-string) {
			&.is-fretboard-flipped                { border-top-width:    2px; }
			&:not(.is-fretboard-flipped)          { border-bottom-width: 2px; }
		}

		// Nut
		&:not(.is-on-last-string) {
			&.is-first-fret {
				&.is-fretboard-flipped        { border-bottom-width: 2px; }
				&:not(.is-fretboard-flipped)  { border-top-width:    2px; }
			}

			&.is-fret-one {
				&.is-fretboard-flipped        { border-bottom-width: 5px; }
				&:not(.is-fretboard-flipped)  { border-top-width:    5px; }
			}
		}
	}
}

.fret__note {
	box-sizing: content-box;

	position: absolute;

	@include square(30px);

	border: 0 solid gold;

	transition: border-radius 0.2s, border-width 0.08s;

	&:not(.is-active) {
		opacity: 0;
	}

	&.is-active:hover {
		border-width: 4px;
	}

	&:not(.is-highlighted-note) {
		border-radius: 50%;
	}

	// Horizontal fretboard
	&:not(.is-vertical) {
		transform: translateY(-50%);
	}

	// Vertical fretboard
	&.is-vertical {
		transform: translateX(-50%);
	}

	&.is-open-string {
		right: 100%;
		transform: translate(50%, -50%);
	}

	&.is-open-string.is-fretboard-flipped {
		left: 100%;
		transform: translate(-50%, -50%);
	}
}

.fret__placeholder {
	box-sizing: content-box;

	position: absolute;
	right: 50%;
	transform: translate(50%, -50%);

	@include circle(30px);

	border: 2px dashed var(--color--border);

	&.is-fretboard-flipped {
		left: 50%;
		transform: translate(-50%, -50%);
	}

	&:not(.is-open-string) {
		background-color: var(--color--bg);

		opacity: 0;
		transition: opacity 0.2s;

		&:hover {
			opacity: 1;
		}
	}

	&.is-open-string {
		right: 100%;

		&.is-fretboard-flipped {
			left: 100%;
		}
	}
}

.fret__note__name,
.fret__placeholder__name {
	@include center-position;

	font-weight: bold;
}

.fret__note__name {
	color: white;
}

.fret__placeholder__name {
	color: var(--color--text--secondary);
}

.intervals {
	display: flex;
	justify-content: center;
	@include space-children-h(10px);
}

.intervals__item {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	flex: 0 0 auto;
}

.intervals__item__color-dot {
	@include circle(10px);
}

.fret__inlay {
	@include center-position;
	@include circle(15px);

	background-color: var(--color--bg--highlight);
}

</style>
<!--}}}-->
