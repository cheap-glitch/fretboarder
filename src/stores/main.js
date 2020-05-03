
/**
 * stores/main.js
 */

import Vue               from 'vue'
import Vuex              from 'vuex'
import { make }          from 'vuex-pathify'
import pathify           from '@/modules/pathify'
import { makeTogglers }  from '@/modules/pathify'

import storage           from '@/modules/storage'
import { objectForEach } from '@/modules/object'

import scales            from '@/stores/scales'
import fretboard         from '@/stores/fretboard'

export const mediaQueries = {
	isMobileDevice:    window.matchMedia('(max-width:   50em)'     ),
	isLayoutLandscape: window.matchMedia('(orientation: landscape)'),
}

/**
 * State
 */
const state = {
	isDarkModeOn:      storage.get('isDarkModeOn', window.matchMedia('(prefers-color-scheme: dark)').matches, v => typeof v == 'boolean'),
	isMobileDevice:    mediaQueries.isMobileDevice.matches,
	isLayoutLandscape: mediaQueries.isLayoutLandscape.matches,
};

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),
};

/**
 * Automatically save some properties
 * in the local storage upon certain mutations
 */
const storageMap = {
	main: {
		'^(toggleIs|is)DarkModeOn$': 'isDarkModeOn',
	},
	scales: {
		'.*': 'scales',
	},
	fretboard: {
		'^tuning$':     'tuning',
		'^fretRange$':  'fretRange',
		'^instrument$': ['instrument', 'tuning'],

		'^toggleIs':    mutation => `is${mutation.slice(8)}`,
	},
};
function storeOnMutation(mutation, state)
{
	// Split the mutation type between namespace and name
	const elems     = mutation.type.split('/');
	const namespace = elems.length > 1 ? elems[0] : 'main';
	const name      = elems[elems.length - 1];

	// Check every watcher defined for this namespace
	objectForEach(storageMap[namespace], function(watcher, targets)
	{
		// Check that the name of the mutation matches the key
		const regexp = new RegExp(watcher);
		if (!regexp.test(name)) return;

		// Save every targets in the list
		(Array.isArray(targets) ? targets : [targets]).forEach(function(target)
		{
			const property = (typeof target == 'function') ? target(name) : target;

			storage.set(
				namespace == 'main' ? property        : `${namespace}/${property}`,
				namespace == 'main' ? state[property] : state[namespace][property]
			);
		});
	});
}

/**
 * Instantiate the store
 */
Vue.use(Vuex);
export default new Vuex.Store({
	plugins: [
		pathify.plugin,
		store => store.subscribe(storeOnMutation),
	],

	modules: {
		scales,
		fretboard,
	},

	state, mutations,

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
