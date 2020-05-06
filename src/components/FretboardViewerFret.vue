

<!-- components/FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret(
	v-mods="{ isOpenString, isFirstFret, isOnLastString, isFretboardFlipped, isFretboardVertical }"
	)
	div.note(
		v-mods="{ isActive, isOpenString, isFretboardFlipped }"
		:style="noteBg"
		)
		p.note__name {{ noteName }}
	div.inlay(
		v-show="isShowingInlay"
		)

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
		isStartingFret: {
			type: Boolean,
			default: false,
		},
		isOnLastString: {
			type: Boolean,
			default: false,
		},
		isShowingInlay: {
			type: Boolean,
			default: false,
		},
		isFretboardFlipped: {
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
		isOpenString()
		{
			return this.number == 0;
		},
		isFirstFret()
		{
			return this.number == 1;
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewerFret {
	position: relative;

	border-width: 0;
	border-style: solid;
	border-color: var(--color--border);

	&:not(.is-on-last-string) {
		&.is-fretboard-vertical       { width:  layout.$fret-width; }
		&:not(.is-fretboard-vertical) { height: layout.$fret-width; }
	}

	&.is-fretboard-flipped {
		&:not(.is-open-string) { border-left-width:  layout.$fretbar-thickness; }
		&.is-starting-fret     { border-right-width: layout.$fretbar-thickness; }
		&.is-first-fret        { border-right-width: layout.$nut-thickness;     }
	}

	&:not(.is-fretboard-flipped) {
		&:not(.is-open-string) { border-right-width: layout.$fretbar-thickness; }
		&.is-starting-fret     { border-left-width:  layout.$fretbar-thickness; }
		&.is-first-fret        { border-left-width:  layout.$nut-thickness;     }
	}
}

.note {
	position: absolute;
	z-index: 10;
	@include center-content;

	@include circle(layout.$note-size);

	&.is-open-string {
		top: 0;
		transform: translateY(-50%);

		&.is-fretboard-flipped       { right: 0; }
		&:not(.is-fretboard-flipped) { left:  0; }
	}

	&:not(.is-open-string) {
		transform: translate(-50%, -50%);

		&.is-fretboard-vertical       { top: 50%; left:   0; }
		&:not(.is-fretboard-vertical) { top:   0; left: 50%; }
	}

	&.is-active {
		transition: opacity 0.2s, border-radius 0.2s, filter 0.2s;

		&:hover {
			filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.4));
		}
	}

	&:not(.is-active) {
		border: 2px dashed var(--color--border);

		opacity: 0;
		transition: opacity 0.2s;

		&:hover {
			opacity: 1;
		}
	}
}

.note__name {
	font-weight: bold;

	@at-root .note.is-active       & { color: white; }
	@at-root .note:not(.is-active) & { color: var(--color--text--secondary); }
}

.inlay {
	@include center-position;
	@include circle(15px);

	background-color: var(--color--bg--highlight);
}

</style>
<!--}}}-->
