
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
 * Generate mutations to toggle every property beginning with `is`
 */
export function makeTogglers(stateModel) {
	const togglePropRegex = /^is[A-Z]/;

	return Object.fromEntries(Object.keys(stateModel)
		.filter(prop => togglePropRegex.test(prop))
		.map(prop => [`toggle.${prop}`, state => state[prop] = !state[prop]])
	);
}
