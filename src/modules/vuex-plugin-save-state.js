
/**
 * vuex-plugin-save-state
 */

const defaultOptions = {
	namespace:      'vuex',
	savedByDefault: false,
};

/**
 * Returns a function to instantiate the Vuex plugin
 */
export function saveStatePlugin(stateModel, options = {})
{
	options = { ...defaultOptions, ...(options || {})};

	return function(store)
	{
		// Declare a function to check that a prop has been stored and that the stored value passes validation
		const checkProp = (prop, storedValue) => storedValue && (prop.saved || options.savedByDefault) && (!prop.validator || prop.validator(storedValue));

		// Get the stored state
		let storedState = {};
		try {
			storedState = JSON.parse(localStorage.getItem(options.namespace) || '{}');
		}
		catch (err) {
			storedState = {};
			console.error(err);
		}

		// Filter it and deep merge it with the default state
		store.replaceState(Object.keys(stateModel).reduce(function(newState, key)
		{
			const prop = stateModel[key];

			if (!prop || Object.prototype.toString.call(prop) !== '[object Object]')
				return newState;

			// Property
			if (Object.keys(prop).every(k => ['saved', 'default', 'validator'].includes(k)))
				newState[key] = checkProp(prop, storedState[key]) ? storedState[key] : prop.default;

			// Module
			else newState[key] = Object.keys(prop).reduce((newModule, subkey) => {
				newModule[subkey] = checkProp(prop[subkey], (storedState[key] || {})[subkey]) ? storedState[key][subkey] : prop[subkey].default;
				return newModule;
			}, {});

			return newState;
		}, {}));

		// Subscribe to the store and save the state upon every mutation
		store.subscribe((_, state) => localStorage.setItem(options.namespace, JSON.stringify(state)));
	};
}

/**
 * Take an object of the form [key]: {options}
 * and returns an object of the form [key]: [defaultValue]
 */
export function getVuexState(state)
{
	return Object.keys(state).reduce((result, key) => { result[key] = state[key].default || null; return result; }, {});
}
