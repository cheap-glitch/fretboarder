
/**
 * src/store.js
 */

import Vue           from 'vue';
import Vuex          from 'vuex';

import storage       from '@/modules/storage';

Vue.use(Vuex);
export default new Vuex.Store(
{
	state: {
		instrument:                   storage.get('instrument',             'guitar'),
		tuning:                       storage.get('tuning',                 'standard'),
		fretRange:                    storage.get('fretRange',              [0, 22]),

		isFretboardFlipped:           storage.get('isFretboardFlipped',     false),
		isDisplayingNotesName:        storage.get('isDisplayingNotesName',  false),

		hoveredFretInfos:             [],
	},

	mutations: {
		setInstrument:                (_s, _v) => storage.set('instrument', _s.instrument = _v),
		setTuning:                    (_s, _v) => storage.set('tuning',     _s.tuning     = _v),
		setFretRange:                 (_s, _v) => storage.set('fretRange',  _s.fretRange  = _v),

		toggleIsFretboardFlipped:     _s => storage.set('isFretboardFlipped',    _s.isFretboardFlipped    = !_s.isFretboardFlipped),
		toggleIsDisplayingNotesName:  _s => storage.set('isDisplayingNotesName', _s.isDisplayingNotesName = !_s.isDisplayingNotesName),

		setHoveredFretInfos:          (_s, _v) => _s.hoveredFretInfos = _v,
	},

	// Activate strict mode during development only
	strict: process.env.NODE_ENV !== 'production'
});
