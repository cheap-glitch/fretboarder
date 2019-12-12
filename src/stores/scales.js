
/**
 * stores/scales.js
 */

import Vue     from 'vue'

import storage from '@/modules/storage'

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
		activeScales: _s => _s.scales.filter(_s.scales.some(_scale => _scale.isFocused)
		                                     ? _sc => _sc.isFocused
		                                     : _scale => _scale.isVisible)
	},

	mutations: {
		addScale: (_s, _params = {}) =>
		{
			// Limit the number of simultaneous scales
			if (_s.scales.length == MAX_NB_SCALES) return;

			_s.scales.push({
				// Default params
				type:                    'scale',
				model:                   'maj',
				tonality:                'A',
				position:                0,
				highlightedNote:         null,
				isVisible:               true,
				isShowingIntersections:  false,

				// If an ID is provided, duplicate the scale
				...(typeof _params == 'number' ? _s.scales.find(__scale => __scale.id == _params) : _params),

				// Find the first ID & color available
				id:         [...Array(MAX_NB_SCALES + 1).keys()].find(__id => _s.scales.every(__scale => __scale.id != __id)),
				color:      _s.colors.filter(_color => !_s.scales.some(__scale => __scale.color == _color))[0],

				// Always disable focusing to avoid issues
				isFocused:  false,
			});
		},
		removeScale: (_s, _id) =>
		{
			_s.scales = _s.scales.filter(__scale => __scale.id != _id);

			// If there is only one scale left, make sure it doesn't display its intersections
			if (_s.scales.length == 1)
				Vue.set(_s.scales[0], 'isShowingIntersections', false);
		},
		updateScale:      (_s,  _p) => Vue.set(_s.scales.find(__scale => __scale.id == _p.id), _p.prop, _p.value),
		toggleFocusScale: (_s, _id) => _s.scales.forEach(__scale => __scale.isFocused = (__scale.id == _id && !__scale.isFocused)),
		clearScales:      _s        => _s.scales = [],
	}
}
