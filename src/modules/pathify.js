import pathify from 'vuex-pathify'

// Configure `vuex-pathify`
pathify.options.deep    = false;
pathify.options.mapping = 'simple';
export default pathify;

// Helper to generate "toggle mutations" for every boolean property
export function makeTogglers(stateModel) {
	const togglePropRegex = /^is[A-Z]/;

	return Object.fromEntries(Object.keys(stateModel)
		.filter(prop => togglePropRegex.test(prop))
		.map(prop => [`toggle.${prop}`, state => state[prop] = !state[prop]])
	);
}
