
/**
 * modules/fretboard.js
 */

import { notes, models }          from '@/modules/music'
import { NB_FRETS, MAX_NB_FRETS } from '@/modules/constants'

/**
 * Generate a list of frets with infos on the sequences they belong to
 */
export function getFrets(sequences, tuningNotes, capo)
{
	// Get the index of the fret of the root note on the lowest string for every sequence
	const positionOffsets = sequences.map(seq => getInterval(tuningNotes[0], seq.tonality));

	// Build an array of frets for each string and flatten them in a single list
	return tuningNotes.flatMap(function(openStringNote, stringNumber)
	{
		// Create the frets
		const frets = [...Array(NB_FRETS).keys()].map(fretNumber => ({
			string:        stringNumber,
			number:        fretNumber,
			note:          notes[(notes.indexOf(openStringNote) + capo + fretNumber) % notes.length],
			sequences:     [],
			isHighlighted: false,
		}));

		// Mark the frets that belong to each sequence
		sequences.forEach(function(seq, seqIndex)
		{
			// Find the first fret whose note is the root of the sequence
			const rootFret = frets.findIndex(fret => fret.note == seq.tonality);

			// Loop through the intervals and add the sequence index to the sequences list of their corresponding frets
			[0, ...models[seq.model].intervals].forEach(function(interval)
			{
				const fretNumber = rootFret + interval;

				// If the sequence is limited to a single position, check that the fret is in its boundaries
				if (seq.position != 0
				 && ('positions' in models[seq.model])
				 && !isInPosition(fretNumber, models[seq.model].positions[seq.position - 1], positionOffsets[seqIndex]))
					return;

				// Modify the current fret and the one 12 half-steps above/below it
				[fretNumber, (fretNumber + 12) % NB_FRETS].forEach(function(fret)
				{
					frets[fret].sequences.push({ index: seq.index, interval, isIntersected: seq.isIntersected });

					if (interval === seq.highlightedInterval)
						frets[fret].isHighlighted = true;
				});
			});
		});

		// Deactivate frets with only intersected sequences
		frets.forEach(function(fret)
		{
			if (fret.sequences.every(seq => seq.isIntersected))
				fret.sequences = [];
		});

		// Extend the fretboard by duplicating the frets needed to reach the upper limit
		return frets.concat(frets.slice(0, MAX_NB_FRETS - NB_FRETS).map(fret => ({ ...fret, number: fret.number + NB_FRETS })));
	});
}

/**
 * Check that a fret is in the boundaries of a position
 */
function isInPosition(fretNumber, position, offset)
{
	const start     = position[0] + offset;
	const stop      = position[1] + offset;
	const otherFret = (fretNumber + 12) % NB_FRETS;

	return start < stop
		? (start <= fretNumber && fretNumber <= stop) || (start <= otherFret && otherFret <= stop)
		: (start <= fretNumber || fretNumber <= stop) || (start <= otherFret || otherFret <= stop);
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
