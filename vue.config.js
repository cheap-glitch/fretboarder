
/**
 * vue.config.js
 */

process.env.VUE_APP_VERSION     = require('./package.json').version;
process.env.VUE_APP_DESCRIPTION = require('./package.json').description;

module.exports = {
	productionSourceMap: false,

	devServer: {
		https: true,
		host:  'localhost',
		port:  '8080',
	},

	/**
	 * SCSS
	 */
	css: {
		// Enable source maps in dev mode only
		sourceMap: process.env.NODE_ENV === 'development',

		// Import the mixins in every component
		loaderOptions: { sass: { prependData: `

			@use "@cheap-glitch/scss-mixins/_mixins" as *;
			@use "@/styles/layout";

			@use "sass-mq/_mq" as * with (
				$mq-breakpoints: (
					desktop: layout.$mq-breakpoint-desktop,
				)
			);

		`} },
	},

	pluginOptions: {
		/**
		 * Font Awesome icons
		 */
		fontawesome: {
			component: 'fa-icon',
			imports: {
				// General UI
				'arrow-left':               'pro-regular',
				'chevron-down':             'pro-regular',
				'ellipsis-v':               'pro-regular',
				'minus':                    'pro-regular',

				// Logo
				'banjo':                    'pro-regular',
				'guitar':                   'pro-regular',
				'guitar-electric':          'pro-regular',
				'mandolin':                 'pro-regular',

				// Header
				'twitter':                  'free-brands',
				'github':                   'free-brands',
				'paper-plane':              'pro-regular',
				'heart':                    'pro-regular',
				'external-link-square-alt': 'pro-regular',
				'sun':                      'pro-solid',
				'moon':                     'pro-solid',

				// Tools & settings
				'cog':                      'pro-solid',
				'list-music':               'pro-solid',
				'list-ol':                  'pro-light',
				'info-circle':              'pro-regular',
				'hand-paper':               'pro-regular',
				'file-download':            'pro-regular',

				// Scales
				'eye':                      'pro-regular',
				'eye-slash':                'pro-regular',
				'bullseye':                 'pro-regular',
				'intersection':             'pro-solid',
				'copy':                     'pro-regular',
				'times-circle':             'pro-regular',
				'trash-alt':                'pro-regular',
			}
		},

		/**
		 * Sitemap
		 */
		sitemap: {
			routes:         require('./src/routes.js'),
			trailingSlash:  false,
			productionOnly: true,
		},
	},
}
