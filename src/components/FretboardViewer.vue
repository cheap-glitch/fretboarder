

<!-- components/FretboardViewer.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewer

	//- Frets
	FretboardViewerFret(
		v-for="fret in frets"
		:key="'fret--' + fret.number"
		)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { instruments } from '@/modules/music'

export default {
	name: 'FretboardViewer',

	computed: {
		nbStrings()
		{
			return instruments[this.instrument].nbStrings;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewer {
}

</style>
<!--}}}-->
