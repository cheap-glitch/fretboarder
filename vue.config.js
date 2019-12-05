
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
						'cog',
						'guitar',
						'heart',
						'mandolin',

						// Fretboarder
						'bullseye',
						'copy',
						'eraser',
						'eye',
						'eye-slash',
						'file-download',
						'hand-paper',
						'info-circle',
						'plus-circle',
						'registered',
						'trash-alt',
					]
				},
			]
		},
	},
}
