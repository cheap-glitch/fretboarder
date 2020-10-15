/**
 * Create a new object with the same keys and the result of a callback as values
 */
export function mapObjectToObject(object, callback) {
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, callback(key, value)]));
}

/**
 * Check that a value is an actual object
 */
export function isObject(value) {
	return !!value && Object.prototype.toString.call(value) == '[object Object]';
}
