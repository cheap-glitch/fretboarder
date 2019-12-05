
/**
 * modules/object.js
 */

export function mapObject(_object, _callback)
{
	return Object.keys(_object).map(__key => _callback(__key, _object[__key]));
}

export function isEmptyObject(_object)
{
	return (Object.keys(_object).length == 0);
}

export function isObject(_value)
{
	return (_value !== null && Object.prototype.toString.call(_value) === '[object Object]');
}
