

<!-- components/FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret(
	v-mods="{ isOpenString, isOnLastString }"
	)
	div.note(
		v-mods="{ isActive }"
		:style="noteBg"
		)
		p.note__name {{ noteName }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { notesNames } from '@/modules/music'

export default {
	name: 'FretboardViewerFret',

	props: {
		note: {
			type: String,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
		string: {
			type: Number,
			required: true,
		},
		scales: {
			type: Array,
			required: true,
		},
		scalesColors: {
			type: Array,
			required: true,
		},
		isOpenString: {
			type: Boolean,
			default: false,
		},
		isOnLastString: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		noteBg()
		{
			if (!this.isActive) return { 'background-color': 'var(--color--bg)' };

			// Build a solid gradient with the colors of every scale the fret note belongs to
			const stripeWidth = Math.ceil(100 / this.scales.length);
			const gradient    = this.scales.map((scale, index) => `${this.scalesColors[scale.index]} ${index*stripeWidth}% ${(index + 1)*stripeWidth}%`);

			return { background: `linear-gradient(-45deg, ${gradient})` };
		},
		noteName()
		{
			return notesNames[this.note];
		},
		isActive()
		{
			return this.scales.length > 0;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewerFret {
	position: relative;

	&:not(.is-open-string) {
		border-right: layout.$fretbar-thickness solid var(--color--fret);
	}

	&:not(.is-on-last-string) {
		height: layout.$fret-width;
	}
}

.note {
	position: absolute;
	z-index: 10;
	@include center-content;

	@include circle(30px);

	&:not(.is-open-string) {
		transform: translate(-50%, -50%);

		&.is-fretboard-vertical       { top: 50%; left:   0; }
		&:not(.is-fretboard-vertical) { top:   0; left: 50%; }
	}

	&.is-active {
	}

	&:not(.is-active) {
		opacity: 0;
	}
}

.note__name {
	font-weight: bold;

	@at-root .note.is-active       & { color: white; }
	@at-root .note:not(.is-active) & { color: var(--color--text--secondary); }
}

</style>
<!--}}}-->
