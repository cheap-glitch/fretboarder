
/**
 * modules/layout.js
 */

import scssVars              from '@/styles/layout.export.scss'
import { objectMapToObject } from '@/modules/object'

export const layout = objectMapToObject(scssVars, (_, value) => ({ px: value, int: parseInt(value.replace('px', ''), 10) }));
