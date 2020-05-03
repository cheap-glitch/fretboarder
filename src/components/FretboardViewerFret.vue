

<!-- FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret

	//- Intervals tooltip
	VTooltip(
		v-if="isActive"
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

	div.fret(v-mods="{ isFretboardVertical, isFretboardFlipped, isLastString, isOpenString, isFirstFret, isFretOne }")

		//- Inlay
		div.fret__inlay(v-if="isDisplayingInlay")

		//- Note
		div.fret__note(
			ref="note"

			v-mods="{ isFretboardVertical, isFretboardFlipped, isActive, isHighlightedNote, isOpenString }"
			:style="noteColors"

			@mouseenter="isHovered = true"
			@mouseleave="isHovered = false"
			)
			transition(name="fade")
				p.fret__note__name(v-show="isDisplayingNotesName || isOpenString") {{ noteName }}

		//- Note placeholder
		div.fret__placeholder(
			v-show="!isActive"
			v-mods="{ isFretboardVertical, isFretboardFlipped, isOpenString, isLastString }"
			)
			p.fret__placeholder__name {{ noteName }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import data from '@/modules/data'

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
		nbStrings: {
			type: Number,
			required: true,
		},
		fretRange: {
			type: Array,
			required: true,
			validator: v => Array.isArray(v) && v.length == 2 && v.every(n => typeof n == 'number')
		},
		isHighlightedNote: {
			type: Boolean,
			default: false,
		},
		isDisplayingInlay: {
			type: Boolean,
			default: false,
		},
		isFretboardVertical: {
			type: Boolean,
			default: false,
		},
		isFretboardFlipped: {
			type: Boolean,
			default: false,
		},
		isDisplayingNotesName: {
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
		isLastString()
		{
			return (this.isFretboardVertical && !this.isFretboardFlipped) ? this.string == this.nbStrings - 1 : this.string == 0;
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
			const fillingSize   = Math.ceil(100 / this.scales.length);
			const getColorStops = (scale, index) => `${scale.color} ${index*fillingSize}% ${(index + 1)*fillingSize}%`;
			this.noteColors     = { background: `linear-gradient(-45deg, ${this.scales.map(getColorStops)})`};
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.fret {
	position: relative;
	z-index: 10;

	&.is-fretboard-vertical                            { height: 100%; }
	&:not(.is-fretboard-vertical):not(.is-last-string) { height: 42px; }

	$width--nut:    8px;
	$width--fret:   3px;
	$width--string: 2px;

	// String
	&:not(.is-open-string) {
		transition: border-color 0.2s;

		&.is-fretboard-vertical       { border-left: $width--string solid var(--color--string); }
		&:not(.is-fretboard-vertical) { border-top:  $width--string solid var(--color--string); }
	}

	// Nut & first fret
	&.is-fret-one,
	&.is-first-fret {
		&::before {
			content: "";
			position: absolute;

			background-color: var(--color--fret);

			transition: background-color 0.2s;
		}

		&.is-fretboard-vertical{
			&::before {
				left: 0;
				right: 0;
				height: $width--fret;
			}

			&.is-fret-one::before { height: $width--nut; }
		}

		&:not(.is-fretboard-vertical) {
			&::before {
				top: 0;
				bottom: 0;
				width: $width--fret;
			}

			&.is-fret-one::before { width: $width--nut; }

			&.is-fretboard-flipped::before       { right:  0; }
			&:not(.is-fretboard-flipped)::before { left:   0; }
		}
	}

	// Fret
	&:not(.is-last-string):not(.is-open-string) {
		&::after {
			content: "";
			position: absolute;

			background-color: var(--color--fret);

			transition: background-color 0.2s;
		}

		&.is-fretboard-vertical::after {
			left: 0;
			right: 0;
			bottom: 0;
			height: $width--fret;
		}

		&:not(.is-fretboard-vertical) {
			&::after {
				top: 0;
				bottom: 0;
				width: $width--fret;
			}

			&.is-fretboard-flipped::after       { left:    0; }
			&:not(.is-fretboard-flipped)::after { right:   0; }
		}
	}
}

.fret__note,
.fret__placeholder {
	position: absolute;
	z-index: 20;

	&.is-open-string {
		&.is-fretboard-vertical {
			top: 0;
			left: 0;
			transform: translateX(-50%);
		}

		&:not(.is-fretboard-vertical) {
			top: 0;
			transform: translateY(-50%);

			&.is-fretboard-flipped       { right: 0; }
			&:not(.is-fretboard-flipped) { left:  0; }
		}
	}

	&:not(.is-open-string) {
		transform: translate(-50%, -50%);

		&.is-fretboard-vertical       { top: 50%; left:   0; }
		&:not(.is-fretboard-vertical) { top:   0; left: 50%; }
	}
}

.fret__note {
	@include square(30px);

	transition: opacity 0.2s, border-radius 0.2s, filter 0.2s;

	&.is-active:hover {
		filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.3));
	}

	&:not(.is-active) {
		opacity: 0;
	}

	&:not(.is-highlighted-note) {
		border-radius: 50%;
	}
}

.fret__placeholder {
	@include circle(30px);

	border: 2px dashed var(--color--border);

	&:not(.is-open-string) {
		background-color: var(--color--bg);

		opacity: 0;
		transition: opacity 0.2s;
		&:hover { opacity: 1; }
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
