
/**
 * stores/scales.js
 */

import Vue               from 'vue'
import { getVuexState }  from '@/modules/vuex-plugin-save-state'

import { MAX_NB_SCALES } from '@/modules/consts'
import { colors }        from '@/modules/colorscheme'
import { isObject }      from '@/modules/object'

/**
 * Colors
 */
export const SCALES_COLORS = [
	colors.azure,
	colors.malachite,
	colors.cinnabar,
	colors.sun,
	colors.portage,
]

/**
 * State
 */
const model = {
	scales: {
		default: [],
		validator: v => Array.isArray(v) && v.every(item => isObject(item)),
	},
};
const state = getVuexState(model);

/**
 * Getters
 */
const getters = {
	displayedScales: state => state.scales.filter(scale => scale.isVisible),
};

/**
 * Mutations
 */
const mutations = {
	addScale(state)
	{
		addScale(state);
	},
	duplicateScale(state, index)
	{
		addScale(state, state.scales[index]);
	},
	updateScale(state, params)
	{
		Vue.set(state.scales[params.index], params.prop, params.value);
	},
	toggleFocusScale(state, index)
	{
		state.scales.forEach(scale => Vue.set(scale, 'isFocused', (scale.index == index && !scale.isFocused)));
	},
	hideAllScales(state)
	{
		state.scales.forEach(scale => Vue.set(scale, 'isVisible', false));
	},
	removeScale(state, index)
	{
		state.scales = state.scales.filter(scale => scale.index != index);

		// Update the indexes
		state.scales.forEach((scale, index) => Vue.set(scale, 'index', index));

		// Disable showing intersections if there is only one scale left
		if (state.scales.length == 1)
			Vue.set(state.scales[0], 'isIntersected', false);
	},
	removeAllScales(state)
	{
		state.scales = [];
	},
};

/**
 * Helpers
 */
function addScale(state, params = {})
{
	// Limit the total number of scales
	if (state.scales.length >= MAX_NB_SCALES)
		return;

	state.scales.push({
		// Merge the provided params with the defaults
		type:                'scale',
		model:               'maj',
		tonality:            'A',
		position:            0,
		...params,

		// Store the current index
		index:               state.scales.length,

		// Always reset the display parameters
		isVisible:           true,
		isFocused:           false,
		isIntersected:       false,
		highlightedInterval: null,

		// Find the first color available
		color:               SCALES_COLORS.find(color => state.scales.every(scale => scale.color != color)),
	});
}

export default { namespaced: true, model, state, getters, mutations }
