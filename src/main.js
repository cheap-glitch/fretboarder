
/**
 *   __T__T__T__         _______              __   __                        __
 *  /  @  @  @  \‖======|    ___|.----.-----.|  |_|  |--.-----.---.-.----.--|  |.-----.----.============
 *  |◇          |‖======|    ___||   _|  -__||   _|  _  |  _  |  _  |   _|  _  ||  -__|   _|============
 *  \__@__@__@__/‖======|___|    |__| |_____||____|_____|_____|___._|__| |_____||_____|__|  ============
 *     ⊥  ⊥  ⊥
 *
 * A web app to visualize scales, chords and arpeggios on all kinds of fretboards.
 *
 * Copyright (c) 2019-present, cheap glitch
 * This software is distributed under the GNU LGPL 3.0
 */

import Vue           from 'vue'
import VueRouter     from 'vue-router'
import VClickOutside from 'v-click-outside'
import VCSSModifiers from 'vue-css-modifiers'

import App           from '@/App'
import store         from '@/stores/main'
import routes        from '@/routes'

/**
 * Register plugins, directives & external components
 */
Vue.use(VueRouter);
Vue.directive('mods',          VCSSModifiers);
Vue.directive('click-outside', VClickOutside.directive);

/**
 * Register globally the base components
 */
const baseComponents = require.context('@/components', false, /V[A-Z]\w+\.vue$/);
baseComponents.keys().forEach(function(filename)
{
	const name   = filename.split('/').pop().replace(/\.\w+$/, '');
	const config = baseComponents(filename);

	Vue.component(name, config.default || config);
});

/**
 * Create the router
 */
const router = new VueRouter({
	routes,

	mode: 'history',
	base: process.env.BASE_URL,
});

/**
 * Create the Vue instance
 */
new Vue({ store, router, render: h => h(App) }).$mount('#app');
