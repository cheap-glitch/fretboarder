

<!-- FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret(
	v-mods="{ isVertical, isFretboardFlipped, isOnLastString, isFirstFret, isOpenString, isFretOne }"
	)

	//- Inlay
	div.inlay(
		v-if="isDisplayingInlay"
		)

	//- Open string note placeholder
	div.open-string-note-placeholder(
		v-if="fret == 0"
		v-show="!isActive"
		v-mods="{ isOpenString, isFretboardFlipped }"
		)
		p.note__name(
			v-mods="{ isActive, isOpenString }"
			) {{ noteName }}

	//- Note
	div.note(
		v-mods="{ isVertical, isActive, isHighlightedNote, isOpenString, isFretboardFlipped, isDarkModeOn }"
		:style="noteColors"

		@mouseover="$store.commit('setHoveredFretInfos', fretInfos)"
		@mouseout=" $store.commit('setHoveredFretInfos', [])"
		)
		transition(name="fade")
			p.note__name(
				v-show="isDisplayingNotesName || isOpenString"
				) {{ noteName }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }       from 'vuex-pathify'

import data          from '@/modules/data'
import { objectMap } from '@/modules/object'

export default {
	name: 'FretboardViewerFret',

	props: {
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
		}
	},

	computed: {
		fretInfos()
		{
			const intervalsList = this.intervals.reduce(
				function(list, interval)
				{
					// If the interval is not in the list, initialize its color list
					if (!(interval.value in list))
						list[interval.value] = [];

					// Add it to the list of colors
					list[interval.value].push({ id: interval.id, color: interval.color });

					return list;
				},
				{}
			);

			const fretInfos = objectMap(intervalsList, (key, value) => ({
				ids:       value.map(v => v.id).sort((a, b) => a - b),
				colors:    value.sort((a, b) => a.id - b.id).map(v => v.color),
				interval:  data.intervalsNames[key],
			}));

			// Sort the intervals to always have the same scale order
			return fretInfos.sort((a, b) => {
				for (let i=0; i<a.ids.length && i<b.ids.length; i++)
				{
					if (a.ids[i] < b.ids[i]) return -1;
					if (a.ids[i] > b.ids[i]) return  1;
				}

				return 0;
			});
		},
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
			'isDarkModeOn',
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

	&.is-open-string {
		display: block;
	}

	// Horizontal fretboard
	&:not(.is-vertical) {
		justify-content: center;

		&:not(.is-on-last-string) {
			height: 40px;
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
	z-index: 10;

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

	// Slightly darken the notes in dark mode
	&.is-dark-mode-on {
		filter: brightness(0.8);
	}
}

// Display a dotted border around unactive open string notes
.open-string-note-placeholder {
	position: absolute;

	@include circle(30px);

	border: 2px dashed var(--color--border);

	&.is-open-string {
		right: 100%;
		transform: translate(50%, -50%);
	}

	&.is-open-string.is-fretboard-flipped {
		left: 100%;
		transform: translate(-50%, -50%);
	}
}

.note__name {
	@include center-position;

	font-weight: bold;

	color: white;

	&.is-open-string:not(.is-active) {
		color: var(--color--text-2);
	}
}

.inlay {
	@include center-position;
	@include circle(15px);

	background-color: var(--color--inlay--bg);

	transition: background-color 0.2s;
}

</style>
<!--}}}-->
