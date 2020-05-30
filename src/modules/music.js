
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
	'4th',
	'5♭',
	'5th',
	'6m',
	'6M',
	'7m',
	'7M',
];

/**
 * Models (scales & arpeggios)
 */
export const models = {

	// SCALES

	// Pentatonics & blues
	'maj5':         { intervals: [2,  4,  7,  9],             name: 'major pentatonic'          },
	'min5':         { intervals: [3,  5,  7, 10],             name: 'minor pentatonic'          },
	'majb':         { intervals: [2,  3,  4,  7,  9],         name: 'blues major'               },
	'minb':         { intervals: [3,  5,  6,  7, 10],         name: 'blues minor'               },

	// Naturals
	'maj':          { intervals: [2,  4,  5,  7,  9, 11],     name: 'natural major'             },
	'min':          { intervals: [2,  3,  5,  7,  8, 10],     name: 'natural minor'             },
	'harm':         { intervals: [2,  3,  5,  7,  8, 11],     name: 'harmonic minor'            },
	'mel':          { intervals: [2,  3,  5,  7,  9, 11],     name: 'melodic minor'             },

	// Modes
	'dor':          { intervals: [2,  3,  5,  7,  9, 10],     name: 'dorian'                    },
	'phry':         { intervals: [1,  3,  5,  7,  8, 10],     name: 'phrygian'                  },
	'lyd':          { intervals: [2,  4,  6,  7,  9, 11],     name: 'lydian'                    },
	'mix':          { intervals: [2,  4,  5,  7,  9, 10],     name: 'mixolydian'                },
	'locr':         { intervals: [1,  3,  5,  6,  8, 10],     name: 'locrian'                   },

	// Others
	'wtone':        { intervals: [2,  4,  6,  8, 10],         name: 'whole tone'                },
	'hdim':         { intervals: [1,  3,  4,  6,  7,  9, 10], name: 'diminished (half/whole)'   },
	'wdim':         { intervals: [2,  3,  5,  6,  8,  9, 11], name: 'diminished (whole/half)'   },
	'alt':          { intervals: [1,  3,  4,  6,  8, 10],     name: 'altered'                   },
	'eni':          { intervals: [1,  4,  6,  8, 10, 11],     name: 'enigmatic'                 },

	// ARPEGGIOS

	// Triads
	'arp-maj':      { intervals: [4,  7],                     name: 'major'                     },
	'arp-min':      { intervals: [3,  7],                     name: 'minor'                     },
	'arp-pow':      { intervals: [4],                         name: 'fifth (powerchord)'        },
	'arp-aug':      { intervals: [4,  8],                     name: 'augmented'                 },
	'arp-dim':      { intervals: [3,  6],                     name: 'diminished'                },

	// Sixth chords
	'arp-maj6':     { intervals: [4,  7,  9],                 name: 'major 6th'                 },
	'arp-min6':     { intervals: [3,  7,  9],                 name: 'minor 6th'                 },

	// Seventh chords
	'arp-dom7':     { intervals: [4,  7, 10],                 name: 'dominant 7th'              },
	'arp-dom7f5':   { intervals: [4,  6, 10],                 name: 'dominant 7th flat five'    },
	'arp-maj7':     { intervals: [4,  7, 11],                 name: 'major 7th'                 },
	'arp-min7':     { intervals: [3,  7, 10],                 name: 'minor 7th'                 },
	'arp-minmaj7':  { intervals: [3,  7, 11],                 name: 'minor-major 7th'           },
	'arp-aug7':     { intervals: [4,  8, 10],                 name: 'augmented 7th'             },
	'arp-hdim7':    { intervals: [3,  6, 10],                 name: 'half-diminished 7th'       },
	'arp-dim7':     { intervals: [3,  6,  9],                 name: 'diminished 7th'            },

	// Ninth chords
	'arp-dom9':     { intervals: [2,  4,  7, 10],             name: 'dominant 9th'              },
	'arp-maj9':     { intervals: [2,  4,  7, 11],             name: 'major 9th'                 },
	'arp-min9':     { intervals: [2,  3,  7, 10],             name: 'minor 9th'                 },
	'arp-minmaj9':  { intervals: [2,  3,  7, 11],             name: 'minor-major 9th'           },
	'arp-aug9':     { intervals: [2,  4,  8, 10],             name: 'augmented 9th'             },
	'arp-augmaj9':  { intervals: [2,  4,  8, 11],             name: 'augmented major 9th'       },
	'arp-hdim9':    { intervals: [2,  3,  6, 10],             name: 'half-diminished 9th'       },
	'arp-hdimmin9': { intervals: [1,  3,  6, 10],             name: 'half-diminished minor 9th' },
	'arp-dim9':     { intervals: [2,  3,  6,  9],             name: 'diminished 9th'            },
	'arp-dimmin9':  { intervals: [1,  3,  6,  9],             name: 'diminished minor 9th'      },
	'arp-6-9':      { intervals: [2,  4,  7,  9],             name: '6/9'                       },
	'arp-min6-9':   { intervals: [2,  3,  7,  9],             name: 'minor 6/9'                 },

	// Eleventh chords
	'arp-dom11':    { intervals: [2,  4,  5,  7, 10],         name: 'dominant 11th'             },
	'arp-maj11':    { intervals: [2,  4,  5,  7, 11],         name: 'major 11th'                },
	'arp-minmaj11': { intervals: [2,  3,  5,  7, 11],         name: 'minor-major 11th'          },
	'arp-min11':    { intervals: [2,  3,  5,  7, 10],         name: 'minor 11th'                },
	'arp-aug11':    { intervals: [2,  4,  5,  8, 10],         name: 'augmented 11th'            },
	'arp-augmaj11': { intervals: [2,  4,  5,  8, 11],         name: 'augmented major 11th'      },
	'arp-hdim11':   { intervals: [2,  3,  5,  6, 10],         name: 'half-diminished 11th'      },
	'arp-dim11':    { intervals: [2,  3,  5,  6,  9],         name: 'diminished 11th'           },

	// Thirteenth chords
	'arp-dom13':    { intervals: [2,  4,  5,  7,  9, 10],     name: 'dominant 13th'             },
	'arp-maj13':    { intervals: [2,  4,  5,  7,  9, 11],     name: 'major 13th'                },
	'arp-min13':    { intervals: [2,  3,  5,  7,  9, 10],     name: 'minor 13th'                },
	'arp-minmaj13': { intervals: [2,  3,  5,  7,  9, 11],     name: 'minor-major 13th'          },
	'arp-aug13':    { intervals: [2,  4,  5,  8,  9, 10],     name: 'augmented 13th'            },
	'arp-augmaj13': { intervals: [2,  4,  5,  8,  9, 11],     name: 'augmented major 13th'      },
	'arp-hdim13':   { intervals: [2,  3,  5,  6,  9, 10],     name: 'half-diminished 13th'      },
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
