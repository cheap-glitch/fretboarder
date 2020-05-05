

<!-- components/FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret(
	v-mods="{ isOnLastString }"
	)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'FretboardViewerFret',

	props: {
		isOnLastString: {
			type: Boolean,
			default: false,
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewerFret {
	position: relative;

	border-right: layout.$fret-thickness solid var(--color--fret);

	&:not(.is-on-last-string) {
		height: layout.$fret-height;
	}
}

</style>
<!--}}}-->
