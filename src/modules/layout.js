
/**
 * modules/layout.js
 */

import scssVars              from '@/styles/layout.export.scss'
import { objectMapToObject } from '@/modules/object'

export const layout = objectMapToObject(scssVars, function(_, value)
{
	const numValue = parseInt(value.replace('px', ''), 10);

	return {
		px:  value,
		em:  `${numValue / 16}em`,
		int: numValue,
	};
});
