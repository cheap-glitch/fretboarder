
/**
 * modules/pathify.js
 */

import pathify           from 'vuex-pathify'
import { objectForEach } from '@/modules/object'

/**
 * Configure vuex-pathify
 */
pathify.options.deep    = false;
pathify.options.mapping = 'simple';

export default pathify;

/**
 * Generate mutations to toggle every property beginning with 'is'
 */
export function makeTogglers(state)
{
	const togglers = {};

	objectForEach(state, function(key)
	{
		if (/^is[A-Z]/.test(key))
			togglers[`toggleI${key.slice(1)}`] = storeState => storeState[key] = !storeState[key];
	});

	return togglers;
}
