
/**
 * modules/music.js
 */

import data from '@/modules/data'

/**
 * Generate the "coordinates" of the notes in a single position of a given model
 */
export function generateModelPosition(_nbStrings, _nbFrets, _tuningNotes, _scaleNotes, _nbNotesPerString)
{
	// Find the fret of the root note on the lowest string
	const root         = _scaleNotes[0];
	const baseRootFret = getStringNotes(_tuningNotes[0]).indexOf(root);

	// Find the fret of the root note in the specified position
	let rootFret = null;
	for (let fret=baseRootFret; fret<MAX_NB_FRETS; fret++)
	{
		for (let string=_nbStrings-1; string>=0; string--)
		{
			if (getStringNotes(_tuningNotes[string])[fret % _nbFrets] == root)
			{
				rootFret = fret;
				break;
			}
		}

		if (rootFret != null)
			break;
	}

	// Compute the coordinates of the notes of the scale on each string
	let coordinates = [];
	for (let string=0; string<_nbStrings; string++)
	{
		// Fetch notes around the root fret until the specified quota has been filled
		for (let offset=-1, nb=0; nb<_nbNotesPerString; offset++)
		{
			let fret = (rootFret + offset < 0) ? rootFret + offset + _nbFrets + 1 : (rootFret + offset) % (_nbFrets + 1);

			const note = getStringNotes(_tuningNotes[string])[fret];
			if (_scaleNotes.includes(note))
			{
				coordinates.push({ string, fret, note });
				nb++;
			}
		}
	}

	// Remove the coordinates of duplicated notes
	coordinates = coordinates.filter(_c1 => !coordinates.some(_c2 => {

		// Ignore if it's the same set of coordinates or if the note is different
		if (_c1 === _c2 || _c1.note != _c2.note || Math.abs(_c1.string - _c2.string) > 1) return false;

		// Compare which set of coordinates is closest to the fret of the root note
		return Math.abs(_c1.fret - rootFret) > Math.abs(_c2.fret - rootFret);
	}));

	// Compute the coordinates of the notes one octave lower/higher
	const octavedCoordinates = [];
	coordinates.forEach(_c =>
	{
		const HALF_NB_FRETS = Math.floor(MAX_NB_FRETS/2);

		octavedCoordinates.push({
			string:  _c.string,
			fret:    _c.fret + HALF_NB_FRETS > _nbFrets ? _c.fret - HALF_NB_FRETS : _c.fret + HALF_NB_FRETS,
			note:    _c.note,
		});

		if (_c.fret + HALF_NB_FRETS == _nbFrets && [HALF_NB_FRETS, MAX_NB_FRETS].includes(_nbFrets))
		{
			octavedCoordinates.push({
				string: _c.string,
				fret:   0,
				note:   _c.note,
			});
		}
	});

	return [...coordinates, ...octavedCoordinates];
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

/**
 * Return an array containing all the notes of a string
 */
const MAX_NB_FRETS = 24;
export function getStringNotes(_openStringNote)
{
	let notes = [];

	for (let i=0; i<=MAX_NB_FRETS; i++)
		notes.push(getIntervalSecondNote(_openStringNote, i));

	return notes;
}
