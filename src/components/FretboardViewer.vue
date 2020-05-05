

<!-- components/FretboardViewer.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewer(
	:style="grid"
	)

	//- Frets
	//- FretboardViewerFret(
		v-for="fret in frets"
		:key="`fret--${fret.string + 1}--${fret.number}`"
		)

	//- Strings
	div.string(
		v-for="string in nbStrings"
		:key="`string--${string + 1}`"

		:style="{ transform: `translateY(${100*(string / nbStrings)}%)` }"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import scssVars                 from '@/styles/exports.scss'

import { instruments, tunings } from '@/modules/music'
import { getFrets }             from '@/modules/fretboard'

export default {
	name: 'FretboardViewer',

	// @NOTE: this (↓) is mocking data!
	data() {
		return {
			fretRange:  [0, 22],
			instrument: 'guitar',

			displayedScales: [
				{
					index:    0,
					type:     'scale',
					name:     'min5',
					tonality: 'G',
				},
				{
					index:    1,
					type:     'arpeggio',
					name:     'maj',
					tonality: 'B',
				},
			]
		}
	},

	computed: {
		grid()
		{
			return { 'grid-template-columns': this.fretMin == 0 ? [scssVars.openStringFretsSize, ...this.layout] : this.layout };
		},
		layout()
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

			// Don't include the open string fret in the flexible layout
			return [...Array(this.fretMin == 0 ? (this.nbFrets - 1) : this.nbFrets).keys()].map(i => `${c - i/(n - 1)}fr`);
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
				case 4:  return ['12-1', '12-3', ...frets.map(f => `${f}-2`)];
				case 6:  return ['12-2', '12-4', ...frets.map(f => `${f}-3`)];

				/**
				 * Five-string banjo, seven-string guitar, mandolin, nine-, eleven- string guitar
				 * Double inlay (close for odd frets, spreaded for the 12th)
				 */
				case 5:  return ['12-1', '12-4', ...frets.map(f => `${f}-2`), ...frets.map(f => `${f}-3`)];
				case 7:  return ['12-2', '12-5', ...frets.map(f => `${f}-3`), ...frets.map(f => `${f}-4`)];
				case 8:  return ['12-2', '12-6', ...frets.map(f => `${f}-3`), ...frets.map(f => `${f}-5`)];
				case 9:  return ['12-2', '12-7', ...frets.map(f => `${f}-3`), ...frets.map(f => `${f}-6`)];
				case 11: return ['12-3', '12-8', ...frets.map(f => `${f}-4`), ...frets.map(f => `${f}-7`)];

				/**
				 * Ten-string guitar
				 * Double inlay for odd frets, triple for the 12th
				 */
				case 10: return ['12-2', '12-8', ...frets.map(f => `${f}-4`), ...frets.map(f => `${f}-6`), ['12-5']];
			}

			return [];
		},
		displayedFrets()
		{
			return this.frets.filter(fret => this.fretMin <= fret.number && fret.number <= this.fretMax);
		},
		frets()
		{
			return getFrets(this.nbStrings, this.tuningNotes, this.displayedScales);
		},
		tuningNotes()
		{
			return tunings[this.instrument][this.tuning] || tunings[this.instrument]['standard'];
		},
		nbStrings()
		{
			return instruments[this.instrument].nbStrings;
		},
		nbFrets()
		{
			return this.fretMax - this.fretMin + 1;
		},
		fretMin()
		{
			return this.fretRange[0];
		},
		fretMax()
		{
			return this.fretRange[1];
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use "@/styles/layout";

.FretboardViewer {
	position: relative;
}

.string {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;

	height: layout.$string-thickness;

	background-color: var(--color--string);
}

</style>
<!--}}}-->
