
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
export default pathify
pathify.options.mapping = function(_type, _name, _format)
{
	switch(_type)
	{
		case 'getters':   return _name;
		case 'mutations': return _format.camel('set', _name);
		case 'actions':   return _format.camel('set', _name, 'async');
	}

	return _name;
}

/**
 * Generate mutations to toggle every property beginning with 'is'
 */
export function makeTogglers(_state)
{
	const togglers = {};

	objectForEach(_state, function(__key)
	{
		if (/^is[A-Z]/.test(__key))
			togglers[`toggleI${__key.slice(1)}`] = state => state[__key] = !state[__key];
	});

	return togglers;
}
