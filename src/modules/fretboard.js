
/**
 * modules/fretboard.js
 */

import { MAX_NB_FRETS }             from '@/modules/consts'
import { notes, scales, arpeggios } from '@/modules/music'

/**
 * Generate a list of frets
 */
export function getFrets(nbStrings, tuningNotes, displayedScales)
{
	// Get the model of each scale
	const models = displayedScales.map(scale => [0, ...((scale.type == 'scale' ? scales : arpeggios)[scale.model].model)]);

	return [...Array(nbStrings*MAX_NB_FRETS).keys()].map(function(fretIndex)
	{
		let isFretHighlighted = false;

		const fretNumber = fretIndex % MAX_NB_FRETS;
		const fretString = Math.floor(fretIndex / MAX_NB_FRETS);
		const fretScales = displayedScales.reduce(function(fretScales, scale, index)
		{
			// Compute the interval of the fret note relative to the root note of the scale
			const interval = (getInterval(scale.tonality, tuningNotes[fretString]) + fretNumber) % notes.length;

			if (models[index].includes(interval))
			{
				fretScales.push({ index, interval });

				if (scale.highlightedInterval === interval)
					isFretHighlighted = true;
			}

			return fretScales;
		}, []);

		return {
			note:   notes[(notes.indexOf(tuningNotes[fretString]) + fretNumber) % notes.length],
			number: fretNumber,
			string: fretString,

			isHighlighted: isFretHighlighted,

			// Remove scales that only display their intersections if they are alone on a fret
			scales: (fretScales.length == 1 && fretScales[0].isIntersected) ? [] : fretScales,
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
