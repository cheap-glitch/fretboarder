

<!-- FretboardViewer.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewer(:style="[grid, inlays]")

	//- Frets
	FretboardViewerFret(
		v-for="fret in frets"
		:key="`fret--${fret.fret}-${fret.string+1}`"

		v-bind="fret"
		)

	//- Fret numbers
	div.fret-number(
		v-for="fret in fretNumbers"
		:key="`fret-number--${fret}`"
		)
		p.fret-number__text(v-mods="darkMode") {{ fret }}

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

	computed: {
		frets()
		{
			let frets = [];

			// Generate a list of the frets of each string
			for (let string=this.nbStrings - 1; string>=0; string--)
			{
				// Get all the notes of the string according to the current tuning
				const stringNotes = music.getStringNotes(this.tuningNotes[string]);

				for (let j=this.fretMin; j<=this.fretMax; j++)
				{
					// Invert the order of the frets if the fretboard is flipped
					const fret = this.isFretboardFlipped ? this.fretMin + this.fretMax - j : j;
					const note = stringNotes[fret];

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
		grid()
		{
			let openStringFretsSize = '30px';

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
			'darkMode',
		]),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewer {
	display: grid;
}

.fret-number {
	display: flex;
	align-items: flex-end;
	justify-content: center;

	height: 50px;
}

.fret-number__text {
	color: gray;

	&.dark-mode {
		color: $color-oxford-blue-2;
	}
}

</style>
<!--}}}-->
