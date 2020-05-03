
/**
 * stores/fretboard.js
 */

import { make }         from 'vuex-pathify'
import { makeTogglers } from '@/modules/pathify'

import data             from '@/modules/data'
import storage          from '@/modules/storage'

/**
 * State
 */
const state = {
	instrument:            storage.get('fretboard/instrument',            'guitar',   v => (v in data.instruments)),
	tuning:                storage.get('fretboard/tuning',                'standard', v => (v in data.tuningsNames)),
	fretRange:             storage.get('fretboard/fretRange',             [0, 22],    v => Array.isArray(v) && v.length == 2),

	isDisplayingFretNbs:   storage.get('fretboard/isDisplayingFretNbs',   false,      v => typeof v == 'boolean'),
	isDisplayingNotesName: storage.get('fretboard/isDisplayingNotesName', true,       v => typeof v == 'boolean'),
	isFretboardFlipped:    storage.get('fretboard/isFretboardFlipped',    false,      v => typeof v == 'boolean'),
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

export default { namespaced: true, state, mutations }
