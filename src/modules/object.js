
/**
 * modules/object.js
 */

export const objectMap     = (_object, _callback) => Object.keys(_object).map(    __key => _callback(__key, _object[__key]));
export const objectForEach = (_object, _callback) => Object.keys(_object).forEach(__key => _callback(__key, _object[__key]));
export const isObject      = _value               => _value && Object.prototype.toString.call(_value) == '[object Object]';
export const isEmptyObject = _object              => !Object.keys(_object).length;
