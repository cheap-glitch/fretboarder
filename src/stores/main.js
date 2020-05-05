
/**
 * stores/main.js
 */

import Vue                 from 'vue'
import Vuex                from 'vuex'
import { make }            from 'vuex-pathify'
import { getVuexState }    from '@/modules/vuex-plugin-save-state'
import { saveStatePlugin } from '@/modules/vuex-plugin-save-state'

import pathify             from '@/modules/pathify'
import { makeTogglers }    from '@/modules/pathify'

import scales              from '@/stores/scales'
import fretboard           from '@/stores/fretboard'

export const mediaQueries = {
	isMobileDevice:    window.matchMedia('(max-width:   50em)'     ),
	isLayoutLandscape: window.matchMedia('(orientation: landscape)'),
}

/**
 * State
 */
const model = {
	isDarkModeOn: {
		default: window.matchMedia('(prefers-color-scheme: dark)').matches,
		validator: v => typeof v == 'boolean',
	},
	isMobileDevice: {
		saved: false,
		default: mediaQueries.isMobileDevice.matches,
	},
	isLayoutLandscape: {
		saved: false,
		default: mediaQueries.isLayoutLandscape.matches,
	},
};
const state = getVuexState(model);

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),
};

/**
 * Instantiate the store
 */
Vue.use(Vuex);
export default new Vuex.Store({
	plugins: [
		pathify.plugin,
		saveStatePlugin({
			...model,
			scales:    scales.model,
			fretboard: fretboard.model,
		}, {
			namespace:      'fretboarder',
			savedByDefault: true,
		}),
	],

	modules: {
		scales,
		fretboard,
	},

	state, mutations,

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
