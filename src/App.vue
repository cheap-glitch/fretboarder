

<!-- src/App.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.App(:style="colorscheme")#app
	router-view
	div#canvas-wrapper(v-show="false")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { mapObjectToObject } from '@/modules/object'
import { colorscheme }       from '@/modules/colorscheme'

import { mediaQueries }      from '@/stores/main'

export default {
	name: 'App',

	computed: {
		colorscheme()
		{
			return mapObjectToObject(colorscheme, (varName, values) => values[this.$store.state.isDarkModeOn ? 1 : 0]);
		},
	},

	created()
	{
		// Add a sequence if there is none at startup
		if (this.$store.state.sequences.sequences.length == 0)
			this.$store.commit('sequences/add');
	},

	mounted()
	{
		// Listen to any changes on the device type and layout orientation
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].addListener(this[mq]));
	},

	destroyed()
	{
		// Clear event listeners
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].removeListener(this[mq]));
	},

	methods: {
		...mapObjectToObject(mediaQueries, mq => (function(event) { this.$store.commit(mq, event.matches); })),
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.App {
	flex: 1 1 auto;

	padding: 20px;

	background-color: var(--color--bg);
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

@use "@cheap-glitch/scss-reset/_reset";
@use "@/styles/global";

</style>
<!--}}}-->
