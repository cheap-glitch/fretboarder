const colors = {
	sun:                        '#ffb610',
	cinnabar:                   '#e54124',
	crimson:                    '#e1112c',
	malachite:                  '#1bb934',
	azure:                      '#0093ee',
	portage:                    '#ab7ef6',

	athensGray:                 '#fafbfc',
	snow:                       '#f0f0f0',
	regentStBlue:               '#a9c7df',
	nepal:                      '#8eacc5',

	slateGray:                  '#50596c',
	oxfordBlue2:                '#39475b',
	oxfordBlue:                 '#323e4f',
	ebonyClay2:                 '#283243',
	ebonyClay:                  '#232d3d',
	mirage2:                    '#1c2532',
	mirage:                     '#171e29',
	black:                      '#222222',
};

const colorscheme = {
	'--color--bg':              ['white',              colors.mirage],
	'--color--bg--accent':      [colors.athensGray,    colors.mirage2],
	'--color--bg--highlight':   [colors.snow,          colors.ebonyClay],
	'--color--bg--tooltip':     [colors.slateGray,     colors.slateGray],

	'--color--border':          ['lightgray',          colors.oxfordBlue],
	'--color--drop-shadow':     ['#00000088',          '#000000EE'],

	'--color--text':            [colors.black,         colors.nepal],
	'--color--text--secondary': ['gray',               colors.oxfordBlue2],

	'--color--hover':           [colors.azure,         colors.azure],
	'--color--highlight':       [colors.sun,           colors.sun],

	'--color--string':          [colors.black,         colors.oxfordBlue],
	'--color--fret':            ['darkgray',           colors.ebonyClay],

	'--color--red':             [colors.crimson,       colors.crimson],
	'--color--orange':          [colors.cinnabar,      colors.cinnabar],
};

module.exports = {
	colors,
	colorscheme,
}
