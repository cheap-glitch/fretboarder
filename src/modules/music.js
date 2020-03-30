
/**
 * modules/music.js
 */

import data from '@/modules/data'

// Define the maximum length of the fretboard
const MAX_NB_FRETS  = 24;
const HALF_NB_FRETS = Math.floor(MAX_NB_FRETS/2);

/**
 * Generate the "coordinates" of the notes in a single position of a given model
 */
export function generateModelPosition(nbStrings, nbFrets, tuningNotes, scaleNotes, nbNotesPerString, position)
{
	// Find the fret of the root note on the lowest string
	const root         = scaleNotes[0];
	const baseRootFret = getStringNotes(tuningNotes[0]).indexOf(root);

	// Find the fret of the root note in the specified position
	let rootFret = null;
	for (let fret=baseRootFret, pos=0; pos<position; fret++)
	for (let string=nbStrings-1; string>=0; string--)
	{
		if (getStringNotes(tuningNotes[string])[fret % nbFrets] == root)
		{
			rootFret = fret;
			pos++;
			break;
		}
	}

	// Compute the coordinates of the notes of the scale on each string
	let coordinates = [];
	for (let string=0; string<nbStrings; string++)
	{
		// Fetch notes around the root fret until the specified quota has been filled
		for (let offset=-1, nb=0; nb<nbNotesPerString; offset++)
		{
			let fret = (rootFret + offset < 0) ? rootFret + offset + nbFrets + 1 : (rootFret + offset) % (nbFrets + 1);

			const note = getStringNotes(tuningNotes[string])[fret];
			if (scaleNotes.includes(note))
			{
				coordinates.push({ string, fret, note });
				nb++;
			}
		}
	}

	// Remove the coordinates of duplicated notes
	coordinates = coordinates.filter(c1 => !coordinates.some(c2 => {

		// Ignore if it's the same set of coordinates or if the note is different
		if (c1 === c2 || c1.note != c2.note || Math.abs(c1.string - c2.string) > 1) return false;

		// Compare which set of coordinates is closest to the fret of the root note
		return Math.abs(c1.fret - rootFret) > Math.abs(c2.fret - rootFret);
	}));

	// Compute the coordinates of the notes one octave lower/higher
	const octavedCoordinates = [];
	coordinates.forEach(c =>
	{
		octavedCoordinates.push({
			string:  c.string,
			fret:    c.fret + HALF_NB_FRETS > nbFrets ? c.fret - HALF_NB_FRETS : c.fret + HALF_NB_FRETS,
			note:    c.note,
		});

		if (c.fret + HALF_NB_FRETS == nbFrets && [HALF_NB_FRETS, MAX_NB_FRETS].includes(nbFrets))
		{
			octavedCoordinates.push({
				string: c.string,
				fret:   0,
				note:   c.note,
			});
		}
	});

	return [...coordinates, ...octavedCoordinates];
}

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
 * Return an array containing all the notes of a string
 */
export function getStringNotes(openStringNote)
{
	return [...Array(MAX_NB_FRETS+1).keys()].map(i => getIntervalSecondNote(openStringNote, i));
}

/**
 * Return the second note of an interval expressed in half-steps
 */
export function getIntervalSecondNote(root, interval)
{
	let index   = data.notes.indexOf(root) + interval;
	let nbNotes = data.notes.length;

	return data.notes[(index < 0) ? (index + nbNotes*Math.ceil(Math.abs(index) / nbNotes)) : (index % nbNotes)];
}

/**
 * Return the interval between two notes, starting from the first one and going up the chromatic scale
 */
export function getNotesInterval(note1, note2)
{
	let interval = 0;
	for (let i = data.notes.indexOf(note1); data.notes[i % data.notes.length] != note2; i++, interval++);

	return interval;
}
