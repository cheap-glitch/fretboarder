
/**
 * vue.config.js
 */

module.exports = {
	productionSourceMap: false,

	devServer: {
		https: true,
	},

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
					'@cheap-glitch/scss-mixins/_mixins',

					'@/styles/colorscheme',
					'@/styles/fonts',
					'@/styles/transitions',
				]
				.map(file => `@use "${file}" as *;`)
				.join('\n')
			}
		},
	},

	pluginOptions: {

		/**
		 * Font Awesome icons
		 */
		fontawesome: {
			component: 'fa-icon',
			imports: [
				{
					set: 'pro-regular',
					icons: [
						// General UI
						'chevron-down',
						'external-link-square-alt',
						'times-circle',

						// Header
						'banjo',
						'bug',
						'cog',
						'guitar',
						'guitar-electric',
						'heart',
						'mandolin',
						'question-circle',

						// Fretboard tools
						'adjust',
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
						'trash-alt',
					]
				},
				{
					set: 'pro-solid',
					icons: [
						// Scales
						'intersection',

						// Mobile actions
						'cog',
						'list-music',
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

		/**
		 * Sitemap
		 */
		sitemap: {
			urls: [
				{
					loc:         'https://fretboarder.app',
					changefreq:  'always',
				},
			],

			productionOnly: true,
			trailingSlash:  false,
		},
	},
}
