
/**
 * modules/pathify.js
 */

import pathify from 'vuex-pathify'

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
	return Object.keys(state).reduce(function(togglers, propertyName)
	{
		if (/^is[A-Z]/.test(propertyName))
			togglers[`toggle.${propertyName}`] = storeState => storeState[propertyName] = !storeState[propertyName];

		return togglers;
	}, {});
}
