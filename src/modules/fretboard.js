
/**
 * modules/fretboard.js
 */

import { notes }        from '@/modules/music'
import { MAX_NB_FRETS } from '@/modules/constants'

/**
 * Generate a list of frets
 */
export function getFrets(nbStrings, tuningNotes, scales, models, displayedScales)
{
	// Get the index of the fret of the root note on the lowest string for each scale
	const rootFrets = scales.map(scale => getInterval(tuningNotes[0], scale.tonality));

	return [...Array(nbStrings*MAX_NB_FRETS).keys()].map(function(fretIndex)
	{
		let isFretHighlighted = false;

		const fretNumber = fretIndex % MAX_NB_FRETS;
		const fretString = Math.floor(fretIndex / MAX_NB_FRETS);
		const fretScales = displayedScales
			.filter(function(scale)
			{
				if (scale.position == 0)
					return true;

				const posStart  = (rootFrets[scale.index] - 1 + 15*(scale.position - 1)) % MAX_NB_FRETS;
				const posStop   = (posStart   +  5) %  MAX_NB_FRETS;
				const otherFret = (fretNumber + 12) % (MAX_NB_FRETS - 1);

				return posStart < posStop
					? (posStart <= fretNumber && fretNumber < posStop) || (posStart <= otherFret && otherFret < posStop)
					: (posStart <= fretNumber || fretNumber < posStop) || (posStart <= otherFret || otherFret < posStop);

			})
			.reduce(function(fretScales, scale)
			{
				// Compute the interval of the fret note relative to the root note of the scale
				const interval = (getInterval(scale.tonality, tuningNotes[fretString]) + fretNumber) % notes.length;

				if (models[scale.index].includes(interval))
				{
					fretScales.push({ index: scale.index, interval });

					if (scale.highlightedInterval === interval)
						isFretHighlighted = true;
				}

				return fretScales;
			}, []);

		return {
			note:          notes[(notes.indexOf(tuningNotes[fretString]) + fretNumber) % notes.length],
			number:        fretNumber,
			string:        fretString,
			isHighlighted: isFretHighlighted,

			// Disable frets that only show intersected scales
			scales: fretScales.every(scale => scales[scale.index].isIntersected) ? [] : fretScales,
		};
	});
}

/**
 * Return the positive number of half-steps between two notes
 */
function getInterval(note1, note2)
{
	const index1 = notes.indexOf(note1);
	const index2 = notes.indexOf(note2);

	return index1 <= index2 ? index2 - index1 : notes.length - (index1 - index2);
}
