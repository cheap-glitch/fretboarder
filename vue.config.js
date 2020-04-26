
/**
 * vue.config.js
 */

module.exports = {
	productionSourceMap: false,

	devServer: {
		https: true,
		host:  'localhost',
		port:  '8080',
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
					'@/styles/mq',
				]
				.map(stylesheet => `@use '${stylesheet}' as *;`)
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
						'arrow-left',
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

						// Tools & settings
						'file-download',
						'hand-paper',
						'info-circle',

						// Scales
						'bullseye',
						'copy',
						'eye',
						'eye-slash',
						'low-vision',
						'plus-circle',
						'trash-alt',
					]
				},
				{
					set: 'pro-solid',
					icons: [
						// Light/dark mode switch
						'moon',
						'sun',

						// Scales
						'intersection',

						// Mobile actions
						'cog',
						'list-music',
					]
				},
				{
					set: 'pro-light',
					icons: [
						// Tools & settings
						'list-ol',
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
					loc:        'https://fretboarder.app',
					changefreq: 'always',
				},
			],

			productionOnly: true,
			trailingSlash:  false,
		},
	},
}
