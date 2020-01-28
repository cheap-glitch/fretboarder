
/**
 * modules/object.js
 */

export const objectMap     = (object, callback) => Object.keys(object).map(    key => callback(key, object[key]));
export const objectForEach = (object, callback) => Object.keys(object).forEach(key => callback(key, object[key]));
export const isObject      = value               => value && Object.prototype.toString.call(value) == '[object Object]';
export const isEmptyObject = object              => !Object.keys(object).length;
