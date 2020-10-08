import Vue                  from 'vue'
import { getVuexState }     from 'vuex-plugin-save-state'

import { MAX_NB_SEQUENCES } from '@/modules/constants'
import { SEQ_COLORS }       from '@/modules/constants'
import { isObject }         from '@/modules/object'

/**
 * State
 */
const model = {
	sequences: {
		default: [],
		validator: v => Array.isArray(v) && v.every(item => isObject(item)),
	},
};
const state = getVuexState(model);

/**
 * Getters
 */
const getters = {
	displayedSequences: state => [].concat(state.sequences.find(seq => seq.isFocused) || state.sequences.filter(seq => seq.isVisible)),
};

/**
 * Mutations
 */
const mutations = {
	add(state) {
		addSequence(state);
	},
	duplicate(state, index) {
		addSequence(state, state.sequences[index]);
	},
	update(state, params) {
		Vue.set(state.sequences[params.index], params.prop, params.value);
	},
	toggleFocus(state, index) {
		state.sequences.forEach((seq, i) => Vue.set(seq, 'isFocused', i == index && !seq.isFocused));
	},
	hideAll(state) {
		state.sequences.forEach(seq => Vue.set(seq, 'isVisible', false));
	},
	remove(state, index) {
		state.sequences.splice(index, 1);

		// Disable showing intersections if there is only one sequence left
		if (state.sequences.length == 1)
			Vue.set(state.sequences[0], 'isIntersected', false);
	},
	removeAll(state) {
		state.sequences = [];
	},
};

/**
 * Helpers
 */
function addSequence(state, params = {}) {
	// Limit the total number of sequences
	if (state.sequences.length >= MAX_NB_SEQUENCES) return;

	state.sequences.push({
		// Give the sequence a "unique" ID
		id:                  Math.random(),

		// Merge the provided parameters with the defaults
		model:               'min5',
		tonality:            'A',
		position:            0,
		...params,

		// Always reset the display parameters
		isVisible:           true,
		isFocused:           false,
		isIntersected:       false,
		highlightedInterval: null,

		// Find the first color available
		color:               SEQ_COLORS.find(color => state.sequences.every(seq => seq.color != color)),
	});
}

export default { namespaced: true, model, state, getters, mutations }
