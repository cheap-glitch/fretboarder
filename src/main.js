
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
import VueTour       from 'vue-tour'
import VueSlider     from 'vue-slider-component'
import VClickOutside from 'v-click-outside'
import VCSSModifiers from 'vue-css-modifiers'
require('vue-tour/dist/vue-tour.css');

import App           from '@/App'
import store         from '@/stores/main'

/**
 * Register plugins, directives & external components
 */
Vue.use(VueTour);
Vue.component('vue-slider',    VueSlider);
Vue.directive('mods',          VCSSModifiers);
Vue.directive('click-outside', VClickOutside.directive);

/**
 * Register globally the base components
 */
const requireBaseComponents = require.context('@/components', false, /V[A-Z]\w+\.vue$/);
requireBaseComponents.keys().forEach(function(fileName)
{
	const componentConfig = requireBaseComponents(fileName);
	const componentName   = fileName.split('/').pop().replace(/\.\w+$/, '');

	Vue.component(componentName, componentConfig.default || componentConfig);
});

/**
 * Create the Vue instance
 */
new Vue({ store, render: h => h(App) }).$mount('#app');
