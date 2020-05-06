

<!-- components/FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret(v-mods="{ isOpenString, isFirstFret, isOnLastString, isFretboardFlipped, isFretboardVertical }")

	div.inlay(v-show="isShowingInlay")

	div.note(
		ref="note"

		v-mods="{ isActive, isOpenString, isFretboardFlipped, isFretboardVertical }"
		:style="noteBg"

		@mouseenter="mouseenterHandler"
		@mouseleave="mouseleaveHandler"
		)
		p.note__name {{ noteName }}

	VTooltip(
		:target="$refs.note || false"
		:is-open="showTooltip"
		)
		p Hullo!

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
		isFretboardVertical: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			showTooltip: false,
		}
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

	methods: {
		mouseenterHandler()
		{
			if (this.isActive)
				this.showTooltip = true;
		},
		mouseleaveHandler()
		{
			this.showTooltip = false;
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

	/**
	 * Size
	 */
	&.is-fretboard-vertical {
		&.is-on-last-string       { width: 0; }
		&:not(.is-on-last-string) { width: layout.$fret-width; }
	}

	&:not(.is-fretboard-vertical):not(.is-on-last-string) {
		height: layout.$fret-width;
	}

	/**
	 * Borders
	 */
	&.is-fretboard-vertical {
		&:not(.is-open-string)         { border-bottom-width: layout.$fretbar-thickness; }
		&.is-starting-fret             { border-top-width:    layout.$fretbar-thickness; }
		&.is-first-fret                { border-top-width:    layout.$nut-thickness;     }
	}

	&:not(.is-fretboard-vertical) {
		&.is-fretboard-flipped {
			&:not(.is-open-string) { border-left-width:   layout.$fretbar-thickness; }
			&.is-starting-fret     { border-right-width:  layout.$fretbar-thickness; }
			&.is-first-fret        { border-right-width:  layout.$nut-thickness;     }
		}

		&:not(.is-fretboard-flipped) {
			&:not(.is-open-string) { border-right-width:  layout.$fretbar-thickness; }
			&.is-starting-fret     { border-left-width:   layout.$fretbar-thickness; }
			&.is-first-fret        { border-left-width:   layout.$nut-thickness;     }
		}
	}
}

.note {
	position: absolute;
	z-index: 10;
	@include center-content;

	@include circle(layout.$note-size);

	/**
	 * Display
	 */
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

	/**
	 * Placement
	 */
	&.is-fretboard-vertical {
		left: 0;

		&.is-open-string {
			top: 0;
			transform: translateX(-50%);
		}

		&:not(.is-open-string) {
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	&:not(.is-fretboard-vertical) {
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
