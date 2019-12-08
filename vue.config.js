
/**
 * vue.config.js
 */

module.exports = {

	// Build the app into the 'build' folder
	outputDir: 'build',

	// Disable source maps in production
	productionSourceMap: false,

	/**
	 * CSS-related settings
	 */
	css: {
		// Enable source maps in dev mode
		sourceMap: process.env.NODE_ENV === 'development',

		// Import the colorscheme & mixins globally
		loaderOptions: {
			sass: {
				prependData: [
					'@/styles/mixins',
					'@/styles/colorscheme',
				]
				.map(_file => `@import "${_file}";`)
				.join('\n')
			}
		},
	},

	pluginOptions: {
		fontawesome: {
			component: 'fa-icon',
			imports: [
				{
					set: 'pro-regular',
					icons: [
						// General UI
						'chevron-down',
						'external-link-square-alt',

						// Header
						'adjust',
						'banjo',
						'bug',
						'cog',
						'guitar-electric',
						'guitar',
						'heart',
						'mandolin',

						// Fretboard tools
						'eraser',
						'file-download',
						'hand-paper',
						'info-circle',

						// Scales
						'bullseye',
						'copy',
						'eye',
						'eye-slash',
						'plus-circle',
						'registered',
						'trash-alt',
					]
				},
				{
					set: 'pro-solid',
					icons: [
						// Scales
						'intersection',
					]
				},
				{
					set: 'free-brands',
					icons: [
						'github',
						'twitter',
					]
				},
			]
		},
	},
}
