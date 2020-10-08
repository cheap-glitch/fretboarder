/**
 * Add the proper counter to a fret number
 */
export function formatFretNb(number) {
	if (number == 0)
		return 'Open strings';

	if (11 <= number && number <= 13)
		return `${number}th fret`;

	switch (`${number}`.slice(-1)) {
		case '1': return `${number}st fret`;
		case '2': return `${number}nd fret`;
		case '3': return `${number}rd fret`;
		default:  return `${number}th fret`;
	}
}

/**
 * Wrap the ordinal suffix of a number in a string inside a <sup> tag
 */
export function formatOrdinalSuffix(str) {
	return str.replace(/(\d)(st|nd|rd|th)/, '$1<sup>$2</sup>');
}
