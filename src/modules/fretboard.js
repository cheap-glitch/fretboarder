
/**
 * modules/fretboard.js
 */

import { notes, scales, arpeggios } from '@/modules/music'

export const MAX_NB_FRETS = 24;

/**
 * Generate a list of frets
 */
export function getFrets(nbStrings, tuning, displayedScales)
{
	// Get the model of each scale
	const models = displayedScales.map(scale => [0, ...((scale.type == 'scale' ? scales : arpeggios)[scale.name].model)]);

	return Array(nbStrings*MAX_NB_FRETS).keys().map(function(fretIndex)
	{
		const fretNumber     = fretIndex % MAX_NB_FRETS;
		const openStringNote = tuning[Math.floor(fretIndex / MAX_NB_FRETS)];

		return {
			number: fretNumber,
			scales: displayedScales.reduce(function(fretScales, scale, index)
			{
				const interval = (getInterval(scale.tonality, openStringNote) + fretNumber) % 12;

				if (models[index].includes(interval))
					fretScales.push({ index, interval });

				return fretScales;
			}, []),
		};
	});
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
