

<!-- FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardViewerFret(
	v-mods="{ isFretboardFlipped, isOnLastString, isFirstFret, isOpenString, isFretOne, ...darkMode }"
	)

	//- Inlay
	div.FretboardViewerFret__inlay(
		v-if="isDisplayingInlay"
		v-mods="darkMode"
		)

	//- Open string note placeholder
	div.FretboardViewerFret__open-string-note-placeholder(
		v-show="fret == 0 && !isActive"
		v-mods="{ isOpenString, isFretboardFlipped, ...darkMode }"
		)

	//- Note
	div.FretboardViewerFret__note(
		v-mods="{ isActive, isHighlightedNote, isOpenString, isFretboardFlipped, ...darkMode }"
		:style="noteColors"

		@mouseover="$store.commit('setHoveredFretInfos', fretInfos)"
		@mouseout=" $store.commit('setHoveredFretInfos', [])"
		)
		transition(name="fade")
			p.FretboardViewerFret__note__info(
				v-show="isDisplayingNotesName"
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
			validator: _v => data.notes.includes(_v)
		},
		scales: {
			type: Array,
			required: true,
		},
		intervals: {
			type: Array,
			required: true,
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
				function(_list, _interval)
				{
					// If the interval is not in the list, initialize its color list
					if (_interval.value in _list === false)
						_list[_interval.value] = [];

					// Add it to the list of colors
					_list[_interval.value].push({ id: _interval.id, color: _interval.color });

					return _list;
				},
				{}
			);

			const fretInfos = objectMap(intervalsList, (_key, _value) => ({
				ids:       _value.map(__v => __v.id).sort((__a, __b) => __a - __b),
				colors:    _value.sort((__a, __b) => __a.id - __b.id).map(__v => __v.color),
				interval:  data.intervalsNames[_key],
			}));

			// Sort the intervals to always have the same scale order
			return fretInfos.sort((_a, _b) => {
				for (let i=0; i<_a.ids.length && i<_b.ids.length; i++)
				{
					if (_a.ids[i] < _b.ids[i]) return -1;
					if (_a.ids[i] > _b.ids[i]) return  1;
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

			'darkMode',
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
			const getColorStops = (_scale, _index) => `${_scale.color} ${_index * fillingSize}% ${(_index + 1)*fillingSize}%`;
			this.noteColors     = { background: `linear-gradient(to right, ${this.scales.map(getColorStops)})`};
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.FretboardViewerFret {
	display: flex;
	justify-content: center;

	position: relative;

	border: 0 solid gray;

	&.dark-mode {
		border-color: $color-ebony-clay;
	}

	&:not(.is-on-last-string) {
		height: 40px;
	}

	&.is-open-string {
		display: block;
	}

	// String
	&:not(.is-open-string) {
		border-top-width: 2px;
		border-top-color: black;

		&.dark-mode {
			border-top-color: $color-oxford-blue;
		}
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

.FretboardViewerFret__note {
	box-sizing: content-box;

	position: absolute;
	transform: translateY(-50%);
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

	&.is-open-string {
		right: 100%;
		transform: translate(50%, -50%);
	}

	&.is-open-string.is-fretboard-flipped {
		left: 100%;
		transform: translate(-50%, -50%);
	}

	// Slightly darken the notes in dark mode
	&.dark-mode {
		filter: brightness(0.9);
	}
}

// Display a dotted border around unactive open string notes
.FretboardViewerFret__open-string-note-placeholder {
	position: absolute;

	@include circle(30px);

	border: 2px dashed lightgray;

	&.is-open-string {
		right: 100%;
		transform: translate(50%, -50%);
	}

	&.is-open-string.is-fretboard-flipped {
		left: 100%;
		transform: translate(-50%, -50%);
	}

	&.dark-mode {
		border-color: $color-oxford-blue;
	}
}

.FretboardViewerFret__note__info {
	@include center-position;

	font-weight: bold;

	color: white;
}

.FretboardViewerFret__inlay {
	@include center-position;
	@include circle(15px);

	background-color: lightgray;

	transition: background-color 0.2s;

	&.dark-mode {
		background-color: $color-mirage-2;
	}
}

</style>
<!--}}}-->
