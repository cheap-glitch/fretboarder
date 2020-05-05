module.exports = {
	root: true,

	env: {
		node: true
	},

	parserOptions: {
		parser: 'babel-eslint'
	},

	extends: [
		'eslint:recommended',
		'plugin:vue/essential',
		'plugin:vue/recommended',
	],

	plugins: [
		'smarter-tabs',
	],

	rules: {
		'no-console':  process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

		'no-mixed-spaces-and-tabs':  ['warn', 'smart-tabs'],
		'smarter-tabs/smarter-tabs': 'warn',
	},

	overrides: [{
		files: ['test/*.test.js'],
		env: {
			mocha: true
		}
	}],
}
