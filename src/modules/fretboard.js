
/**
 * modules/fretboard.js
 */

import { notes, scales, arpeggios } from '@/modules/music'

export const MAX_NB_FRETS = 24;

/**
 * Generate a grid of frets
 */
export function getFrets(tuning, displayedScales)
{
	// Get the model of each scale
	const models = displayedScales.map(scale => [0, ...((scale.type == 'scale' ? scales : arpeggios)[scale.name].model)]);

	// Generate an array of strings from each tuning note
	return tuning.map(openStringNote =>
		// Generate an array of frets for each string
		Array(MAX_NB_FRETS).keys().map(fretNumber =>
			// Get the list of scales the fret note belongs to
			displayedScales.reduce(function(fretScales, scale, index)
			{
				const interval = (getInterval(scale.tonality, openStringNote) + fretNumber) % 12;

				if (models[index].includes(intervals[index]))
					fretScales.push({ index, interval });

				return fretScales;
			}, [])
		)
	);
}

/**
 * Return the positive number of half-steps between two notes
 */
function getInterval(note1, note2)
{
	return notes.indexOf(note1) <= notes.indexOf(note2)
		? notes.indexOf(note2) - notes.indexOf(note1)
		: notes.indexOf(note1) - notes.indexOf(note2) + 12;
}
