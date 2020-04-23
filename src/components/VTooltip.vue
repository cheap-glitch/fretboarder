

<!-- components/VTooltip.vue -->


<!--{{{ Pug -->
<template lang="pug">

transition(name="fade")
	div.VTooltip(v-show="isOpen")
		slot
		div.VTooltip__arrow

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

export default {
	name: 'VTooltip',

	props: {
		isOpen: {
			type: Boolean,
			default: false,
		}
	},

	data() {
		return {
			openingDirection: 'up',
		}
	},

	methods: {
	},
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

@use '@/styles/transitions' as *;

.VTooltip,
.VTooltip__arrow {
	position: absolute;
	z-index: 1000;
}

.VTooltip {
	border-radius: 10px;

	background-color: var(--color--hover);
}

.VTooltip__arrow {
	top: 100%;
	right: 50%;
	transform: translateX(-50%);

	border-color: var(--color--hover);
}

</style>
<!--}}}-->
