
/**
 * stores/scales.js
 */

import Vue          from 'vue'

import storage      from '@/modules/storage'
import { isObject } from '@/modules/object'

export const MAX_NB_SCALES = 6;
const defaultScale = {
	id:                     0,
	model:                  'maj',
	position:               0,
	tonality:               'A',
	type:                   'scale',
	color:                  '#0093ee',
	highlightedNote:        null,
	isVisible:              true,
	isFocused:              false,
	isShowingIntersections: false,
};

export default
{
	namespaced: true,

	state: {
		scales:       storage.get('scales', [defaultScale], v => Array.isArray(v) && v.every(item => isObject(item))),
		maxNbScales:  MAX_NB_SCALES,

		colors: [
			'#0093ee',
			'#1bb934',
			'#e54124',
			'#ffb610',
			'#e1112c',
			'#ab7ef6',
		]
	},

	getters: {
		activeScales: state => state.scales.filter(state.scales.some(scale => scale.isFocused)
		                                             ? sc => sc.isFocused
		                                             : scale => scale.isVisible)
	},

	mutations: {
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
				color:      state.colors.filter(color => !state.scales.some(scale => scale.color == color))[0],

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
		updateScale:      (state,  p) => Vue.set(state.scales.find(scale => scale.id == p.id), p.prop, p.value),
		toggleFocusScale: (state, id) => state.scales.forEach(scale => scale.isFocused = (scale.id == id && !scale.isFocused)),
		clearScales:      state        => state.scales = [],
	}
}
