

<!-- FretboardViewerFret.vue -->


<!--{{{ Pug -->
<template lang='pug'>

div.FretboardViewerFret(
	v-mods="{ isFlipped: isFretboardFlipped, isOnLastString, isFirstFret, isOpenString, isFretOne }"
	)

	//- Inlay
	div.FretboardViewerFret__inlay(v-show="isDisplayingInlay")

	//- Open string note placeholder
	div.FretboardViewerFret__open-string-note-placeholder(v-show="fret == 0 && !isActive")

	//- Note
	div.FretboardViewerFret__note(
		v-mods="{ isActive, isRootNote, isOpenString }"
		:style="noteColors"

		@mouseover="emitEvent('mouseover')"
		@mouseout="emitEvent('mouseout')"
		)
		p.FretboardViewerFret__note__info(
			v-show="displayedInfo != 'none'"
			) {{ noteInfo }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import data from '@/modules/data'

export default {
	name: 'FretboardViewerFret',

	props: {
		string: {
			type: Number,
			required: true,
		},
		fret: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
			default: 'A',
			validator: _v => data.notes.includes(_v)
		},
		interval: {
			type: Number,
			default: 0,
		},
		scales: {
			type: Array,
			required: true,
		},
		displayedInfo: {
			type: String,
			default: 'none',
			validator: _v => ['none', 'name', 'degree'].includes(_v)
		},
		nbStrings: {
			type: Number,
			required: true,
		},
		fretMin: {
			type: Number,
			default: 0,
		},
		isRootNote: {
			type: Boolean,
			default: false,
		},
		isDisplayingInlay: {
			type: Boolean,
			default: false,
		},
		isFretboardFlipped: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			noteColors: {},
		}
	},

	computed: {
		noteInfo()
		{
			switch (this.displayedInfo)
			{
				case 'name':   return data.tonalities[this.note];
				case 'degree': return this.interval;

				default:       return '';
			}
		},
		isActive()
		{
			return this.scales.length > 0;
		},
		isOnLastString()
		{
			return this.string == 0;
		},
		isOpenString()
		{
			return this.fret == 0;
		},
		isFretOne()
		{
			return this.fret == 1;
		},
		isFirstFret()
		{
			return this.fretMin == 0 ? (this.fret == 1) : (this.fret == this.fretMin);
		},
	},

	mounted() {
		this.updateNoteColors();
	},

	watch: {
		scales: 'updateNoteColors',
	},

	methods: {
		updateNoteColors()
		{
			if (!this.isActive) return;

			// Build a solid gradient with the colors of every active scale the note belongs to
			const fillingSize   = Math.ceil(100 / this.scales.length);
			const getColorStops = (_scale, _index) => `${_scale.color} ${_index * fillingSize}% ${(_index + 1)*fillingSize}%`;
			this.noteColors     = { background: `linear-gradient(to right, ${this.scales.map(getColorStops)})`};
		},
		emitEvent(_event)
		{
			if (this.isActive) this.$emit(_event);
		},
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang='scss' scoped>

.FretboardViewerFret {
	display: flex;
	justify-content: center;

	position: relative;

	&:not(.is-on-last-string) {
		height: 40px;
	}

	// String
	&:not(.is-open-string) {
		border-top: 2px solid black;
	}

	// Fret
	&:not(.is-open-string):not(.is-on-last-string) {
		&.is-flipped       { border-left:  2px solid gray;  }
		&:not(.is-flipped) { border-right: 2px solid gray;  }
	}

	// Nut
	&.is-first-fret {
		&.is-flipped       { border-right: 2px solid gray;  }
		&:not(.is-flipped) { border-left:  2px solid gray;  }
	}
	&.is-fret-one {
		&.is-flipped       { border-right: 5px solid black; }
		&:not(.is-flipped) { border-left:  5px solid black; }
	}

	&.is-open-string            { justify-content: flex-start;  }
	&.is-open-string.is-flipped { justify-content: flex-end;    }
}

.FretboardViewerFret__note {
	box-sizing: content-box;

	position: absolute;
	transform: translateY(-50%);

	@include square(30px);

	border: 0 solid gold;

	transition: opacity 0.2s, border-radius 0.2s, border-width 0.08s;

	&:not(.is-active) {
		opacity: 0;
	}

	&:not(.is-root-note) {
		border-radius: 50%;
	}

	&.is-active:hover {
		border-width: 4px;
	}
}

// Display a dotted border around unactive open string notes
.FretboardViewerFret__open-string-note-placeholder {
	position: absolute;
	transform: translateY(-50%);

	@include circle(30px);

	border: 2px dashed lightgray;
}

.FretboardViewerFret__note__info {
	@include center-position;

	font-weight: bold;

	color: white;

	cursor: default;
	user-select: none;
}

.FretboardViewerFret__inlay {
	@include center-position;
	@include circle(20px);

	background-color: lightgray;
}

</style>
<!--}}}-->
