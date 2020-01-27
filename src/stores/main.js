
/**
 * stores/main.js
 */

import Vue                         from 'vue'
import Vuex                        from 'vuex'
import { make }                    from 'vuex-pathify'
import pathify, { makeTogglers }   from '@/modules/pathify'

import data                        from '@/modules/storage'
import storage                     from '@/modules/storage'
import { isObject, objectForEach } from '@/modules/object'

import scales                      from '@/stores/scales'

/**
 * State
 */
const state = {
	instrument:             storage.get('instrument',             'guitar',   _v => (_v in data.instruments)),
	tuning:                 storage.get('tuning',                 'standard', _v => (_v in data.tuningsNames)),
	fretRange:              storage.get('fretRange',              [0, 22],    _v => Array.isArray(_v) && _v.length == 2),

	isDarkModeOn:           storage.get('isDarkModeOn',           false,      _v => typeof _v == 'boolean'),
	isDisplayingNotesName:  storage.get('isDisplayingNotesName',  false,      _v => typeof _v == 'boolean'),
	isFretboardFlipped:     storage.get('isFretboardFlipped',     false,      _v => typeof _v == 'boolean'),

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
		'toggleIs.+': __mutation => `is${__mutation.slice(8)}`,

		// Scales
		'scales/(add|update|toggle|remove)Scale': () => ({ name: 'scales', value: _state.scales.scales }),
	};

	objectForEach(saveUponMutations, function(__key, __prop)
	{
		// Check that the name of the mutation matches the key
		const rx = new RegExp(`^${__key}$`);
		if (!rx.test(_mutation.type)) return;

		// Execute the callback to get the prop name or object
		const prop = typeof __prop == 'function' ? __prop(_mutation.type) : __prop;

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
