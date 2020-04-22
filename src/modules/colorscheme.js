
/**
 * modules/colorscheme.js
 */

import colors from '@/styles/colors-export.scss'

export default {

	// UI
	'--color--bg':                        ['snow',            colors.mirage],
	'--color--text':                      ['black',           colors.nepal],
	'--color--text--secondary':           ['gray',            colors.oxfordBlue2],
	'--color--text--disabled':            ['darkgray',        colors.ebonyClay],
	'--color--border':                    ['lightgray',       colors.oxfordBlue],
	'--color--separator':                 ['lightgray',       colors.ebonyClay],

	// Header
	'--color--logo--bg':                  ['lightgray',       colors.oxfordBlue],
	'--color--support-link--text--hover': ['white',           colors.mirage],

	// Fretboard
	'--color--fret--border':              ['gray',            colors.ebonyClay],
	'--color--string--border':            ['black',           colors.oxfordBlue],
	'--color--inlay--bg':                 ['lightgray',       colors.mirage2],
	'--color--scale-tool--bg--hover':     ['#f0f0f0',         colors.ebonyClay2],

	// VSelect
	'--color--select--bg':                ['snow',            colors.mirage2],
	'--color--select--border':            [colors.azure,      colors.oxfordBlue],
	'--color--select--text':              ['black',           colors.nepal],
	'--color--select--chevron':           ['gray',            colors.nepal],
	'--color--select-bar--bg--hover':     ['#eee',            colors.ebonyClay],
	'--color--select-item--bg--hover':    ['#eee',            colors.oxfordBlue],

	// Others
	'--color--vue-tour--bg':              [colors.slateGray,  colors.slateGray],

}
