process.env.VUE_APP_TITLE       = 'Fretboarder';
process.env.VUE_APP_BASE_URL    = 'https://fretboarder.app';
process.env.VUE_APP_VERSION     = require('./package.json').version;
process.env.VUE_APP_DESCRIPTION = require('./package.json').description;

module.exports = {

	productionSourceMap: false,

	devServer: {
		https: true,
		host: 'localhost',
		port: '8080',
	},

	css: {
		// Enable source maps in dev mode only
		sourceMap: process.env.NODE_ENV === 'development',

		// Import the mixins in every component
		loaderOptions: {
			scss: {
				additionalData: `
					@use "@cheap-glitch/scss-mixins/_mixins" as *;
					@use "@/styles/layout";

					@use "sass-mq/_mq" as * with (
						$mq-breakpoints: (
							desktop: layout.$mq-breakpoint-desktop,
							wide:    layout.$mq-breakpoint-wide,
						)
					);
				`
			}
		}
	},

	chainWebpack: config => {

		// Minify the CSS in `public/index.html`
		config.plugin('html').tap(args => {
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
		});

		// Enable tests coverage
		if (process.env.NODE_ENV === 'test') {
			config.module.rule('js')
				.test(/\.js$/)
				.use('istanbul-instrumenter-loader')
				.loader('istanbul-instrumenter-loader')
				.options({ esModules: true });
		}
	},

	pluginOptions: {

		// Stylelint
		lintStyleOnBuild: true,

		// Font Awesome icons
		fontawesome: {
			component: 'fa-icon',
			imports: !isModuleAvailable('@fortawesome/pro-regular-svg-icons') ? {} : {
				// General UI
				'arrow-left':               'pro-regular',
				'chevron-down':             'pro-regular',
				'chevron-up':               'pro-regular',
				'ellipsis-h':               'pro-regular',

				// Instruments
				'banjo':                    'pro-regular',
				'guitar':                   'pro-regular',
				'guitar-electric':          'pro-regular',
				'mandolin':                 'pro-regular',

				// Tools & settings
				'arrow-circle-up':          'pro-regular',
				'arrows-v':                 'pro-regular',
				'cog':                      'pro-regular',
				'desktop':                  'pro-regular',
				'desktop-alt':              'pro-regular',
				'file-download':            'pro-regular',
				'file-image':               'pro-regular',
				'hand-paper':               'pro-regular',
				'image-polaroid':           'pro-regular',
				'info-circle':              'pro-regular',
				'list-music':               'pro-regular',
				'list-ol':                  'pro-regular',
				'moon':                     'pro-regular',
				'music':                    'pro-regular',
				'sun':                      'pro-regular',

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

		// Sitemap
		sitemap: {
			trailingSlash:  false,
			productionOnly: true,

			baseURL: process.env.VUE_APP_BASE_URL,
			urls: [{
				loc:        '/',
				priority:   1.0,
				changefreq: 'always',
			}]
		},
	}
}

function isModuleAvailable(name) {
	try { require.resolve(name) } catch(_err) { return false; }
	return true;
}
