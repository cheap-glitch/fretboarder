
/**
 * modules/object.js
 */

/**
 * Create a new object with the same keys and the result of a callback as values
 */
export function objectMapToObject(object, callback)
{
	return Object.keys(object).reduce(function(result, key)
	{
		result[key] = callback(key, object[key]);

		return result;
	}, {});
}

/**
 * Check that a value is an actual object
 */
export function isObject(value)
{
	return !!value && Object.prototype.toString.call(value) == '[object Object]';
}
