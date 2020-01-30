
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

/**
 * State
 */
const state = {
	instrument:             storage.get('instrument',             'guitar',   v => (v in data.instruments)),
	tuning:                 storage.get('tuning',                 'standard', v => (v in data.tuningsNames)),
	fretRange:              storage.get('fretRange',              [0, 22],    v => Array.isArray(v) && v.length == 2),

	isDarkModeOn:           storage.get('isDarkModeOn',           false,      v => typeof v == 'boolean'),
	isDisplayingNotesName:  storage.get('isDisplayingNotesName',  false,      v => typeof v == 'boolean'),
	isFretboardFlipped:     storage.get('isFretboardFlipped',     false,      v => typeof v == 'boolean'),

	hoveredFretInfos:       [],

	/**
	 * Allows v-click-outside to ignore mouseup
	 * events on the fret slider during the help tour
	 */
	isFretRangeSliderClicked: false,
};

/**
 * Getters
 */
const getters = {
	darkMode: state => ({ 'dark-mode': state.isDarkModeOn }),
};

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),

	setInstrument(state, value)
	{
		// Reset the tuning to default when switching between different instruments
		state.tuning     = 'standard';
		state.instrument = value;
	},
};

/**
 * Plugin to automatically save some state properties in the local storage upon certain mutations
 */
const storeOnMutation = store => store.subscribe(function(mutation, state)
{
	const saveUponMutations = {
		// Fretboard settings
		'setTuning':     'tuning',
		'setInstrument': 'instrument',
		'setFretRange':  'fretRange',

		// Various settings
		'toggleIs.+': mutation => `is${mutation.slice(8)}`,

		// Scales
		'scales/(add|update|toggle|remove)Scale': () => ({ name: 'scales', value: state.scales.scales }),
	};

	objectForEach(saveUponMutations, function(key, value)
	{
		// Check that the name of the mutation matches the key
		const rx = new RegExp(`^${key}$`);
		if (!rx.test(mutation.type)) return;

		// Execute the callback to get the prop name or object
		const prop = typeof value == 'function' ? value(mutation.type) : value;

		storage.set(
			isObject(prop) ? prop.name  : prop,
			isObject(prop) ? prop.value : state[prop]
		);
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
	getters,
	mutations,

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
