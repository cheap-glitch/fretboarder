
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
	isMobileDevice:    window.matchMedia(`(max-width:   ${layout.mqBreakpointDesktop.em})`),
	isWideScreen:      window.matchMedia(`(min-width:   ${layout.mqBreakpointWide.em})`),
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
	...mapObjectToObject(mediaQueries, mq => ({
		saved: false,
		default: mediaQueries[mq].matches,
	})),
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

	state, mutations,
});
