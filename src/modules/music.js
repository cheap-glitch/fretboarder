
/**
 * modules/music.js
 */

import data from '@/modules/data'

/**
 * Generate the notes of a scale/arpeggio based on a model and a tonality
 */
export function generateModelNotes(model, tonality)
{
	let notes     = [tonality];
	let offset    = data.notes.indexOf(tonality);
	let intervals = model;

	for (let i=0; i<intervals.length - 1; i++)
	{
		offset += intervals[i];
		notes.push(data.notes[offset % 12]);
	}

	return notes;
}

/**
 * Return the second note of an interval expressed in half-steps from a root note
 */
export function getIntervalSecondNote(root, interval)
{
	let index   = data.notes.indexOf(root) + interval;
	let nbNotes = data.notes.length;

	return data.notes[(index < 0) ? (index + nbNotes*Math.ceil(Math.abs(index) / nbNotes)) : (index % nbNotes)];
}
