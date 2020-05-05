
/**
 * modules/object.js
 */

export function objectMapToObject(object, callback)
{
	return Object.keys(object).reduce(function(result, key)
	{
		result[key] = callback(key, object[key]);

		return result;
	}, {});
}
