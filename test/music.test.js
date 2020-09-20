
/**
 * test/music.test.js
 */

import 'chai/register-should'
import { models } from '../src/modules/music.js'

describe("scales", () => {

	describe("pentatonics & blues", () => {
	});

	describe("naturals", () => {
	});

	describe("modes", () => {
	});

	describe("others", () => {
	});
});

describe("arpeggios", () => {

	describe("triads", () => {
		test_model('arp-maj', 'C E  G');
		test_model('arp-min', 'C D# G');
		test_model('arp-pow', 'C G');
		test_model('arp-aug', 'C E  G#');
		test_model('arp-dim', 'C D# F#');
	});

	describe("sixth chords", () => {
		test_model('arp-maj6',   'C E  G  A');
		test_model('arp-min6',   'C D# G  A');
		test_model('arp-6-9',    'C D  E  G A');
		test_model('arp-min6-9', 'C D  D# G A');
	});


	describe("seventh chords", () => {
		test_model('arp-dom7',    'C E  G  Bb');
		test_model('arp-dom7f5',  'C E  F# Bb');
		test_model('arp-maj7',    'C E  G  B');
		test_model('arp-min7',    'C D# G  Bb');
		test_model('arp-minmaj7', 'C D# G  B');
		test_model('arp-aug7',    'C E  G# Bb');
		test_model('arp-hdim7',   'C D# F# Bb');
		test_model('arp-dimmaj7', 'C D# F# B');
		test_model('arp-dim7',    'C D# F# A');
		test_model('arp-dom7s9',  'C D# E  G Bb');
	});

	describe("ninth chords", () => {
		test_model('arp-dom9',     'C E  G  Bb D');
		test_model('arp-dommin9',  'C E  G  Bb C#');
		test_model('arp-maj9',     'C E  G  B  D');
		test_model('arp-min9',     'C D# G  Bb D');
		test_model('arp-minmaj9',  'C D# G  B  D');
		test_model('arp-aug9',     'C E  G  Bb D#');
		test_model('arp-augmaj9',  'C E  G  B  D#');
		test_model('arp-hdim9',    'C D# F# Bb D');
		test_model('arp-hdimmin9', 'C D# F# Bb C#');
		test_model('arp-dim9',     'C D# F# A  D');
		test_model('arp-dimmin9',  'C D# F# A  C#');
	});

	describe("eleventh chords", () => {
		test_model('arp-dom11',    'C E  G  Bb D F');
		test_model('arp-maj11',    'C E  G  B  D F');
		test_model('arp-minmaj11', 'C D# G  B  D F');
		test_model('arp-min11',    'C D# G  Bb D F');
		test_model('arp-aug11',    'C E  G# Bb D F');
		test_model('arp-augmaj11', 'C E  G# B  D F');
		test_model('arp-hdim11',   'C D# F# Bb D F');
		test_model('arp-dim11',    'C D# F# A  D F');
	});

	describe("thirteenth chords", () => {
		test_model('arp-dom13',    'C E  G  Bb D F A');
		test_model('arp-maj13',    'C E  G  B  D F A');
		test_model('arp-min13',    'C D# G  Bb D F A');
		test_model('arp-minmaj13', 'C D# G  B  D F A');
		test_model('arp-aug13',    'C E  G# Bb D F A');
		test_model('arp-augmaj13', 'C E  G# B  D F A');
		test_model('arp-hdim13',   'C D# F# Bb D F A');
	});
});

/**
 * Helper function to test a single model
 */
function testModel(modelName, notes, tonality = 'C')
{
	it(modelName, () => generateModelNotes(modelName, tonality).should.have.ordered.members(parseNotes(notes, tonality)));
}

/**
 * Parse a string of notes into a array of intervals
 */
function parseNotes(notes, tonality)
{
	return notes
		.trim()
		.replace(RegExp(` ?${tonality}$`), '')
		.replace(/[-–,]/g, ' ')
		.replace(/ {2,}/g, ' ')
		.trim()
		.replace(/♭/g, 'b')
		.replace(/♯/g, '#')
		.split(' ')
		.map(note => notesValues[note]);
}

/**
 * Return a string containing all the notes
 * of a scale/arpeggio in the C tonality, separated by spaces
 */
function generateModelNotes(modelName, tonality)
{
	return [0, ...models[modelName].intervals].map(interval => (notesValues[tonality] + interval) % 12);
}

const notesValues = {
	'Ab': 11,
	'A':   0,
	'A#':  1,
	'Bb':  1,
	'B':   2,
	'Cb':  2,
	'B#':  3,
	'C':   3,
	'C#':  4,
	'Db':  4,
	'D':   5,
	'D#':  6,
	'Eb':  6,
	'E':   7,
	'Fb':  7,
	'E#':  8,
	'F':   8,
	'F#':  9,
	'Gb':  9,
	'G':  10,
	'G#': 11,
};
