
/**
 * stores/main.js
 */

import Vue                         from 'vue'
import Vuex                        from 'vuex'
import { make }                    from 'vuex-pathify'
import pathify, { makeTogglers }   from '@/modules/pathify'

import storage                     from '@/modules/storage'
import { isObject, objectForEach } from '@/modules/object'

import scales                      from '@/stores/scales'
import fretboard                   from '@/stores/fretboard'

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

	// Reset the tuning to default when switching between different instruments
	instrument(state, value)
	{
		state.tuning     = 'standard';
		state.instrument = value;
	},
};

/**
 * Automatically save some properties
 * in the local storage upon certain mutations
 */
const storeOnMutation = store => store.subscribe(function(mutation, state)
{
	const saveUponMutations = {
		// Settings
		'^toggleIs': mutation => `is${mutation.slice(8)}`,

		// Fretboard settings
		'^fretboard/tuning$':     'tuning',
		'^fretboard/fretRange$':  'fretRange',
		'^fretboard/instrument$': ['instrument', 'tuning'],

		// Scales
		'^scales/': () => ({ name: 'scales', value: state.scales.scales }),
	};

	objectForEach(saveUponMutations, function(key, value)
	{
		// Check that the name of the mutation matches the key
		const rx = new RegExp(key);
		if (!rx.test(mutation.type)) return;

		(Array.isArray(value) ? value : [value]).forEach(function(setting)
		{
			const prop = (typeof setting == 'function') ? setting(mutation.type) : setting;

			storage.set(
				isObject(prop) ? prop.name  : prop,
				isObject(prop) ? prop.value : state[prop]
			);
		});
	});
});

/**
 * Instantiate the store
 */
Vue.use(Vuex);
export default new Vuex.Store({
	plugins: [
		pathify.plugin,
		storeOnMutation,
	],

	modules: {
		scales,
		fretboard,
	},

	state, mutations,

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
