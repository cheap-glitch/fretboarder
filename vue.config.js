
/**
 * vue.config.js
 */

module.exports = {
	productionSourceMap: false,

	devServer: {
		https: true,
		proxy: 'https://localhost:8080',
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
				prependData: `
					@use "@cheap-glitch/scss-mixins/_mixins" as *;

					@use "@/styles/layout" as *;
					@use "sass-mq/_mq" as * with (
						$mq-breakpoints: $mq-breakpoints,
					);

					@use "@/styles/colorscheme" as *;
					@use "@/styles/fonts"       as *;
					@use "@/styles/transitions" as *;
				`
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
						// 404 page
						'empty-set',

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
