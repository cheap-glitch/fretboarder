
/**
 * vue.config.js
 */

process.env.VUE_APP_TITLE       = 'Fretboarder';
process.env.VUE_APP_BASE_URL    = 'https://fretboarder.app';
process.env.VUE_APP_VERSION     = require('./package.json').version;
process.env.VUE_APP_DESCRIPTION = require('./package.json').description;

module.exports = {

	/**
	 * Dev server
	 * ---------------------------------------------------------------------
	 */
	devServer: {
		https: true,
		host:  'localhost',
		port:  '8080',
	},

	/**
	 * CSS
	 * ---------------------------------------------------------------------
	 */
	productionSourceMap: false,

	css: {
		// Enable source maps in dev mode only
		sourceMap: process.env.NODE_ENV === 'development',

		// Import the mixins in every component
		loaderOptions: { scss: { additionalData: `

			@use "@cheap-glitch/scss-mixins/_mixins" as *;
			@use "@/styles/layout";

			@use "sass-mq/_mq" as * with (
				$mq-breakpoints: (
					desktop: layout.$mq-breakpoint-desktop,
					wide:    layout.$mq-breakpoint-wide,
				)
			);

		`} },
	},

	// Minify the CSS in 'public/index.html'
	chainWebpack: config => config.plugin('html').tap(function(args)
	{
		args[0].minify = {
			collapseWhitespace:            true,
			removeComments:                true,
			removeRedundantAttributes:     true,
			removeScriptTypeAttributes:    true,
			removeStyleLinkTypeAttributes: true,
			useShortDoctype:               true,
			minifyCSS:                     true,
		};

		return args;
	}),

	pluginOptions: {

	/**
	 * Font Awesome icons
	 * ---------------------------------------------------------------------
	 */
	fontawesome: {
		component: 'fa-icon',
		imports: !isModuleAvailable('@fortawesome/pro-regular-svg-icons') ? {} : {
			// General UI
			'arrow-left':               'pro-regular',
			'chevron-down':             'pro-regular',
			'ellipsis-h':               'pro-regular',
			'ellipsis-v':               'pro-regular',
			'minus':                    'pro-regular',

			// Logo
			'banjo':                    'pro-regular',
			'guitar':                   'pro-regular',
			'guitar-electric':          'pro-regular',
			'mandolin':                 'pro-regular',

			// Tools & settings
			'cog':                      'pro-regular',
			'list-music':               'pro-regular',
			'list-ol':                  'pro-regular',
			'info-circle':              'pro-regular',
			'hand-paper':               'pro-regular',
			'file-download':            'pro-regular',
			'file-image':               'pro-regular',
			'image-polaroid':           'pro-regular',
			'sun':                      'pro-regular',
			'moon':                     'pro-regular',

			// Scales
			'plus':                     'pro-regular',
			'trash-alt':                'pro-regular',
			'eye':                      'pro-regular',
			'eye-slash':                'pro-regular',
			'bullseye':                 'pro-regular',
			'intersection':             'pro-solid',
			'copy':                     'pro-regular',
			'times-circle':             'pro-regular',

			// Footer
			'twitter':                  'free-brands',
			'github':                   'free-brands',
			'paper-plane':              'pro-regular',
			'heart':                    'pro-regular',
			'external-link-square-alt': 'pro-regular',
		}
	},

	/**
	 * Sitemap
	 * ---------------------------------------------------------------------
	 */
	sitemap: {
		trailingSlash:  false,
		productionOnly: true,

		baseURL: process.env.VUE_APP_BASE_URL,
		urls: [
			{
				loc:        '/',
				priority:   1.0,
				changefreq: 'always',
			},
		]
	},

	}
}

/**
 * Helper function to check if a module is installed
 */
function isModuleAvailable(name)
{
	try {
		require.resolve(name);
		return true;
	}
	catch(err) {
		return false;
	}

	return false;
}
