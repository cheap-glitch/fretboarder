
/**
 * modules/fretboard.js
 */

import { notes, scales, arpeggios } from '@/modules/music'

export const MAX_NB_FRETS = 24;

/**
 * Generate a grid of frets
 */
export function getFrets(tuning, scales)
{
	// Get the model of each scale
	const models = scales.map(scale => [0, ...((scale.type == 'scale' ? scales : arpeggios)[scale.name].model)]);

	// Generate an array of strings from each tuning note
	return tuning.map(openStringNote =>
		// Generate an array of frets for each string
		Array(MAX_NB_FRETS).keys().map(fretNumber =>
			// Get the indexes of the scales that the fret note belongs to
			scales.filter((scale, index) => models[index].includes((getInterval(scale.tonality, openStringNote) + fretNumber) % 12)).map(scale => scale.index)
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
