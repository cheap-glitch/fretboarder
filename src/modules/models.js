import { models } from '@/modules/music.js'

export const modelOptions = [
	{
		label:   'Common scales',
		options: {
			...getModels([
				'maj5',
				'min5',
				'bmin',
				'bmaj',
			]),
			'ion': 'natural major',
			'aeo': 'natural minor',
		}
	},
	{
		label:   'Common arpeggios',
		options: getModels([
			'arp-maj',
			'arp-min',
			'arp-dom7',
		]),
	},
	{
		label:   'Pentatonic scales',
		options: getModels([
			'maj5',
			'egyp',
			'bmin5',
			'bmaj5',
			'min5',
			'in',
			'hira',
			'iwa',
			'ins',
		]),
	},
	{
		label:   'Hexatonic scales',
		options: getModels([
			'maj6',
			'min6',
			'bmin',
			'bmaj',
			'aug',
			'wtone',
			'tri',
			'2tri',
			'prom',
		]),
	},
	{
		label:   'Heptatonic scales',
		options: getModels([
			'ion',
			'dor',
			'phry',
			'lyd',
			'mix',
			'aeo',
			'locr',

			'harmaj',
			// dorf5
			// prhyf4
			// lydf3
			// mixf2
			// lydaugs2
			// locrff7

			'amel',
			'dmel',
			'dorf2',
			'lydaug',
			'lyddom',
			'aeodom',
			'locrs2',
			'alt',

			'harmmin',
			// locr13
			// ions5
			// dors11
			'phrydom',
			// lyds2
			// suplocrff7

			'dharmaj',
			// lyds2s6
			'ultphry',
			'hungmin', // ?
			'hungmaj',
			// orient
			// ions2s5
			// locrff3ff7

			'majneap',
			'minneap',
			'gypsy',
			'pers',
			'ukrdor',
			'eni',
		]),
	},
	{
		label:   'Octatonic scales',
		options: getModels([
			'dimhw',
			'dimwh',

			'bebharmin',
			'bebmaj',

			'bebdom',
			// beblocr
			'bebdor',
			'bebdoralt',
			'bebmel',
		]),
	},
	{
		label:   'Chromatic scale',
		options: getModels(['chro']),
	},
	{
		label:   'Powerchord',
		options: getModels(['arp-pow']),
	},
	{
		label:   'Triads',
		options: getModels([
			'arp-maj',
			'arp-majf5',
			'arp-min',
			'arp-aug',
			'arp-dim',
			'arp-sus2',
			'arp-sus4',
		]),
	},
	{
		label:   'Sixth chords',
		options: getModels([
			'arp-maj6',
			'arp-min6',
			'arp-minf6',
		]),
	},
	{
		label:   'Seventh chords',
		options: getModels([
			'arp-dom7',
			'arp-dom7f5',
			'arp-maj7',
			'arp-min7',
			'arp-minmaj7',
			'arp-aug7',
			'arp-hdim7',
			'arp-dimmaj7',
			'arp-dim7',
			'arp-dom7s9',
		]),
	},
	{
		label:   'Ninth chords',
		options: getModels([
			'arp-majadd9',
			'arp-dom9',
			'arp-dommin9',
			'arp-domaug9',
			'arp-maj9',
			'arp-min9',
			'arp-minmaj9',
			'arp-aug9',
			'arp-augmaj9',
			'arp-hdim9',
			'arp-hdimmin9',
			'arp-dim9',
			'arp-dimmin9',
			'arp-69',
			'arp-minf69',
			'arp-min69',
		]),
	},
	{
		label:   'Eleventh chords',
		options: getModels([
			'arp-dom11',
			'arp-maj11',
			'arp-majaug11',
			'arp-min11',
			'arp-dom911',
			'arp-maj911',
			'arp-minmaj11',
			'arp-min911',
			'arp-aug911',
			'arp-augmaj911',
			'arp-hdim911',
			'arp-dim911',
		]),
	},
	{
		label:   'Thirteenth chords',
		options: getModels([
			'arp-dom13',
			'arp-maj13',
			'arp-min13',
			'arp-dom91113',
			'arp-maj91113',
			'arp-min91113',
			'arp-minmaj91113',
			'arp-aug91113',
			'arp-augmaj91113',
			'arp-hdim91113',
		]),
	},
];

/**
 * Helper function to return an object with the models as keys and their name as values
 */
function getModels(selectedModels) {
	return Object.fromEntries(selectedModels.map(model => [model, models[model].name]));
}
