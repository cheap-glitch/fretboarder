
/**
 * stores/scales.js
 */

import Vue     from 'vue'

import storage from '@/modules/storage'

/**
 * Define the maximum number of scales outside the store
 * to be able to use it anywhere in the code
 */
export const MAX_NB_SCALES = 6;

export default
{
	namespaced: true,

	state: {
		scales:       storage.get('scales', []),
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
		activeScales: _state => _state.scales.filter(_state.scales.some(_scale => _scale.isFocused)
		                                             ? _sc => _sc.isFocused
		                                             : _scale => _scale.isVisible)
	},

	mutations: {
		addScale(_state, _params = {})
		{
			// Limit the number of simultaneous scales
			if (_state.scales.length == MAX_NB_SCALES) return;

			_state.scales.push({
				// Default params
				type:                    'scale',
				model:                   'maj',
				tonality:                'A',
				position:                0,
				highlightedNote:         null,
				isVisible:               true,
				isShowingIntersections:  false,

				// If an ID is provided, duplicate the scale
				...(typeof _params == 'number' ? _state.scales.find(__scale => __scale.id == _params) : _params),

				// Find the first ID & color available
				id:         [...Array(MAX_NB_SCALES + 1).keys()].find(__id => _state.scales.every(__scale => __scale.id != __id)),
				color:      _state.colors.filter(_color => !_state.scales.some(__scale => __scale.color == _color))[0],

				// Always disable focusing to avoid issues
				isFocused:  false,
			});
		},
		removeScale(_state, _id)
		{
			_state.scales = _state.scales.filter(__scale => __scale.id != _id);

			// If there is only one scale left, make sure it doesn't display its intersections
			if (_state.scales.length == 1)
				Vue.set(_state.scales[0], 'isShowingIntersections', false);
		},
		updateScale:      (_state,  _p) => Vue.set(_state.scales.find(__scale => __scale.id == _p.id), _p.prop, _p.value),
		toggleFocusScale: (_state, _id) => _state.scales.forEach(__scale => __scale.isFocused = (__scale.id == _id && !__scale.isFocused)),
		clearScales:      _state        => _state.scales = [],
	}
}
