
/**
 * modules/pathify.js
 */

import pathify           from 'vuex-pathify'

import { objectForEach } from '@/modules/object'

/**
 * Set custom mappings for Vuex Pathify:
 *
 * getters    foo
 * mutations  setFoo
 * actions    setFooAsync
 */
pathify.options.mapping = function(type, name, format)
{
	switch(type)
	{
		case 'getters':   return name;
		case 'mutations': return format.camel('set', name);
		case 'actions':   return format.camel('set', name, 'async');
	}

	return name;
}
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
