
/**
 * modules/object.js
 */

/**
 * Create a new object with the same values but with keys modified by a callback
 */
export function mapObjectKeys(object, callback)
{
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [callback(key, value), value]));
}

/**
 * Create a new object with the same keys and the result of a callback as values
 */
export function mapObjectToObject(object, callback)
{
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, callback(key, value)]));
}

/**
 * Create a new array from an object using a callback
 */
export function mapObjectToArray(object, callback)
{
	return Object.keys(object).map(key => callback(key, object[key]));
}

/**
 * Create a new object that only has a subset of the properties of the original, with the same values
 */
export function filterObject(object, objFilter)
{
	return Object.fromEntries(Object.entries(object).filter(([key, value]) => objFilter(key, value)));
}

/**
 * Check that a value is an actual object
 */
export function isObject(value)
{
	return !!value && Object.prototype.toString.call(value) == '[object Object]';
}
