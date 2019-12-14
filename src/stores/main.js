
/**
 * stores/main.js
 */

import Vue                         from 'vue'
import Vuex                        from 'vuex'
import { make }                    from 'vuex-pathify'

import storage                     from '@/modules/storage'
import pathify, { makeTogglers }   from '@/modules/pathify'
import { isObject, objectForEach } from '@/modules/object'

import scales                      from '@/stores/scales'

/**
 * State
 */
const state = {
	instrument:             storage.get('instrument',             'guitar'),
	tuning:                 storage.get('tuning',                 'standard'),
	fretRange:              storage.get('fretRange',              [0, 22]),

	isDarkModeOn:           storage.get('isDarkModeOn',           false),
	isDisplayingNotesName:  storage.get('isDisplayingNotesName',  false),
	isFretboardFlipped:     storage.get('isFretboardFlipped',     false),

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
	...make.getters(state),

	darkMode: _state => ({ 'dark-mode': _state.isDarkModeOn }),
};

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),

	setInstrument(_state, _value)
	{
		// Reset the tuning to default when switching between different instruments
		_state.tuning     = 'standard';
		_state.instrument = _value;
	},
};

/**
 * Plugin to automatically save some state properties in the local storage upon certain mutations
 */
const storeOnMutation = _store => _store.subscribe(function(_mutation, _state)
{
	const saveUponMutations = {
		// Fretboard settings
		'setTuning':     'tuning',
		'setInstrument': 'instrument',
		'setFretRange':  'fretRange',

		// Various settings
		'toggleIs.+': _mutation => `is${_mutation.slice(8)}`,

		// Scales
		'(add|update|toggle|remove)Scale': () => ({ name: 'scales', value: _state.scales.scales }),
	};

	objectForEach(saveUponMutations, function(__key, __getProp)
	{
		// Check that the name of the mutation matches the key
		const rx = new RegExp(`^${__key}$`);
		if (!rx.test(_mutation)) return;

		// Execute the callback to get the prop name or object
		const prop = __getProp();

		storage.set(
			isObject(prop) ? prop.name  : prop,
			isObject(prop) ? prop.value : _state[prop]
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
