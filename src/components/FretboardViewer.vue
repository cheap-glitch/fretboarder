

<!-- FretboardViewer.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewer

	//- Infos about the hovered fret
	//- div.fret-infos(
		v-mods="{ isVisible: hoveredFretInfos.length > 0 }"
		)
		div.fret-infos__item(
			v-for="(info, index) in hoveredFretInfos"
			:key="`fret-info--${index}`"
			)
			div.fret-infos__item__color-dot(
				v-for="color in info.colors"
				:key="`fret-info--${index}-color--${color}`"
				:style="{ 'background-color': color }"
				)
			p {{ info.interval }}

	div.fretboard(:style="[minWidth, grid, inlays]")

		//- Frets
		FretboardViewerFret(
			v-for="fret in frets"
			:key="`fret--${fret.fret}-${fret.string+1}`"

			v-bind="fret"
			:is-vertical="isVertical"
			)

		//- Fret numbers
		template(v-if="!isVertical")
			div.fret-number(
				v-for="fret in fretNumbers"
				:key="`fret-number--${fret}`"
				)
				p.fret-number__text {{ fret }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }             from 'vuex-pathify'

import data                from '@/modules/data'
import * as music          from '@/modules/music'
import FretboardViewerFret from '@/components/FretboardViewerFret'

export default {
	name: 'FretboardViewer',

	components: {
		FretboardViewerFret,
	},

	props: {
		isVertical: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			fretMinWidth:        25,
			fretMinHeight:       40,
			openStringFretsSize: 30,
		}
	},

	computed: {
		minWidth()
		{
			/**
			 * The width of the fretboard must be so that the width
			 * of the smallest fret is equal or greater than a set width
			 */
			const fbWidth = (this.isVertical ? this.fretMinHeight : this.fretMinWidth) * (this.nbFrets / this.fretSizes.slice(-1)[0])
			              + (this.fretMin == 0 ? this.openStringFretsSize : 0);

			return { [this.isVertical ? 'min-height': 'min-width']: `${Math.ceil(fbWidth)}px` };
		},
		grid()
		{
			// Add the open-string fret to the list of frets if needed
			const fretSizes  = (this.fretMin == 0 ? [`${this.openStringFretsSize}px`] : []).concat(this.fretSizes.map(size => `${size}fr`));

			// Build the grid layout
			const gridLayout = (this.isFretboardFlipped ? fretSizes.reverse() : fretSizes).join(' ');

			return !this.isVertical
				? { 'grid-template-columns': gridLayout                                               }
				: { 'grid-template-rows':    gridLayout, 'grid-template-columns': 'repeat(5, 40px) 0' };
		},
		inlays()
		{
			// List the frets which can have an inlay (only the 12th is omitted)
			let frets = ['3', '5', '7', '9', '15', '17', '19', '21'];

			switch (this.nbStrings)
			{
				/**
				 * Bass, ukulele, guitar
				 * Single inlay in the middle + double inlay at the 12th fret
				 */
				case 4:  return ['12-1', '12-3'].concat(frets.map(f => `${f}-2`));
				case 6:  return ['12-2', '12-4'].concat(frets.map(f => `${f}-3`));

				/**
				 * Five-string banjo, seven-string guitar, mandolin, nine-, eleven- string guitar
				 * Double inlay (close for odd frets, spreaded for the 12th)
				 */
				case 5:  return ['12-1', '12-4'].concat(frets.map(f => `${f}-2`), frets.map(f => `${f}-3`));
				case 7:  return ['12-2', '12-5'].concat(frets.map(f => `${f}-3`), frets.map(f => `${f}-4`));
				case 8:  return ['12-2', '12-6'].concat(frets.map(f => `${f}-3`), frets.map(f => `${f}-5`));
				case 9:  return ['12-2', '12-7'].concat(frets.map(f => `${f}-3`), frets.map(f => `${f}-6`));
				case 11: return ['12-3', '12-8'].concat(frets.map(f => `${f}-4`), frets.map(f => `${f}-7`));

				/**
				 * Ten-string guitar
				 * Double inlay for odd frets, triple for the 12th
				 */
				case 10: return ['12-2', '12-8'].concat(frets.map(f => `${f}-4`), frets.map(f => `${f}-6`), ['12-5']);

				default: return [];
			}
		},
		fretSizes()
		{
			/**
			 * Compute the size of each fret so that:
			 *     - size(1) = 3/2
			 *     - size(n) = 1/2 (n = total number of frets)
			 *
			 * Which gives the following function:
			 *     f(x) = (3n - 1)/(2n - 2) - x/(n - 1)
			 */
			const n = this.nbFrets;
			const c = (3*n - 1)/(2*n - 2);

			return [...Array(this.nbFrets - (this.fretMin == 0 ? 1 : 0)).keys()].map(i => c - i/(n - 1));
		},
		frets()
		{
			let frets = [];

			// Get all the notes of each string according to the current tuning
			const stringNotes = [...Array(this.nbStrings).keys()].map(string => music.getStringNotes(this.tuningNotes[string]));

			const addFret = (string, _fret) =>
			{
				// Invert the order of the frets if the fretboard is flipped
				const fret = this.isFretboardFlipped ? this.fretMin + this.fretMax - _fret : _fret;
				const note = stringNotes[string][fret];

				// Get the list of scales the note of the fret belongs to
				let scales = this.scales.filter(
					scale => scale.notes.includes(note)
					&& (
					       scale.type     == 'arpeggio'
					    || scale.position == 0
					    || scale.posCoordinates.filter(c => c.string == string && c.fret == fret).length > 0
					)
				);

				// Remove the scales displaying intersections only if they are alone
				if (scales.length == 1 && scales[0].isShowingIntersections) scales = [];

				frets.push({
					string,
					fret,
					note,
					scales:    scales.map(scale => ({ id: scale.id, color: scale.color })),
					intervals: scales.map(scale => (
					{
						id:     scale.id,
						color:  scale.color,
						value:  music.getNotesInterval(scale.notes[0], note),
					})),

					isHighlightedNote: scales.some(s => s.highlightedNote === music.getNotesInterval(s.notes[0], note)),
					isDisplayingInlay: this.inlays.includes(`${fret}-${string}`),
				});
			}

			if (this.isVertical)
			{
				for (let fret=this.fretMin;         fret<=this.fretMax; fret++)
				for (let string=this.nbStrings - 1; string>=0;          string--)
					addFret(string, fret);
			}
			else
			{
				for (let string=this.nbStrings - 1; string>=0;          string--)
				for (let fret=this.fretMin;         fret<=this.fretMax; fret++)
					addFret(string, fret);
			}

			return frets;
		},
		scales()
		{
			return this.activeScales.map(scale =>
			{
				const notes          = music.generateModelNotes(data[`${scale.type}s`][scale.model].model, scale.tonality);
				const posCoordinates = scale.type == 'arpeggio'
					? []
					: music.generateModelPosition(
						this.nbStrings,
						this.nbFrets,
						this.tuningNotes,
						notes,
						data.scales[scale.model].nbNotesPerString,
						scale.position
					);

				return { notes, posCoordinates, ...scale };
			});
		},
		nbStrings()
		{
			return data.instruments[this.instrument].nbStrings;
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
		fretNumbers()
		{
			return [...Array(this.nbFrets).keys()]
				.map(index => this.isFretboardFlipped ? this.fretMax - index : this.fretMin + index)
				.map(fret  => fret == 0 ? '' : fret);
		},
		tuningNotes()
		{
			return data.tunings[this.instrument][this.tuning];
		},
		...get([
			'instrument',
			'tuning',
			'fretRange',

			'scales/activeScales',

			'isFretboardFlipped',
		]),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.fretboard {
	display: grid;

	@include mq($until: desktop)
	{
		justify-content: center;
	}
}

.fret-number {
	display: flex;
	align-items: flex-end;
	justify-content: center;

	height: 50px;
}

.fret-number__text {
	color: var(--color--text-2);
}

/*
.fret-infos {
	display: flex;
	@include space-children-h(10px);

	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);

	opacity: 0;
	transition: opacity 0.2s;

	&.is-visible {
		opacity: 1;
	}
}

.fret-infos__item {
	display: flex;
	align-items: center;
	@include space-children-h(5px);

	color: var(--color--text);
}

.fret-infos__item__color-dot {
	@include circle(10px);
}
*/

</style>
<!--}}}-->
