
/**
 * test/music.test.js
 */

import 'chai/register-should'
import { models } from '../src/modules/music.js'

describe("scales", () => {

	describe("pentatonics", () => {

		// Source: https://en.wikipedia.org/wiki/Pentatonic_scale
		testModel('maj5',  'C D E G A C');
		testModel('min5',  'C E♭ F G B♭ C');
		testModel('bmaj5', 'C D F G A C');
		testModel('bmin5', 'C E♭ F A♭ B♭ C');
		testModel('egyp',  'C D F G B♭ C');

		// Source: https://en.wikipedia.org/wiki/In_scale
		testModel('in',    'D Eb G A Bb D', 'D');
		// Source: https://en.wikipedia.org/wiki/Hiraj%C5%8Dshi_scale
		testModel('hira',  'C-E-F♯-G-B');
		// Source: https://en.wikipedia.org/wiki/Iwato_scale
		testModel('iwa',   'D-E♭-G-A♭-C', 'D');
		// Source: https://en.wikipedia.org/wiki/Insen_scale
		testModel('ins',   'D-E♭-G-A-C', 'D');
	});

	describe("hexatonics", () => {

		// Source: https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('maj6', 'C D E F G A C');
		testModel('min6', 'C D E♭ F G A♭ C');

		// Source: https://en.wikipedia.org/wiki/Blues_scale
		testModel('bmaj',  'C D Eb E G A C');
		testModel('bmin',  'C E♭ F F# G B♭ C');

		// Source: https://en.wikipedia.org/wiki/Hexatonic_scale
		testModel('aug',   'C D♯ E G A♭ B C');
		testModel('wtone', 'C D E F♯ G♯ A♯ C');
		testModel('tri',   'C D♭ E G♭ G B♭');
		testModel('2tri',  'C D♭ D F♯ G A♭');
		testModel('prom',  'C D E F♯ A B♭');
	});

	describe("heptatonics", () => {

		// Source: https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('ion',      'C D E F G A B C');
		testModel('dor',      'C D E♭ F G A B♭ C');
		testModel('phry',     'C D♭ E♭ F G A♭ B♭ C');
		testModel('lyd',      'C D E F♯ G A B C');
		testModel('mix',      'C D E F G A B♭ C');
		testModel('aeo',      'C D E♭ F G A♭ B♭ C');
		testModel('locr',     'C D♭ E♭ F G♭ A♭ B♭ C');

		// Source: https://en.wikipedia.org/wiki/Harmonic_major_scale
		testModel('harmaj',   'C D E F G Ab B C');
		// Source: https://en.wikipedia.org/wiki/Double_harmonic_scale
		testModel('dharmaj',  'C Db E F G Ab B C');
		// Source: https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('harmmin',  'C D E♭ F G A♭ B C');
		// Source: https://en.wikipedia.org/wiki/Hungarian_minor_scale
		testModel('dharmmin', 'C D Eb F# G Ab B C');
		// Source: https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('amel',     'C D E♭ F G A B C');
		testModel('dmel',     (a => { a.reverse(); return a; })('C B♭ A♭ G F E♭ D C'.split(' ')).join(' '));

		// Source: https://en.wikipedia.org/wiki/Jazz_scale#Modes_of_the_melodic_minor_scale
		testModel('dorf2',    'C–D♭–E♭–F–G–A–B♭');
		testModel('lydaug',   'C–D–E–F♯–G♯–A–B');
		testModel('lyddom',   'C–D–E–F♯–G–A–B♭');
		testModel('mixf6',    'C–D–E–F–G–A♭–B♭');
		testModel('locrs2',   'C–D–E♭–F–G♭–A♭–B♭');
		testModel('alt',      'C–D♭–E♭–F♭–G♭–A♭–B♭');
		// Source: https://en.wikipedia.org/wiki/Phrygian_dominant_scale
		testModel('phrydom',  'C – D♭ – E – F – G – A♭ – B♭ – C');
		// Source: https://en.wikipedia.org/wiki/Double_harmonic_scale#Modes
		testModel('ultphry',  'C Db Eb Fb G G# A C');
		// Source: https://en.wikipedia.org/wiki/Aeolian_dominant_scale
		testModel('aeodom',   'C, D, E, F, G, A♭, B♭');

		// Source: https://en.wikipedia.org/wiki/Neapolitan_scale
		testModel('majneap',  'C  D♭  E♭ F  G  A  B  C');
		testModel('minneap',  'C  D♭  E♭ F  G  A♭ B  C');
		// Source: https://en.wikipedia.org/wiki/Persian_scale
		testModel('pers',     'C, D♭, E, F, G♭, A♭, B, C');
		// Source: https://en.wikipedia.org/wiki/Hungarian_major_scale
		testModel('hungmaj',  'C D♯ E F♯ G A B♭');
		// Source: https://en.wikipedia.org/wiki/Hungarian_minor_scale
		testModel('hungmin',  'C D Eb F# G Ab B C');
		testModel('gypsy',    'C D Eb F# G Ab Bb C');
		// Source: https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
		testModel('ukrdor',   'C D E♭ F♯ G A B♭');
		// Source: https://en.wikipedia.org/wiki/Enigmatic_scale
		testModel('eni',      'C, D♭, E, F♯, G♯, A♯, B, C');
	});

	describe("octatonics", () => {

		// Source: https://en.wikipedia.org/wiki/Octatonic_scale
		testModel('dimhw',      'C C# D# E F# G A Bb C');
		testModel('dimwh',      'C D Eb F F# G# A B C');

		// Source: https://en.wikipedia.org/wiki/Bebop_scale
		testModel('bebdom',     'C D E F G A Bb B C');
		testModel('bebmaj',     'C D E F G G# A B C');
		testModel('bebdor',     'C D Eb E F G A Bb C');
		testModel('bebdoralt',  'C D Eb F G A Bb B C');
		testModel('bebhmin',    'C D Eb F G Ab Bb B C');
		testModel('bebmel',     'C D  Eb F G G# A B C');
	});

	describe("chromatic", () => {
		testModel('chro', 'C C♯ D D♯ E F F♯ G G♯ A B♭ B C');
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
