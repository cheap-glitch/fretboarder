
/**
 * modules/layout.js
 */

import scssVars              from '@/styles/layout.export.scss'
import { mapObjectToObject } from '@/modules/object'

export const layout = mapObjectToObject(scssVars, function(_, value) {
	const numValue = parseInt(value.replace('px', ''), 10);

	return {
		px:  value,
		em:  `${numValue / 16}em`,
		int: numValue,
	};
});
