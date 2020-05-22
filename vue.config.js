
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
				'times-circle':             'pro-regular',

				// Header
				'banjo':                    'pro-regular',
				'bug':                      'pro-regular',
				'external-link-square-alt': 'pro-regular',
				'github':                   'free-brands',
				'guitar':                   'pro-regular',
				'guitar-electric':          'pro-regular',
				'heart':                    'pro-regular',
				'mandolin':                 'pro-regular',
				'moon':                    ['pro-solid', 'pro-regular'],
				'paper-plane':              'pro-regular',
				'sun':                      'pro-solid',
				'twitter':                  'free-brands',

				// Tools & settings
				'file-download':            'pro-regular',
				'hand-paper':               'pro-regular',
				'info-circle':              'pro-regular',
				'list-ol':                  'pro-light',

				// Scales
				'bullseye':                 'pro-regular',
				'copy':                     'pro-regular',
				'eye':                      'pro-regular',
				'eye-slash':                'pro-regular',
				'intersection':             'pro-solid',
				'plus-circle':              'pro-regular',
				'trash-alt':                'pro-regular',

				// Mobile actions
				'cog':                      'pro-solid',
				'list-music':               'pro-solid',
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
