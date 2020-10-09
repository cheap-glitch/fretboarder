<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewer(
	v-mods="{ isShowingFretNbs }"
	:style="[minLength, maxWidth, grid]"
	)

	//- Frets
	FretboardViewerFret(
		v-for="(fret, index) of displayedFrets"
		:key="`fret--${fret.number}--${fret.string + 1}`"

		v-bind="fret"
		:displayed-infos="displayedInfos"

		:fret-min="fretMin"
		:is-on-last-string="fret.string + 1 == nbStrings"
		:is-showing-inlay="inlays.includes(`${fret.number}-${fret.string + 1}`)"

		:is-fretboard-vertical="isVertical"
		:is-fretboard-flipped-hor="isFlippedHor"
		:is-fretboard-flipped-vert="isFlippedVert"

		:style="(isFlippedHor && !isVertical) ? { gridArea: `${fret.string + 1} / -${fret.number + 2 - fretMin} / span 1 / span 1` } : null"
		)

	//- Strings
	div.string(
		v-for="(string, index) of strings"
		:key="`string--${index + 1}`"

		:style="string"
		)

	//- Fret numbers
	div.fret-number(
		v-for="(fret, index) of fretNumbers"
		:key="`fret-number--${fret}`"

		v-show="isShowingFretNbs"
		v-mods="{ isVertical }"
		:style="isVertical ? { gridArea: `${index + 1} / 1 / span 1 / span 1` } : null"
		)
		p.fret-number__text {{ fret }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                  from 'vuex-pathify'

import { layout }               from '@/modules/layout'
import { instruments, tunings } from '@/modules/music'
import { getFrets }             from '@/modules/fretboard'

import FretboardViewerFret      from '@/components/FretboardViewerFret'

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

	computed: {
		grid() {
			let template = [...(this.fretMin == 0 ? [layout.openStringFretLength.px] : []), ...this.layout.map(track => `${track}fr`)];

			/**
			 * Invert the grid layout:
			 *  - when the fretboard is vertical (portait mode, e.g. on mobile) and "mirrored"
			 *  - when the fretboard is horizontal (desktop or mobile in landscape mode) and the fretting hand is flipped
			 */
			if (this.isVertical ? this.isFlippedVert : this.isFlippedHor) template.reverse();

			return {
				'grid-auto-flow': this.isVertical ? 'column' : 'row',
				[`grid-template-${this.isVertical ? 'rows'   : 'columns'}`]: template.join(' '),
			};
		},
		maxWidth() {
			// Limit the width of the fretboard in vertical mode
			return this.isVertical ? { width: `${(this.nbStrings - 1)*layout.fretWidth.int + this.fretNumbersPadding.int}px` } : {};
		},
		minLength() {
			/**
			 * The length of the fretboard must be so that the length
			 * of the smallest fret is equal or greater than a fixed minimum length
			 */
			const length = layout.minFretLength.int*(this.nbFrets / this.layout.slice(-1)[0]) + (this.fretMin == 0 ? layout.openStringFretLength.int : 0);

			return { [`min-${this.isVertical ? 'height': 'width'}`]: `${Math.ceil(length)}px` };
		},
		layout() {
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
			return [...Array(this.fretMin == 0 ? (this.nbFrets - 1) : this.nbFrets).keys()].map(i => c - i/(n - 1));
		},
		strings() {
			return [...Array(this.nbStrings).keys()].map(index => ({
				// Start & end
				[this.isVertical ? (this.isFlippedVert ? 'bottom' : 'top'   ) : (this.isFlippedHor ? 'right' : 'left' )]: this.fretMin == 0 ? layout.openStringFretLength.px : '0',
				[this.isVertical ? (this.isFlippedVert ? 'top'    : 'bottom') : (this.isFlippedHor ? 'left'  : 'right')]: 0,

				// Position
				[this.isVertical ? 'left': 'top']: `calc(calc(100% - ${this.fretNumbersPadding.px})*${index / (this.nbStrings - 1)})`,
				transform: this.isVertical ? `translateX(calc(${this.fretNumbersPadding.px} - 50%))` : 'translateY(-50%)',

				// Width
				[this.isVertical ? 'width' : 'height']: layout.stringThickness.px,
			}));
		},
		inlays() {
			// List the frets which can have an inlay (only the 12th is omitted)
			let frets = ['3', '5', '7', '9', '15', '17', '19', '21'];

			switch (this.nbStrings) {
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
		displayedInfos() {
			return (this.displayedSequences.length > 1) ? (this.isShowingNoteNames ? 'name' : 'none') : this.noteInfos;
		},
		displayedFrets() {
			return this.frets.filter(fret => this.fretMin <= fret.number && fret.number <= this.fretMax);
		},
		frets() {
			const frets = getFrets(this.displayedSequences, this.tuningNotes, this.capo);

			if (this.isVertical && this.isFlippedVert)
				frets.reverse();

			return frets;
		},
		fretNumbers() {
			return [...Array(this.nbFrets).keys()]
				.map(index => (this.isFlippedHor && !this.isVertical) ? this.fretMax - index : this.fretMin + index)
				.map(fret  => fret == 0 ? '' : fret);
		},
		fretNumbersPadding() {
			return this.isShowingFretNbs ? layout.fretNumberWrapperSize : { int: 0, px: '0px' };
		},
		tuningNotes() {
			const notes = Array.from(tunings[this.instrument][this.tuning] || tunings[this.instrument]['standard']);

			/**
			 * Invert the order of the strings (the topmost becomes the bottommost, etc.) when:
			 *   - the fretboard is vertical + mirrored and the fretting hand is NOT flipped
			 *   - the fretboard is horizontal and is not "mirrored" (i.e. flipped vertically)
			 */
			return (this.isVertical ? (this.isFlippedVert && !this.isFlippedHor) : !this.isFlippedVert) ? notes.reverse() : notes;
		},
		nbStrings() {
			return instruments[this.instrument].nbStrings;
		},
		nbFrets() {
			return this.fretMax - this.fretMin + 1;
		},
		fretMin() {
			return this.fretRange[0];
		},
		fretMax() {
			return this.fretRange[1];
		},

		...get('sequences', [
			'displayedSequences'
		]),

		...get('fretboard', [
			'instrument',
			'tuning',
			'capo',
			'fretRange',

			'noteInfos',

			'isFlippedHor',
			'isFlippedVert',
			'isShowingFretNbs',
			'isShowingNoteNames',
		]),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewer {
	display: grid;
	position: relative;

	// Shift the fretboard to keep it horizontally centered when fret numbers are displayed
	@include mq($until: desktop, $and: "(orientation: portrait)") {
		&.is-showing-fret-nbs { transform: translateX(layout.$fret-number-wrapper-size / -2); }
	}
}

.string {
	position: absolute;

	background-color: var(--color--string);
}

.fret-number {
	display: flex;

	&.is-vertical {
		align-items: center;
		justify-content: flex-start;

		width: layout.$fret-number-wrapper-size;
	}

	&:not(.is-vertical) {
		align-items: flex-end;
		justify-content: center;

		height: layout.$fret-number-wrapper-size;
	}
}

.fret-number__text {
	color: var(--color--text--secondary);
}

</style>
<!--}}}-->
