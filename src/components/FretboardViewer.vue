

<!-- FretboardViewer.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardViewer

	//- Infos on the hovered fret
	div.FretboardViewer__infos(
		v-mods="{ isVisible: hoveredFretInfos.length > 0 }"
		)
		div.FretboardViewer__infos__item(
			v-for="(info, index) in hoveredFretInfos"
			:key="`fret-info--${index}`"
			)
			div.FretboardViewer__infos__item__color-dot(
				v-for="color in info.colors"
				:key="`fret-info--${index}-color--${color}`"
				:style="{ 'background-color': color }"
				)
			p.FretboardViewer__infos__item__text {{ info.interval }}

	//- Grid of frets
	div.FretboardViewer__fretboard(:style="[grid, inlays]")
		FretboardViewerFret(
			v-for="fret in frets"
			:key="`fret--${fret.fret}-${fret.string+1}`"

			v-bind="fret"
			:fret-min="fretMin"
			:nb-strings="nbStrings"
			:displayed-info="displayedInfo"
			:is-fretboard-flipped="isFretboardFlipped"
			:is-displaying-inlay="inlays.includes(`${fret.fret}-${fret.string}`)"

			@mouseover="setHoveredFretInfos(fret)"
			@mouseout="hoveredFretInfos = []"
			)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import data                from '@/modules/data'
import { mapObject }       from '@/modules/object'
import {
	generateModelNotes,
	getNotesInterval,
	getStringNotes,
} from '@/modules/music'
import FretboardViewerFret from '@/components/FretboardViewerFret'

export default {
	name: 'FretboardViewer',

	components: {
		FretboardViewerFret,
	},

	props: {
		nbStrings: {
			type: Number,
			default: 6,
		},
		fretRange: {
			type: Array,
			required: true,
		},
		tuning: {
			type: Array,
			default: () => data.tunings.guitar['standard'],
		},
		scales: {
			type: Array,
			default: () => [],
		},
		displayedInfo: {
			type: String,
			default: 'none',
			validator: _v => ['none', 'name', 'degree'].includes(_v)
		},
		isFretboardFlipped: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			hoveredFretInfos: [],
		}
	},

	computed: {
		scalesNotes()
		{
			return this.scales.map(_scale => ({
				id:                  _scale.id,
				color:               _scale.color,
				notes:               generateModelNotes(data[`${_scale.type}s`][_scale.model].model, _scale.tonality),
				isShowingRootNotes:  _scale.isShowingRootNotes,
			}));
		},
		frets()
		{
			let frets = [];

			// Generate a list of the frets of each string
			for (let string=this.nbStrings - 1; string>=0; string--)
			{
				// Get all the notes of the string according to the current tuning
				const stringNotes = getStringNotes(this.tuning[string]);

				for (let j=this.fretMin; j<=this.fretMax; j++)
				{
					// Invert the order of the frets if the fretboard is flipped
					const fret = this.isFretboardFlipped ? this.fretMin + this.fretMax - j : j;
					const note = stringNotes[fret];

					// Get the list of scales the note of the fret belongs to
					const scales = this.scalesNotes.filter(_sc => _sc.notes.includes(note));

					frets.push({
						string, fret, note,

						scales:      scales.map(_scale  => ({ id: _scale.id, color: _scale.color })),
						isRootNote:  scales.some(_scale => _scale.isShowingRootNotes && note == _scale.notes[0]),
						intervals:   scales.map(_sc => ({
							id:     _sc.id,
							value:  getNotesInterval(_sc.notes[0], note),
							color:  _sc.color,
						})),
					});
				}
			}

			return frets;
		},
		grid()
		{
			let openStringFretsSize = '45px';

			/**
			 * Compute the size of each fret so that:
			 *     - f(1) = 3/2
			 *     - f(n) = 1/2 (n = total number of frets)
			 *
			 * Which gives the following function:
			 *     f(x) = (3n - 1)/(2n - 2) - x/(n - 1)
			 */
			let fretSizes = [];
			for (let i=0, n=this.nbFrets; i<this.nbFrets; i++)
			{
				fretSizes.push((i + this.fretMin == 0)
					? openStringFretsSize
					: ((3*n - 1)/(2*n - 2) - i/(n - 1)) + 'fr');
			}

			return { 'grid-template-columns': (this.isFretboardFlipped ? fretSizes.reverse() : fretSizes).join(' ') };
		},
		inlays()
		{
			// List the frets which bear an inlay (only the 12th is omitted)
			let frets = ['3', '5', '7', '9', '15', '17', '19', '21'];

			switch (this.nbStrings)
			{
				/**
				 * Bass, ukulele, guitar
				 * Single inlay in the middle + double inlay at the 12th fret
				 */
				case 4:  return ['12-1', '12-3'].concat(frets.map(_f => `${_f}-2`));
				case 6:  return ['12-2', '12-4'].concat(frets.map(_f => `${_f}-3`));

				/**
				 * Five-string banjo, seven-string guitar, mandolin, nine-, eleven- string guitar
				 * Double inlay (close for odd frets, spreaded for the 12th)
				 */
				case 5:  return ['12-1', '12-4'].concat(frets.map(_f => `${_f}-2`), frets.map(_f => `${_f}-3`));
				case 7:  return ['12-2', '12-5'].concat(frets.map(_f => `${_f}-3`), frets.map(_f => `${_f}-4`));
				case 8:  return ['12-2', '12-6'].concat(frets.map(_f => `${_f}-3`), frets.map(_f => `${_f}-5`));
				case 9:  return ['12-2', '12-7'].concat(frets.map(_f => `${_f}-3`), frets.map(_f => `${_f}-6`));
				case 11: return ['12-3', '12-8'].concat(frets.map(_f => `${_f}-4`), frets.map(_f => `${_f}-7`));

				/**
				 * Ten-string guitar
				 * Double inlay for odd frets, triple for the 12th
				 */
				case 10: return ['12-2', '12-8'].concat(frets.map(_f => `${_f}-4`), frets.map(_f => `${_f}-6`), ['12-5']);

				default: return [];
			}
		},
		fretMin()
		{
			return this.fretRange[0];
		},
		fretMax()
		{
			return this.fretRange[1];
		},
		nbFrets()
		{
			return this.fretMax - this.fretMin + 1;
		},
	},

	methods: {
		setHoveredFretInfos(_fret)
		{
			const intervalsList = _fret.intervals.reduce(
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

			this.hoveredFretInfos = mapObject(
				intervalsList,
				(_key, _value) => ({
					ids:       _value.map(__v => __v.id).sort((__a, __b) => __a - __b),
					colors:    _value.sort((__a, __b) => __a.id - __b.id).map(__v => __v.color),
					interval:  data.intervalsNames[_key],
				})
			)
			.sort(function(_a, _b)
			{
				for (let i=0; i<_a.ids.length && i<_b.ids.length; i++)
				{
					if (_a.ids[i] < _b.ids[i]) return -1;
					if (_a.ids[i] > _b.ids[i]) return  1;
				}

				return 0;
			});
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.FretboardViewer {
	@include center-column;
	@include space-children-v(40px);
}

.FretboardViewer__infos {
	display: flex;
	@include space-children-h(10px);

	height: 40px;

	opacity: 0;

	transition: opacity 0.2s;

	&.is-visible {
		opacity: 1;
	}
}

.FretboardViewer__infos__item {
	display: flex;
	align-items: center;
	@include space-children-h(5px);
}

.FretboardViewer__infos__item__color-dot {
	@include circle(10px);
}

.FretboardViewer__infos__item__text {
	cursor: default;
	user-select: none;
}

.FretboardViewer__fretboard {
	display: grid;

	align-self: stretch;
}

</style>
<!--}}}-->
