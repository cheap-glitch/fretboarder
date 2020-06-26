
/**
 * stores/main.js
 */

import Vue                   from 'vue'
import Vuex                  from 'vuex'
import { make }              from 'vuex-pathify'
import { getVuexState }      from '@/modules/vuex-plugin-save-state'
import { saveStatePlugin }   from '@/modules/vuex-plugin-save-state'

import pathify               from '@/modules/pathify'
import { makeTogglers }      from '@/modules/pathify'
import { mapObjectToObject } from '@/modules/object'

import { layout }            from '@/modules/layout'
import sequences             from '@/stores/sequences'
import fretboard             from '@/stores/fretboard'

export const mediaQueries = {
	isMobileDevice:     window.matchMedia(`(max-width:            ${layout.mqBreakpointDesktop.em})`),
	isWideScreen:       window.matchMedia(`(min-width:            ${layout.mqBreakpointWide.em})`),
	isLayoutLandscape:  window.matchMedia('(orientation:          landscape)'),
	isSystemDarkModeOn: window.matchMedia('(prefers-color-scheme: dark)'),
}

/**
 * State
 */
const model = {
	darkModeSetting: {
		default: 'system',
		validator: v => ['light', 'dark', 'system'].includes(v),
	},
	darkModeSystem: {
		saved: false,
		default: mediaQueries.isSystemDarkModeOn.matches,
	},
	...mapObjectToObject(mediaQueries, mq => ({
		saved: false,
		default: mediaQueries[mq].matches,
	})),
};
const state = getVuexState(model);

/**
 * Getters
 */
const getters = {
	isDarkModeOn: state => (state.darkModeSetting == 'system' && state.darkModeSystem) || state.darkModeSetting == 'dark',
};

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
export default new Vuex.Store(
{
	strict: process.env.NODE_ENV !== 'production',

	plugins: [
		pathify.plugin,
		saveStatePlugin({
			...model,
			sequences: sequences.model,
			fretboard: fretboard.model,
		}, {
			namespace: 'fretboarder-3.0',
			savedByDefault: true,
		}),
	],

	modules: {
		sequences,
		fretboard,
	},

	state, getters, mutations,
});
