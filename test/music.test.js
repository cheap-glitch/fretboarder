
/**
 * test/music.test.js
 */

import 'chai/register-should'
import { models } from '../src/modules/music.js'

describe("scales", () => {

	describe("pentatonics", () => {
		// https://en.wikipedia.org/wiki/Pentatonic_scale
		testModel('maj5',  'C D E G A C');
		testModel('min5',  'C E♭ F G B♭ C');
		testModel('bmaj5', 'C D F G A C');
		testModel('bmin5', 'C E♭ F A♭ B♭ C');
		testModel('egyp',  'C D F G B♭ C');

		// https://en.wikipedia.org/wiki/In_scale
		testModel('in',    'D Eb G A Bb D', 'D');
		// https://en.wikipedia.org/wiki/Hiraj%C5%8Dshi_scale
		testModel('hira',  'C-E-F♯-G-B');
		// https://en.wikipedia.org/wiki/Iwato_scale
		testModel('iwa',   'D-E♭-G-A♭-C', 'D');
		// https://en.wikipedia.org/wiki/Insen_scale
		testModel('ins',   'D-E♭-G-A-C', 'D');
	});

	describe("hexatonics", () => {
		// https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('maj6', 'C D E F G A C');
		testModel('min6', 'C D E♭ F G A♭ C');

		// https://en.wikipedia.org/wiki/Blues_scale
		testModel('bmaj',  'C D Eb E G A C');
		testModel('bmin',  'C E♭ F F# G B♭ C');

		// https://en.wikipedia.org/wiki/Hexatonic_scale
		testModel('aug',   'C D♯ E G A♭ B C');
		testModel('wtone', 'C D E F♯ G♯ A♯ C');
		testModel('tri',   'C D♭ E G♭ G B♭');
		testModel('2tri',  'C D♭ D F♯ G A♭');
		testModel('prom',  'C D E F♯ A B♭');
	});

	describe("heptatonics", () => {
		// https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('ion',      'C D E F G A B C');
		testModel('dor',      'C D E♭ F G A B♭ C');
		testModel('phry',     'C D♭ E♭ F G A♭ B♭ C');
		testModel('lyd',      'C D E F♯ G A B C');
		testModel('mix',      'C D E F G A B♭ C');
		testModel('aeo',      'C D E♭ F G A♭ B♭ C');
		testModel('locr',     'C D♭ E♭ F G♭ A♭ B♭ C');

		// https://en.wikipedia.org/wiki/Harmonic_major_scale
		testModel('harmaj',   'C D E F G Ab B C');
		// https://en.wikipedia.org/wiki/Double_harmonic_scale
		testModel('dharmaj',  'C Db E F G Ab B C');
		// https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('harmmin',  'C D E♭ F G A♭ B C');
		// https://en.wikipedia.org/wiki/Hungarian_minor_scale
		testModel('dharmmin', 'C D Eb F# G Ab B C');
		// https://en.wikipedia.org/wiki/C_(musical_note)
		testModel('amel',     'C D E♭ F G A B C');
		testModel('dmel',     (a => { a.reverse(); return a; })('C B♭ A♭ G F E♭ D C'.split(/\s+/)).join(' '));

		// https://en.wikipedia.org/wiki/Jazz_scale#Modes_of_the_melodic_minor_scale
		testModel('dorf2',    'C–D♭–E♭–F–G–A–B♭');
		testModel('lydaug',   'C–D–E–F♯–G♯–A–B');
		testModel('lyddom',   'C–D–E–F♯–G–A–B♭');
		testModel('locrs2',   'C–D–E♭–F–G♭–A♭–B♭');
		testModel('alt',      'C–D♭–E♭–F♭–G♭–A♭–B♭');
		// https://en.wikipedia.org/wiki/Phrygian_dominant_scale
		testModel('phrydom',  'C – D♭ – E – F – G – A♭ – B♭ – C');
		// https://en.wikipedia.org/wiki/Double_harmonic_scale#Modes
		testModel('ultphry',  'C Db Eb Fb G G# A C');
		// https://en.wikipedia.org/wiki/Aeolian_dominant_scale
		testModel('aeodom',   'C, D, E, F, G, A♭, B♭');

		// https://en.wikipedia.org/wiki/Neapolitan_scale
		testModel('majneap',  'C  D♭  E♭ F  G  A  B  C');
		testModel('minneap',  'C  D♭  E♭ F  G  A♭ B  C');
		// https://en.wikipedia.org/wiki/Persian_scale
		testModel('pers',     'C, D♭, E, F, G♭, A♭, B, C');
		// https://en.wikipedia.org/wiki/Hungarian_major_scale
		testModel('hungmaj',  'C D♯ E F♯ G A B♭');
		// https://en.wikipedia.org/wiki/Hungarian_minor_scale
		testModel('hungmin',  'C D Eb F# G Ab B C');
		testModel('gypsy',    'C D Eb F# G Ab Bb C');
		// https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
		testModel('ukrdor',   'C D E♭ F♯ G A B♭');
		// https://en.wikipedia.org/wiki/Enigmatic_scale
		testModel('eni',      'C, D♭, E, F♯, G♯, A♯, B, C');
	});

	describe("octatonics", () => {
		// https://en.wikipedia.org/wiki/Octatonic_scale
		testModel('dimhw',      'C C# D# E F# G A Bb C');
		testModel('dimwh',      'C D Eb F F# G# A B C');

		// https://en.wikipedia.org/wiki/Bebop_scale
		testModel('bebdom',     'C D E F G A Bb B C');
		testModel('bebmaj',     'C D E F G G# A B C');
		testModel('bebdor',     'C D Eb E F G A Bb C');
		testModel('bebdoralt',  'C D Eb F G A Bb B C');
		testModel('bebharmin',  'C D Eb F G Ab Bb B C');
		testModel('bebmel',     'C D  Eb F G G# A B C');
	});

	describe("chromatic", () => {
		testModel('chro', 'C C♯ D D♯ E F F♯ G G♯ A B♭ B C');
	});
});

describe("arpeggios", () => {

	describe("triads", () => {
		// https://en.wikipedia.org/wiki/Triad_(music)
		testModel('arp-maj',   'C–E–G');
		testModel('arp-majf5', 'C–E–Gb');
		testModel('arp-min',   'A–C–E',   'A');
		testModel('arp-aug',   'D–F♯–A♯', 'D');
		testModel('arp-dim',   'B–D–F',   'B');
		// https://en.wikipedia.org/wiki/Suspended_chord
		testModel('arp-sus2',  'C–D–G');
		testModel('arp-sus4',  'C–F–G');
	});

	describe("sixth chords", () => {
		// https://en.wikipedia.org/wiki/Sixth_chord
		testModel('arp-maj6',  'C–E–G-A');
		testModel('arp-min6',  'C–Eb–G-A');
		testModel('arp-minf6', 'C–Eb–G-Ab');
	});

	describe("seventh chords", () => {
		// https://en.wikipedia.org/wiki/Dominant_seventh_chord
		testModel('arp-dom7',    'G–B–D–F', 'G');
		// https://en.wikipedia.org/wiki/Dominant_seventh_flat_five_chord
		testModel('arp-dom7f5',  'C–E–G♭–B♭');
		// https://en.wikipedia.org/wiki/Major_seventh_chord
		testModel('arp-maj7',    'C–E–G–B');
		// https://en.wikipedia.org/wiki/Minor_seventh_chord
		testModel('arp-min7',    'C–E♭–G–B♭');
		testModel('arp-minmaj7', 'C–E♭–G–B');
		// https://en.wikipedia.org/wiki/Augmented_seventh_chord
		testModel('arp-aug7',    'C–E–G♯–B♭');
		// https://en.wikipedia.org/wiki/Augmented_major_seventh_chord
		testModel('arp-augmaj7', 'C–E–G♯–B');
		// https://en.wikipedia.org/wiki/Half-diminished_seventh_chord
		testModel('arp-hdim7',   'C–E♭–G♭–B♭');
		// https://en.wikipedia.org/wiki/Diminished_major_seventh_chord
		testModel('arp-dimmaj7', 'C–E♭–G♭–B');
		// https://en.wikipedia.org/wiki/Diminished_seventh_chord
		testModel('arp-dim7',    'C–E♭–G♭–A');
		// https://en.wikipedia.org/wiki/Dominant_seventh_sharp_ninth_chord#Hendrix_chord
		testModel('arp-dom7s9',  'G B D F A♯', 'G');
	});

	describe("ninth chords", () => {
		// testModel('arp-majadd9',  '');
		// testModel('arp-dom9',     '');
		// testModel('arp-dommin9',  '');
		// testModel('arp-domaug9',  '');
		// testModel('arp-maj9',     '');
		// testModel('arp-min9',     '');
		// testModel('arp-minmaj9',  '');
		// testModel('arp-aug9',     '');
		// testModel('arp-augmaj9',  '');
		// testModel('arp-hdim9',    '');
		// testModel('arp-hdimmin9', '');
		// testModel('arp-dim9',     '');
		// testModel('arp-dimmin9',  '');
		// testModel('arp-69',       '');
		// testModel('arp-minf69',   '');
		// testModel('arp-min69',    '');
	});

	describe("eleventh chords", () => {
		// testModel('arp-dom11',     '');
		// testModel('arp-maj11',     '');
		// testModel('arp-majaug11',  '');
		// testModel('arp-min11',     '');
		// testModel('arp-dom911',    '');
		// testModel('arp-maj911',    '');
		// testModel('arp-minmaj11',  '');
		// testModel('arp-min911',    '');
		// testModel('arp-aug911',    '');
		// testModel('arp-augmaj911', '');
		// testModel('arp-hdim911',   '');
		// testModel('arp-dim911',    '');
	});

	describe("thirteenth chords", () => {
		// testModel('arp-dom13',       '');
		// testModel('arp-maj13',       '');
		// testModel('arp-min13',       '');
		// testModel('arp-dom91113',    '');
		// testModel('arp-maj91113',    '');
		// testModel('arp-min91113',    '');
		// testModel('arp-minmaj91113', '');
		// testModel('arp-aug91113',    '');
		// testModel('arp-augmaj91113', '');
		// testModel('arp-hdim91113',   '');
	});
});

/**
 * Helper function to test a single model
 */
function testModel(modelName, notes, tonality = 'C') {
	it(modelName, () => generateModelNotes(modelName, tonality).should.have.ordered.members(parseNotes(notes, tonality)));
}

/**
 * Parse a string of notes into a array of intervals
 */
function parseNotes(notes, tonality) {
	return notes
		.trim()
		.replace(RegExp(`${tonality}$`), '')
		.replace(/[-–,]/g, ' ')
		.trim()
		.replace(/♭/g, 'b')
		.replace(/♯/g, '#')
		.split(/\s+/)
		.map(note => notesValues[note]);
}

/**
 * Return a string containing all the notes
 * of a scale/arpeggio in the C tonality, separated by spaces
 */
function generateModelNotes(modelName, tonality) {
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
