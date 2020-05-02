
/**
 * stores/main.js
 */

import Vue                         from 'vue'
import Vuex                        from 'vuex'
import { make }                    from 'vuex-pathify'
import pathify, { makeTogglers }   from '@/modules/pathify'

import data                        from '@/modules/data'
import storage                     from '@/modules/storage'
import { isObject, objectForEach } from '@/modules/object'

import scales                      from '@/stores/scales'

export const mediaQueries = {
	isMobileDevice:    window.matchMedia('(max-width:   50em)'     ),
	isLayoutLandscape: window.matchMedia('(orientation: landscape)'),
}

/**
 * State
 */
const state = {
	isMobileDevice:           mediaQueries.isMobileDevice.matches,
	isLayoutLandscape:        mediaQueries.isLayoutLandscape.matches,

	instrument:               storage.get('instrument',            'guitar',   v => (v in data.instruments)),
	tuning:                   storage.get('tuning',                'standard', v => (v in data.tuningsNames)),
	fretRange:                storage.get('fretRange',             [0, 22],    v => Array.isArray(v) && v.length == 2),

	isDisplayingFretNbs:      storage.get('isDisplayingFretNbs',   false,      v => typeof v == 'boolean'),
	isDisplayingNotesName:    storage.get('isDisplayingNotesName', true,       v => typeof v == 'boolean'),
	isFretboardFlipped:       storage.get('isFretboardFlipped',    false,      v => typeof v == 'boolean'),

	isDarkModeOn:             storage.get('isDarkModeOn', window.matchMedia('(prefers-color-scheme: dark)').matches, v => typeof v == 'boolean'),

	/**
	 * Allows v-click-outside to ignore mouseup
	 * events on the fret slider during the help tour
	 */
	isFretRangeSliderClicked: false,
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
 * Automatically save some state properties
 * in the local storage upon certain mutations
 */
const storeOnMutation = store => store.subscribe(function(mutation, state)
{
	const saveUponMutations = {
		// Settings
		'^toggleIs':    mutation => `is${mutation.slice(8)}`,
		'^tuning$':     'tuning',
		'^fretRange$':  'fretRange',
		'^instrument$': ['instrument', 'tuning'],

		// Scales
		'^scales/':     () => ({ name: 'scales', value: state.scales.scales }),
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
	},

	state,
	mutations,

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
