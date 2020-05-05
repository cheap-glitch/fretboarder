

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

export default {
	name: 'FretboardViewer',

	computed: {
		nbStrings()
		{
			return data.instruments[this.instrument].nbStrings;
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
