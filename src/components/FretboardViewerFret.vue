

<!-- FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret(
	v-mods="{ isVertical, isFretboardFlipped, isOnLastString, isFirstFret, isOpenString, isFretOne }"
	)

	//- Inlay
	div.inlay(v-if="isDisplayingInlay")

	//- Note
	div.note(
		v-mods="{ isVertical, isActive, isHighlightedNote, isOpenString, isFretboardFlipped }"
		:style="noteColors"

		@mouseenter="$emit('hover-fret', index)"
		@mouseleave="$emit('hover-fret', null)"
		)
		transition(name="fade")
			p.note__name(v-show="isDisplayingNotesName || isOpenString") {{ noteName }}

	//- Note placeholder
	div.note-placeholder(
		v-if="!isMobileDevice || isOpenString"
		v-show="!isActive"
		v-mods="{ isOpenString, isFretboardFlipped }"

		@mouseenter="$emit('hover-fret', index)"
		@mouseleave="$emit('hover-fret', null)"
		)
		p.note-placeholder__name {{ noteName }}

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

			'isMobileDevice',
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
			const fillingSize   = Math.ceil(100 / this.scales.length);
			const getColorStops = (scale, index) => `${scale.color} ${index * fillingSize}% ${(index + 1)*fillingSize}%`;
			this.noteColors     = { background: `linear-gradient(to right, ${this.scales.map(getColorStops)})`};
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewerFret {
	display: flex;

	position: relative;

	border: 0 solid var(--color--fret--border);

	transition: border-color 0.2s;

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
			border-top-color: var(--color--string--border);
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

.note {
	box-sizing: content-box;

	position: absolute;

	@include square(30px);

	border: 0 solid gold;

	transition: opacity 0.2s, border-radius 0.2s, border-width 0.08s;

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

.note-placeholder {
	position: absolute;
	right: 50%;
	transform: translate(50%, -50%);

	@include circle(30px);

	border: 2px solid var(--color--border);

	transition: opacity 0.2s, border-color 0.2s;

	&.is-fretboard-flipped {
		left: 50%;
		transform: translate(-50%, -50%);
	}

	&:not(.is-open-string) {
		background-color: var(--color--bg);

		opacity: 0;

		&:hover {
			opacity: 1;
		}
	}

	&.is-open-string {
		border-style: dashed;

		right: 100%;

		&.is-fretboard-flipped {
			left: 100%;
		}
	}
}

.note__name,
.note-placeholder__name {
	@include center-position;

	font-weight: bold;
}

.note__name {
	color: white;
}

.note-placeholder__name {
	color: var(--color--text--secondary);
}

.inlay {
	@include center-position;
	@include circle(15px);

	background-color: var(--color--inlay--bg);

	transition: background-color 0.2s;
}

</style>
<!--}}}-->
