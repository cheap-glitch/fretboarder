
/**
 * modules/object.js
 */

/**
 * Create a new object with the same values but with transformed keys
 */
export function mapObjectKeys(object, callback)
{
	return Object.keys(object).reduce(function(result, key)
	{
		result[callback(key, object[key])] = object[key];

		return result;
	}, {});
}

/**
 * Create a new object with the same keys and the result of a callback as values
 */
export function mapObjectToObject(object, callback)
{
	return Object.keys(object).reduce(function(result, key)
	{
		result[key] = callback(key, object[key]);

		return result;
	}, {});
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
export function filterObject(object, filter)
{
	return Object.keys(object).reduce(function(result, key)
	{
		if (filter(key, object[key]))
			result[key] = object[key];

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
