
/**
 * modules/colorscheme.js
 */

export const colors = {
	sun:                        '#ffb610',
	cinnabar:                   '#e54124',
	crimson:                    '#e1112c',
	malachite:                  '#1bb934',
	azure:                      '#0093ee',
	portage:                    '#ab7ef6',

	athensGray:                 '#fafbfc',
	barleyWhite:                '#fff5cd',
	regentStBlue:               '#a9c7df',
	nepal:                      '#8eacc5',

	slateGray:                  '#50596c',
	oxfordBlue2:                '#39475b',
	oxfordBlue:                 '#323e4f',
	ebonyClay2:                 '#283243',
	ebonyClay:                  '#232d3d',
	mirage2:                    '#1c2532',
	mirage:                     '#171e29',
}

export const colorscheme = {
	'--color--bg':              ['white',          colors.mirage],
	'--color--bg--accent':      ['#fcfcfc',        colors.mirage2],
	'--color--bg--highlight':   ['#f2f2f2',        colors.ebonyClay],
	'--color--bg--tooltip':     [colors.slateGray, colors.slateGray],

	'--color--border':          ['lightgray',      colors.oxfordBlue],

	'--color--text':            ['black',          colors.nepal],
	'--color--text--secondary': ['gray',           colors.oxfordBlue2],

	'--color--hover':           [colors.azure,     colors.azure],
	'--color--highlight':       [colors.sun,       colors.sun],
	'--color--red':             [colors.crimson,   colors.crimson],
	'--color--orange':          [colors.cinnabar,  colors.cinnabar],
}

	/*
	'--color--separator':                 ['lightgray',  colors.ebonyClay],

	// Footer
	'--color--logo--bg':                  ['lightgray',  colors.oxfordBlue],
	'--color--support-link--text--hover': ['white',      colors.mirage],

	// Fretboard
	'--color--fret--border':              ['gray',       colors.ebonyClay],
	'--color--string--border':            ['#222',       colors.oxfordBlue],
	*/
