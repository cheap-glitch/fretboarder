
/**
 * fretboarder
 *
 * A  web  app  to  visualize  scales, chords  and  arpeggios  on all  kinds  of
 * fretboards.
 *
 * Copyright (c) 2019-present, cheap glitch
 *
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either  version 3 of the  License, or (at your  option) any later
 * version.
 *
 * This program is distributed  in the hope that it will  be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR  A PARTICULAR  PURPOSE.  See  the GNU  General  Public  License for  more
 * details.
 *
 * You should have received a copy of  the GNU General Public License along with
 * this program. If not, see <https://www.gnu.org/licenses/>.
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
