
/**
 * src/routes.js
 */

module.exports = [
	{
		path: '/',
		name: 'home',
		meta: {
			sitemap: {
				priority: 0.8,
				changefreq: 'always',
			}
		},
		component: loadAsyncPage('Home')
	},
	{
		path: '/about',
		name: 'about',
		meta: {
			sitemap: {
				priority: 1.0,
				changefreq: 'monthly',
			}
		},
		component: loadAsyncPage('About')
	}
];

/**
 * Helper function to load a page asynchronously and split it in its own chunk
 */
function loadAsyncPage(page)
{
	return () => import(/* webpackChunkName: "page-[request]" */ `@/pages/${page}`);
}
