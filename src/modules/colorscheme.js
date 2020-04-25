
/**
 * modules/colorscheme.js
 */

import colors from '@/styles/colors-export.scss'

export default {

	// UI
	'--color--bg':                        ['snow',       colors.mirage],
	'--color--bg--accent':                ['lightgray',  colors.mirage2],
	'--color--hover':                     [colors.azure, colors.azure],
	'--color--highlight':                 [colors.sun,   colors.sun],

	'--color--text':                      ['black',      colors.nepal],
	'--color--text--secondary':           ['gray',       colors.oxfordBlue2],
	'--color--text--disabled':            ['darkgray',   colors.ebonyClay],

	'--color--border':                    ['lightgray',  colors.oxfordBlue],
	'--color--separator':                 ['lightgray',  colors.ebonyClay],

	// Footer
	'--color--logo--bg':                  ['lightgray',  colors.oxfordBlue],
	'--color--support-link--text--hover': ['white',      colors.mirage],

	// Fretboard
	'--color--fret--border':              ['gray',       colors.ebonyClay],
	'--color--string--border':            ['#222',       colors.oxfordBlue],
	'--color--scale-tool--bg--hover':     ['#f0f0f0',    colors.ebonyClay2],

	// VSelect
	'--color--select--bg':                ['snow',       colors.mirage2],
	'--color--select--border':            [colors.azure, colors.oxfordBlue],
	'--color--select--text':              ['black',      colors.nepal],
	'--color--select--chevron':           ['gray',       colors.nepal],
	'--color--select-bar--bg--hover':     ['#eee',       colors.ebonyClay],
	'--color--select-item--bg--hover':    ['#eee',       colors.oxfordBlue],

}
