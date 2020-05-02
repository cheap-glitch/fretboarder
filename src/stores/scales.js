
/**
 * stores/scales.js
 */

import Vue          from 'vue'

import storage      from '@/modules/storage'
import { isObject } from '@/modules/object'
import { colors }   from '@/modules/colorscheme'

/**
 * Constants
 */
export const MAX_NB_SCALES = 5;
const COLORS = [
	colors.azure,
	colors.malachite,
	colors.cinnabar,
	colors.sun,
	colors.portage,
]

/**
 * State
 */
const state = {
	scales: storage.get('scales', [], v => Array.isArray(v) && v.every(item => isObject(item))),
};

/**
 * Getters
 */
const getters = {
	activeScales: state => state.scales.filter(state.scales.some(scale => scale.isFocused) ? sc => sc.isFocused : scale => scale.isVisible),
};

/**
 * Mutations
 */
const mutations = {
	addScale(state, params = {})
	{
		// Limit the number of simultaneous scales
		if (state.scales.length == MAX_NB_SCALES) return;

		state.scales.push({
			// Default params
			type:                    'scale',
			model:                   'maj',
			tonality:                'A',
			position:                0,
			highlightedNote:         null,
			isVisible:               true,
			isShowingIntersections:  false,

			// If an ID is provided, duplicate the scale
			...(typeof params == 'number' ? state.scales.find(scale => scale.id == params) : params),

			// Find the first ID & color available
			id:         [...Array(MAX_NB_SCALES + 1).keys()].find(id => state.scales.every(scale => scale.id != id)),
			color:      COLORS.filter(color => !state.scales.some(scale => scale.color == color))[0],

			// Always disable focusing to avoid issues
			isFocused:  false,
		});
	},

	removeScale(state, id)
	{
		state.scales = state.scales.filter(scale => scale.id != id);

		// If there is only one scale left, make sure it doesn't display its intersections
		if (state.scales.length == 1)
			Vue.set(state.scales[0], 'isShowingIntersections', false);
	},

	updateScale:      (state, payload) => Vue.set(state.scales.find(scale => scale.id == payload.id), payload.prop, payload.value),
	toggleFocusScale: (state, id)      => state.scales.forEach(scale => scale.isFocused = (scale.id == id && !scale.isFocused)),

	removeAllScales:  state => state.scales = [],
	hideAllScales:    state => state.scales.forEach(scale => Vue.set(scale, 'isVisible', false)),
};

export default { namespaced: true, state, getters, mutations }
