
/**
 * stores/scales.js
 */

import storage           from '@/modules/storage'
import { isEmptyObject } from '@/modules/object'

export default
{
	namespaced: true,

	state: {
		scales:       storage.get('scales', []),
		maxNbScales:  6,

		nextScaleID:  0,
	},

	getters: {
		nextColor: _s =>
		{
			return [
				'#0093ee',
				'#1bb934',
				'#e54124',
				'#ffb610',
				'#e1112c',
				'#ab7ef6',
			].filter(_color => !_s.scales.some(__scale => __scale.color == _color))[0];
		},
		activeScales: _s =>
		{
			return _s.scales.filter(_s.scales.some(_scale => _scale.isFocused)
			                        ? _sc => _sc.isFocused
			                        : _scale => _scale.isVisible);
		},
	},

	setters: {
		addScale: _s => (_params = {}) =>
		{
			// Limit the number of simultaneous scales
			if (_s.scales.length == _s.maxNbScales) return;

			_s.scales.push({
				id:         ++_s.nextScaleID,
				color:      _s.nextColor,
				isFocused:  false,

				...(
					!isEmptyObject(_params)
					? _params
					: {
						type:                    'scale',
						model:                   'maj',
						tonality:                'A',
						position:                0,
						highlightedNote:         null,
						isVisible:               true,
						isShowingIntersections:  false,
					}
				)
			});
		},
		duplicateScale:   _s => _id => _s.commit('scales/addScale', {..._s.scales.filter(__scale => __scale.id == _id)[0]}),
		removeScale:      _s => _id => _s.scales = _s.scales.filter(__scale => __scale.id != _id),
		toggleFocusScale: _s => _id => _s.scales.forEach(__scale => __scale.isFocused = (__scale.id == _id && !__scale.isFocused)),
		updateScaleProp:  _s =>  _p => _s.scales[_s.scales.findIndex(__scale => __scale.id = _p.id)][_p.prop] = _p.value,
	}
}
