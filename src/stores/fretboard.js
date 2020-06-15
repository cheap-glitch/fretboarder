
/**
 * stores/fretboard.js
 */

import { make }                      from 'vuex-pathify'
import { getVuexState }              from '@/modules/vuex-plugin-save-state'

import { instruments, tuningsNames } from '@/modules/music'
import { makeTogglers }              from '@/modules/pathify'

/**
 * State
 */
const model = {
	instrument: {
		default: 'guitar',
		validator: v => (v in instruments),
	},
	tuning: {
		default: 'standard',
		validator: v => (v in tuningsNames),
	},
	capo: {
		default: 0,
		validator: v => typeof v == 'number' && v >= 0,
	},
	fretRange: {
		default: [0, 22],
		validator: v => Array.isArray(v) && v.length == 2,
	},
	noteInfos: {
		default: 'name',
		validator: v => typeof v == 'string' && ['none', 'name', 'interval'].includes(v),
	},
	isShowingFretNbs: {
		default: false,
		validator: v => typeof v == 'boolean',
	},
	isShowingNoteNames: {
		default: true,
		validator: v => typeof v == 'boolean',
	},
	isFlipped: {
		default: false,
		validator: v => typeof v == 'boolean',
	},
};
const state = getVuexState(model);

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),

	// Reset the tuning to the default when switching between different instruments
	instrument(state, value)
	{
		state.tuning     = 'standard';
		state.instrument = value;
	},
};

export default { namespaced: true, model, state, mutations }
