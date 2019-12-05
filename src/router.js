
/**
 * router.js
 */

import Vue    from 'vue'
import Router from 'vue-router'

/**
 * Routes
 * -----------------------------------------------------------------------------
 */
let routes = [
	{
		path: '/',
		name: 'home',
		component: loadAsyncComponent('PageFretboarder')
	},
	{
		path: '*',
		name: '404',
		component: loadAsyncComponent('Page404')
	}
];

/**
 * Initialization
 * -----------------------------------------------------------------------------
 */
Vue.use(Router);
export default new Router({
	routes,

	mode: 'history',
	base: process.env.BASE_URL,

	// Reproduce native scrolling behaviour during navigation
	scrollBehavior: (to, from, savedPosition) => savedPosition ? savedPosition : { x: 0, y: 0 }
});

/**
 * Helper
 * -----------------------------------------------------------------------------
 */
function loadAsyncComponent(_component)
{
	return () => import(/* webpackChunkName: "view-[request]" */ `@/components/${_component}`)
}
