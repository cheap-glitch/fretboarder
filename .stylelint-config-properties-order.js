const edges = ['top', 'right', 'bottom', 'left'];

const propertiesOrder = {
	contentLayout: [
		'content',
		'display',
		'flex-wrap',
		'grid-auto-rows',
		'grid-auto-columns',
		['grid-template', 'rows', 'columns'],
		'align-items',
		'align-content',
		'flex-direction',
		'justify-content',
		'gap',
		['overflow', 'x', 'y'],
	],
	selfLayout: [
		'position',
		...edges,
		'transform',
		'z-index',
		'flex',
		'align-self',
		'grid-area',
	],
	size: [
		['width',  'min-', 'max-'],
		['height', 'min-', 'max-'],
		'line-height',
	],
	spacing: [
		['margin',  ...edges],
		['padding', ...edges],
	],
	textFormat: [
		'text-align',
		'text-decoration',
		'font-family',
		'font-size',
		'font-weight',
		'font-variant',
	],
	borders: [
		['border', 'width', 'style', 'color', 'radius', ...edges],
		'box-shadow',
	],
	appearance: [
		'appearance',
		'color',
		'fill',
		'opacity',
		['background', 'color'],
		'filter',
	],
	animation: [
		'transition',
	],
	interaction: [
		'pointer-events',
		'cursor',
		'user-select',
		'resize',
	],
};

module.exports = {
	rules: {
		'order/order': [
			'declarations',
			'rules',
			{
				type: 'at-rule',
				name: 'include',
				hasBlock: true,
			}
		],
		'order/properties-order': [
			Object.entries(propertiesOrder).map(([groupName, groupProperties]) => ({
				groupName: groupName.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase()),
				properties: groupProperties.flatMap(prop => Array.isArray(prop)
					? prop.map((subProp, index) => index > 0 ? (subProp.endsWith('-') ? subProp + prop[0] : prop[0] + '-' + subProp) : subProp)
					: [prop]
				),
				noEmptyLineBetween: true,
			})),
			{ unspecified: 'bottom' }
		],
		'order/properties-alphabetical-order': null
	}
}
