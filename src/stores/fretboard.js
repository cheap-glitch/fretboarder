
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
	instrument:            storage.get('instrument',            'guitar',   v => (v in data.instruments)),
	tuning:                storage.get('tuning',                'standard', v => (v in data.tuningsNames)),
	fretRange:             storage.get('fretRange',             [0, 22],    v => Array.isArray(v) && v.length == 2),

	isDisplayingFretNbs:   storage.get('isDisplayingFretNbs',   false,      v => typeof v == 'boolean'),
	isDisplayingNotesName: storage.get('isDisplayingNotesName', true,       v => typeof v == 'boolean'),
	isFretboardFlipped:    storage.get('isFretboardFlipped',    false,      v => typeof v == 'boolean'),
};

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),
};

export default { namespaced: true, state, mutations }
