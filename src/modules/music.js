
/**
 * modules/music.js
 */

/**
 * Notes
 */
export const notesNames = {
	'A':  'A',
	'Bb': 'B♭',
	'B':  'B',
	'C':  'C',
	'C#': 'C♯',
	'D':  'D',
	'D#': 'D♯',
	'E':  'E',
	'F':  'F',
	'F#': 'F♯',
	'G':  'G',
	'G#': 'G♯',
};
export const notes = Object.keys(notesNames);

/**
 * Intervals
 */
export const intervalsNames = [
	'Root',
	'Minor second',
	'Major second',
	'Minor third',
	'Major third',
	'Perfect fourth',
	'Diminished fifth',
	'Perfect fifth',
	'Minor sixth',
	'Major sixth',
	'Minor seventh',
	'Major seventh',
];

export const intervalsShortNames = [
	'R',
	'2m',
	'2M',
	'3m',
	'3M',
	'4<sup>th</sup>',
	'5♭',
	'5<sup>th</sup>',
	'6m',
	'6M',
	'7m',
	'7M',
];

/**
 * Scales
 */
export const scales = {
	'maj':   { model: [2,  4,  5,  7,  9, 11],                       name: 'Natural major',           nbNotesPerString: 3 },
	'min':   { model: [2,  3,  5,  7,  8, 10],                       name: 'Natural minor',           nbNotesPerString: 3 },
	'maj5':  { model: [2,  4,  7,  9],                               name: 'Major pentatonic',        nbNotesPerString: 2 },
	'min5':  { model: [3,  5,  7, 10],                               name: 'Minor pentatonic',        nbNotesPerString: 2 },
	'majb':  { model: [2,  3,  4,  7,  9],                           name: 'Blues major',             nbNotesPerString: 3 },
	'minb':  { model: [3,  5,  6,  7, 10],                           name: 'Blues minor',             nbNotesPerString: 3 },
	'harm':  { model: [2,  3,  5,  7,  8, 11],                       name: 'Harmonic minor',          nbNotesPerString: 3 },
	'mel':   { model: [2,  3,  5,  7,  9, 11],                       name: 'Melodic minor',           nbNotesPerString: 3 },
	'dor':   { model: [2,  3,  5,  7,  9, 10],                       name: 'Dorian',                  nbNotesPerString: 3 },
	'phry':  { model: [1,  3,  5,  7,  8, 10],                       name: 'Phrygian',                nbNotesPerString: 3 },
	'lyd':   { model: [2,  4,  6,  7,  9, 11],                       name: 'Lydian',                  nbNotesPerString: 3 },
	'mix':   { model: [2,  4,  5,  7,  9, 10],                       name: 'Mixolydian',              nbNotesPerString: 3 },
	'locr':  { model: [1,  3,  5,  6,  8, 10],                       name: 'Locrian',                 nbNotesPerString: 3 },
	'wtone': { model: [2,  4,  6,  8, 10],                           name: 'Whole tone',              nbNotesPerString: 3 },
	'hdim':  { model: [1,  3,  4,  6,  7,  9, 10],                   name: 'Diminished (half/whole)', nbNotesPerString: 4 },
	'wdim':  { model: [2,  3,  5,  6,  8,  9, 11],                   name: 'Diminished (whole/half)', nbNotesPerString: 4 },
	'alt':   { model: [1,  3,  4,  6,  8, 10],                       name: 'Altered',                 nbNotesPerString: 4 },
	'eni':   { model: [1,  4,  6,  8, 10, 11],                       name: 'Enigmatic',               nbNotesPerString: 4 },
	'chro':  { model: [1,  2,  3,  4,  5,  6,  7,  8,  9,  10,  11], name: 'Chromatic',               nbNotesPerString: 5 },
};

/**
 * Arpeggios
 */
export const arpeggios = {
	// Triads
	'maj':      { model: [4,  7],                  name: 'Major'                                },
	'min':      { model: [3,  7],                  name: 'Minor'                                },
	'pow':      { model: [4],                      name: 'Powerchord (fifth chord)'             },
	'aug':      { model: [4,  8],                  name: 'Augmented'                            },
	'dim':      { model: [3,  6],                  name: 'Diminished'                           },

	// Sixth chords
	'maj6':     { model: [4,  7,  9],              name: 'Major 6<sup>th</sup>'                 },
	'min6':     { model: [3,  7,  9],              name: 'Minor 6<sup>th</sup>'                 },

	// Seventh chords
	'dom7':     { model: [4,  7, 10],              name: 'Dominant 7<sup>th</sup>'              },
	'dom7f5':   { model: [4,  6, 10],              name: 'Dominant 7<sup>th</sup> flat five'    },
	'maj7':     { model: [4,  7, 11],              name: 'Major 7<sup>th</sup>'                 },
	'min7':     { model: [3,  7, 10],              name: 'Minor 7<sup>th</sup>'                 },
	'minmaj7':  { model: [3,  7, 11],              name: 'Minor-Major 7<sup>th</sup>'           },
	'aug7':     { model: [4,  8, 10],              name: 'Augmented 7<sup>th</sup>'             },
	'hdim7':    { model: [3,  6, 10],              name: 'Half-diminished 7<sup>th</sup>'       },
	'dim7':     { model: [3,  6,  9],              name: 'Diminished 7<sup>th</sup>'            },

	// Ninth chords
	'dom9':     { model: [2,  4,  7, 10],          name: 'Dominant 9<sup>th</sup>'              },
	'maj9':     { model: [2,  4,  7, 11],          name: 'Major 9<sup>th</sup>'                 },
	'min9':     { model: [2,  3,  7, 10],          name: 'Minor 9<sup>th</sup>'                 },
	'minmaj9':  { model: [2,  3,  7, 11],          name: 'Minor-Major 9<sup>th</sup>'           },
	'aug9':     { model: [2,  4,  8, 10],          name: 'Augmented 9<sup>th</sup>'             },
	'augmaj9':  { model: [2,  4,  8, 11],          name: 'Augmented major 9<sup>th</sup>'       },
	'hdim9':    { model: [2,  3,  6, 10],          name: 'Half-diminished 9<sup>th</sup>'       },
	'hdimmin9': { model: [1,  3,  6, 10],          name: 'Half-diminished minor 9<sup>th</sup>' },
	'dim9':     { model: [2,  3,  6,  9],          name: 'Diminished 9<sup>th</sup>'            },
	'dimmin9':  { model: [1,  3,  6,  9],          name: 'Diminished minor 9<sup>th</sup>'      },
	'6-9':      { model: [2,  4,  7,  9],          name: '6/9'                                  },
	'min6-9':   { model: [2,  3,  7,  9],          name: 'Minor 6/9'                            },

	// Eleventh chords
	'dom11':    { model: [2,  4,  5,  7, 10],      name: 'Dominant 11<sup>th</sup>'             },
	'maj11':    { model: [2,  4,  5,  7, 11],      name: 'Major 11<sup>th</sup>'                },
	'minmaj11': { model: [2,  3,  5,  7, 11],      name: 'Minor-Major 11<sup>th</sup>'          },
	'min11':    { model: [2,  3,  5,  7, 10],      name: 'Minor 11<sup>th</sup>'                },
	'aug11':    { model: [2,  4,  5,  8, 10],      name: 'Augmented 11<sup>th</sup>'            },
	'augmaj11': { model: [2,  4,  5,  8, 11],      name: 'Augmented major 11<sup>th</sup>'      },
	'hdim11':   { model: [2,  3,  5,  6, 10],      name: 'Half-diminished 11<sup>th</sup>'      },
	'dim11':    { model: [2,  3,  5,  6,  9],      name: 'Diminished 11<sup>th</sup>'           },

	// Thirteenth chords
	'dom13':    { model: [2,  4,  5,  7,  9, 10],  name: 'Dominant 13<sup>th</sup>'             },
	'maj13':    { model: [2,  4,  5,  7,  9, 11],  name: 'Major 13<sup>th</sup>'                },
	'min13':    { model: [2,  3,  5,  7,  9, 10],  name: 'Minor 13<sup>th</sup>'                },
	'minmaj13': { model: [2,  3,  5,  7,  9, 11],  name: 'Minor-Major 13<sup>th</sup>'          },
	'aug13':    { model: [2,  4,  5,  8,  9, 10],  name: 'Augmented 13<sup>th</sup>'            },
	'augmaj13': { model: [2,  4,  5,  8,  9, 11],  name: 'Augmented major 13<sup>th</sup>'      },
	'hdim13':   { model: [2,  3,  5,  6,  9, 10],  name: 'Half-diminished 13<sup>th</sup>'      },
};

/**
 * Instruments
 */
export const instruments = {
	'guitar':    { name: 'Guitar',             nbStrings:  6 },
	'bass':      { name: 'Bass',               nbStrings:  4 },
	'ukulele':   { name: 'Ukulele',            nbStrings:  4 },
	'banjo-4':   { name: 'Banjo (4 strings)',  nbStrings:  4 },
	'banjo-5':   { name: 'Banjo (5 strings)',  nbStrings:  5 },
	'mandolin':  { name: 'Mandolin',           nbStrings:  8 },
	'7-string':  { name: '7-string guitar',    nbStrings:  7 },
	'8-string':  { name: '8-string guitar',    nbStrings:  8 },
	'9-string':  { name: '9-string guitar',    nbStrings:  9 },
	'10-string': { name: '10-string guitar',   nbStrings: 10 },
	'11-string': { name: '11-string guitar',   nbStrings: 11 },
};

/**
 * Tunings
 */
export const tunings = {
	'guitar': {
		'standard':     ['E',  'A',  'D',  'G',  'B',  'E' ],
		'hstep-down':   ['D#', 'G#', 'C#', 'F#', 'Bb', 'D#'],
		'wstep-down':   ['D',  'G',  'C',  'F',  'A',  'D' ],
		'drop-d':       ['D',  'A',  'D',  'G',  'B',  'E' ],
		'drop-c':       ['C',  'G',  'C',  'F',  'A',  'D' ],
		'open-a':       ['E',  'A',  'E',  'A',  'C#', 'E' ],
		'open-c':       ['C',  'G',  'C',  'G',  'C',  'E' ],
		'open-d':       ['D',  'A',  'D',  'F#', 'A',  'D' ],
		'open-dsus4':   ['D',  'A',  'D',  'G',  'A',  'D' ],
		'open-e':       ['E',  'B',  'E',  'G#', 'B',  'E' ],
		'open-f':       ['F',  'A',  'C',  'F',  'C',  'F' ],
		'open-g':       ['D',  'G',  'D',  'G',  'B',  'D' ],
	},
	'bass': {
		'standard':     ['E',  'A',  'D',  'G' ],
		'drop-d':       ['D',  'A',  'D',  'G' ],
		'hstep-down':   ['D#', 'G#', 'C#', 'F#'],
		'wstep-down':   ['D',  'G',  'C',  'F' ],
		'wstep-drop-c': ['C',  'G',  'C',  'F' ],
		'fifths':       ['C',  'G',  'D',  'A' ],
	},
	'ukulele': {
		'standard':     ['G',  'C',  'E',  'A' ],
		'd-tuning':     ['A',  'D',  'F#', 'B' ],
		'baritone':     ['D',  'G',  'B',  'E' ],
		'dorota':       ['E',  'B',  'E',  'A' ],
	},
	'banjo-4': {
		'standard':     ['C',  'G',  'B',  'D' ],
		'chicago':      ['D',  'G',  'B',  'E' ],
		'irish':        ['G',  'D',  'A',  'E' ],
		'open-d':       ['A',  'D',  'A',  'D' ],
		'open-g':       ['D',  'G',  'D',  'G' ],
		'fifths':       ['C',  'G',  'D',  'A' ],
		'fourths':      ['E',  'A',  'D',  'G' ],
	},
	'banjo-5': {
		'standard':     ['G',  'C',  'G',  'B',  'D' ],
		'open-a':       ['A',  'E',  'A',  'C#', 'E' ],
		'open-d':       ['F#', 'D',  'F#', 'A',  'D' ],
		'open-g':       ['G',  'D',  'G',  'B',  'D' ],
		'double-c':     ['G',  'C',  'G',  'C',  'D' ],
		'double-d':     ['A',  'D',  'A',  'D',  'E' ],
		'sawmill':      ['G',  'D',  'G',  'C',  'D' ],
	},
	'mandolin': {
		'standard':     ['G',  'G',  'D',  'D',  'A',  'A',  'E', 'E' ],
	},
	'7-string': {
		'standard':     ['B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'drop-a':       ['A',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'choro':        ['C',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'treble':       ['E',  'A',  'D',  'G',  'B',  'E',  'A' ],
		'russian':      ['D',  'G',  'B',  'D',  'G',  'B',  'D' ],
		'russian-var':  ['C',  'G',  'B',  'D',  'G',  'B',  'D' ],
		'big-guitar':   ['G',  'C',  'E',  'G',  'C',  'E',  'G' ],
	},
	'8-string': {
		'standard':     ['F#', 'B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'pfourth':      ['F#', 'B',  'E',  'A',  'D',  'G',  'C',  'F' ],
		'pf-dropped':   ['E',  'B',  'E',  'A',  'D',  'G',  'C',  'F' ],
		'drop-e':       ['E',  'B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'e6':           ['E',  'C',  'A',  'G',  'E',  'C',  'A',  'F' ],
		'e13':          ['E',  'C#', 'B',  'G#', 'F#', 'E',  'D',  'B' ],
	},
	'9-string': {
		'standard':     ['C#', 'F#', 'B',  'E',  'A',  'D',  'G',  'B',  'E' ],
	},
	'10-string': {
		'standard':     ['E',  'A',  'D',  'G',  'B',  'E',  'A',  'D',  'G',  'B' ],
		'yepes-low':    ['F#', 'G#', 'Bb', 'C',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'yepes-high':   ['E',  'A',  'D',  'G',  'B',  'E',  'C',  'Bb', 'A',  'F#'],
		'baroque':      ['E',  'B',  'G',  'D',  'A',  'E',  'B',  'G',  'D',  'A' ],
		'english':      ['C',  'E',  'G',  'G',  'C',  'C',  'E',  'E',  'G',  'G' ],
	},
	'11-string': {
		'standard':     ['Bb', 'C',  'D',  'D#', 'F',  'G',  'C',  'F',  'Bb', 'D',  'G' ],
	},
};

export const tuningsNames = {
	// Guitar
	'standard':     'Standard tuning',
	'hstep-down':   'Half-step down',
	'wstep-down':   'Whole step down',
	'drop-d':       'Drop D',
	'drop-c':       'Drop C',
	'open-a':       'Open A',
	'open-c':       'Open C',
	'open-d':       'Open D',
	'open-dsus4':   'Open Dsus4',
	'open-e':       'Open E',
	'open-g':       'Open G',
	'open-f':       'Open F',

	// Bass
	'wstep-drop-c': 'Whole step + Drop E',
	'fifths':       'All-fifths',

	// Ukulele
	'd-tuning':     'D tuning',
	'baritone':     'Baritone',
	'dorota':       'Dorota',

	// Banjos
	'chicago':      'Chicago tuning',
	'irish':        'Irish tuning',
	'fourths':      'All-fourths',
	'double-c':     'Double C',
	'double-d':     'Double D',
	'sawmill':      'Sawmill (Mountain modal)',

	// 7-string
	'drop-a':       'Drop A',
	'choro':        'Choro',
	'treble':       'Treble string',
	'russian':      'Russian guitar (Gypsy guitar)',
	'russian-var':  'Russian guitar (variant)',
	'big-guitar':   'Big guitar',

	// 8-string
	'drop-e':       'Drop E',
	'pfourth':      'Perfect fourth',
	'pf-dropped':   'Perfect fourth + Drop E',
	'e6':           'E6',
	'e13':          'E13',

	// 10-string
	'yepes-low':    'Yepes tuning (low)',
	'yepes-high':   'Yepes tuning (high)',
	'baroque':      'Baroque tuning',
	'english':      'English guitar',
};
