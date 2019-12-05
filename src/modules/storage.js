
/**
 * modules/storage.js
 */

export default
{
	get(_key, _defaultValue)
	{
		let value       = localStorage.getItem(_key);
		let parsedValue = null;

		if (value === null) return _defaultValue;

		try {
			parsedValue = JSON.parse(value);
		}
		catch (e) {
			// Return the default value if the data is not valid JSON
			return _defaultValue;
		}

		return parsedValue;
	},

	set(_key, _value)
	{
		localStorage.setItem(_key, JSON.stringify(_value));
	},

	/**
	 * Check if an array contains a value
	 */
	includes(_key, _value)
	{
		return this.get(_key, []).includes(_value);
	},

	/**
	 * Insert a value into an array and return the new array
	 */
	insert(_key, _value)
	{
		let array = this.get(_key, []);

		// Avoid duplicates
		if (array.indexOf(_value) === -1)
		{
			array.push(_value);
			this.set(_key, array);
		}

		return array;
	},

	/**
	 * Remove a value from an array and return the new array
	 */
	remove(_key, _value)
	{
		let array = this.get(_key, []);

		let newArray = array.filter(_v => _v !== _value);
		this.set(_key, newArray);

		return newArray;
	},
}
