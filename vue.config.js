
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
		loaderOptions: {
			sass: {
				prependData: [
					'@cheap-glitch/scss-mixins/_mixins',
					'@/styles/mq',
				]
				.map(stylesheet => `@use "${stylesheet}" as *;`)
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
				'low-vision':               'pro-regular',
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
			productionOnly: true,

			urls: [
				{
					loc: 'https://fretboarder.app',
					changefreq: 'always',
				},
			],
			trailingSlash: false,
		},
	},
}
