
/**
 * modules/music.js
 */

import data from '@/modules/data'

/**
 * Return an array containing all the notes of a string
 */
export function getStringNotes(_openStringNote)
{
	let notes = [];

	for (let i=0; i<=24; i++)
		notes.push(getIntervalSecondNote(_openStringNote, i));

	return notes;
}

/**
 * Generate the notes of a scale/arpeggio based on a model and a tonality
 */
export function generateModelNotes(_model, _tonality)
{
	let notes     = [_tonality];
	let offset    = data.notes.indexOf(_tonality);
	let intervals = _model;

	for (let i=0; i<intervals.length - 1; i++)
	{
		offset += intervals[i];
		notes.push(data.notes[offset % 12]);
	}

	return notes;
}

/**
 * Return the second note of an interval expressed in half-steps
 */
export function getIntervalSecondNote(_root, _interval)
{
	let index   = data.notes.indexOf(_root) + _interval;
	let nbNotes = data.notes.length;

	return data.notes[(index < 0) ? (index + nbNotes*Math.ceil(Math.abs(index)/nbNotes)) : (index % nbNotes)];
}

/**
 * Return the interval between two notes
 */
export function getNotesInterval(_note1, _note2)
{
	return Math.abs(data.notes.indexOf(_note1) - data.notes.indexOf(_note2));
}
