
/**
 * modules/export.js
 */

import { saveAs } from 'file-saver'

import data       from '@/modules/data'
import * as music from '@/modules/music'

/**
 * Helpers functions to generate XML
 */
const getAttrsString  = attrs => Object.keys(attrs).reduce((str, attr) => attrs[attr] ? `${str} ${attr}="${attrs[attr]}"` : str, '');
const openTag         = (xml, tag, attrs) => xml.push(`<${tag}${getAttrsString(attrs)}>`);
const closeTag        = (xml, tag)        => xml.push(`</${tag}>`);
const appendSingleTag = (xml, tag, attrs) => xml.push(`<${tag}${getAttrsString(attrs)} />`);
const appendFullTag   = (xml, tag, innerText, attrs) => { openTag(xml, tag, attrs); xml.push(innerText); closeTag(xml, tag); }

/**
 * Create and save an image of the fretboard
 */
export function exportFretboard(format, ...fretboardParams)
{
	const svg = exportFretboardToSVG.apply(null, fretboardParams);

	switch (format)
	{
		case 'jpg':
		case 'png':
			createCanvasFromSVG(svg.blob, svg.w*10, svg.h*10, canvas => saveAs(canvas.toDataURL(`image/${format}`), `fretboard.${format}`));
			break;

		case 'svg':
			saveAs(svg.blob, 'fretboard.svg');
			break;
	}
}

/**
 * Return a snapshot of the current state of the fretboard in SVG format
 */
function exportFretboardToSVG(nbStrings, fretMin, fretMax, tuning, scales, isFlipped, isDisplayingNotesName, isSizeFixed)
{
	let svg            = [];
	let gradients      = [];

	const nbFrets      = fretMax - fretMin;
	const fbW          = 200;
	const fbH          = (13/3)*nbStrings;
	const fretW        = fbW/nbFrets;
	const fretH        = fbH/(nbStrings - 1);
	const inlaySize    = 1.10;
	const fbInlayFrets = [3, 5, 7, 9, 15, 17, 19, 21];

	const marginTop    = 2;
	const marginBottom = 5;
	const marginLeft   = 1;
	const marginRight  = 4.5;
	const svgW         = fbW + marginRight + marginLeft;
	const svgH         = fbH + marginTop   + marginBottom;

	// Compute the notes of each scale
	scales.forEach(scale => scale.notes = music.generateModelNotes(data[`${scale.type}s`][scale.model].model, scale.tonality));

	// Start the SVG output
	openTag(svg, 'svg', {
		xmlns:   'http://www.w3.org/2000/svg',
		version: '1.2',
		width:   isSizeFixed ? svgW : '',
		height:  isSizeFixed ? svgH : '',
		viewBox: `0 0 ${svgW} ${svgH}`,
	});

	// Embed some basic styles for text
	let textStyles = [
		'.normal { font: 0.12em sans-serif;      }',
		'.bold   { font: bold 0.12em sans-serif; }',
		'.note   { font: bold 0.10em sans-serif; }',
	];
	appendFullTag(svg, 'style', textStyles.join(' '), {});

	// Apply a transformation to flip the whole SVG if needed
	if (isFlipped) openTag(svg, 'g', { 'transform': `scale(-1, 1) translate(-${svgW}, 0)` });

	// Return the y position of a fret
	const getFretY = fret => !fret ? 0 : fretW*((3*nbFrets - 1)/(2*nbFrets - 2) - fret/(nbFrets - 1));

	// Draw the frets
	for (let fret=fretMin, offset=0; fret<=fretMax; fret++)
	{
		// Draw the fret number
		if (fret > 0)
		{
			let x = offset - getFretY(fret)/2 + marginRight;

			// Flip the fret numbers if needed
			if (isFlipped) openTag(svg, 'g', { 'transform': `translate(${svgW}, 0) scale(-1, 1)` });

			appendFullTag(svg, 'text', fret, {
				'x':           isFlipped ? (svgW - x) : x,
				'y':           fbH + marginTop + 4,
				'fill':        '#aaa',
				'class':       fbInlayFrets.includes(fret) ? 'bold' : 'normal',
				'text-anchor': 'middle',
			});

			if (isFlipped) closeTag(svg, 'g');
		}

		// Draw the next fret bar
		offset += getFretY(fret + 1);
		appendSingleTag(svg, 'line', {
			'x1':              offset + marginRight,
			'x2':              offset + marginRight,
			'y1':              marginTop,
			'y2':              fbH + marginTop,
			'stroke':          'gray',
			'stroke-width':    2,
			'vector-effect':   'non-scaling-stroke',
			'shape-rendering': 'crispEdges',
		});

		// Function to draw the inlays
		const drawInlay = y => appendSingleTag(svg, 'circle', {
			'r':     inlaySize,
			'cx':    offset - getFretY(fret)/2 + marginRight,
			'cy':    y + marginTop,
			'fill': '#ddd',
		});

		// Draw the inlays
		if (fbInlayFrets.includes(fret))
		{
			if (nbStrings <= 6)
			{
				drawInlay(fbH/2);
			}
			else if (nbStrings == 7)
			{
				drawInlay(fbH/2 - fretH/2);
				drawInlay(fbH/2 + fretH/2);
			}
			else if (nbStrings == 8)
			{
				drawInlay(fbH/2 - fretH);
				drawInlay(fbH/2 + fretH);
			}
			else
			{
				if (nbStrings % 2 == 0)
				{
					drawInlay(fbH/2 - fretH*2);
					drawInlay(fbH/2 + fretH*2);
				}
				else
				{
					drawInlay(fbH/2 - fretH*3/2);
					drawInlay(fbH/2 + fretH*3/2);
				}
			}
		}
		if (fret == 12)
		{
			if (nbStrings <= 6)
			{
				drawInlay(fbH/2 - fretH);
				drawInlay(fbH/2 + fretH);
			}
			else if (nbStrings == 7)
			{
				drawInlay(fbH/2 - fretH*3/2);
				drawInlay(fbH/2 + fretH*3/2);
			}
			else if (nbStrings == 8)
			{
				drawInlay(fbH/2 - fretH*2);
				drawInlay(fbH/2 + fretH*2);
			}
			else
			{
				if (nbStrings % 2 == 0)
				{
					drawInlay(fbH/2);
					drawInlay(fbH/2 - fretH*3);
					drawInlay(fbH/2 + fretH*3);
				}
				else
				{
					drawInlay(fbH/2 - fretH*5/2);
					drawInlay(fbH/2 + fretH*5/2);
				}
			}
		}
	}

	// Draw the strings
	for (let string=0; string<nbStrings; string++)
	{
		appendSingleTag(svg, 'line', {
			'x1':              marginRight,
			'x2':              fbW + marginRight,
			'y1':              string*fretH + marginTop,
			'y2':              string*fretH + marginTop,
			'stroke-width':    2,
			'stroke':          '#222',
			'shape-rendering': 'crispEdges',
			'vector-effect':   'non-scaling-stroke',
		});
	}

	// Draw the nut
	appendSingleTag(svg, 'line', {
		'x1':              marginRight + .5,
		'x2':              marginRight + .5,
		'y1':              marginTop,
		'y2':              fbH + marginTop,
		'stroke-width':    1,
		'stroke':          '#666',
		'shape-rendering': 'crispEdges',
	});

	// Draw the highlighted notes
	for (let string=1; string<=nbStrings; string++)
	{
		let stringNotes = music.getStringNotes(tuning[nbStrings - string]);

		for (let fret=fretMin, offset=0; fret<=fretMax; fret++)
		{
			let notes = [];

			// Get all the scales to which the note belongs
			scales.forEach((scale, index) => {
				if (scale.notes.includes(stringNotes[fret]))
					notes.push(index);
			});

			if (notes.length)
			{
				// Add a gradient to the list
				if (notes.length > 1) gradients.push(notes);

				let x = (fret == 0) ? 1.8 : offset - getFretY(fret)/2 + marginRight;
				let y = (string - 1)*fretH + marginTop;
				let r = 1.6;

				// Draw the note
				appendSingleTag(svg, 'circle', {
					'r':  r,
					'cx': x,
					'cy': y,

					// If the note belongs to more than one scale, fill it with a gradient
					'fill': (notes.length > 1) ? `url(#lg-${notes.join('-')})` : scales[notes[0]].color,
				});

				// Draw the note name
				if (isDisplayingNotesName)
				{
					// If the fretboard is flipped, flip the text again to render it properly
					if (isFlipped) openTag(svg, 'g', { transform: `translate(${svgW}, 0) scale(-1, 1)` });

					appendFullTag(svg, 'text', data.tonalities[stringNotes[fret]], {
						'x':           isFlipped ? (svgW - x) :  x,
						'y':           y + r/3,
						'fill':        'white',
						'class':       'note',
						'text-anchor': 'middle',
					});

					if (isFlipped) closeTag(svg, 'g');
				}
			}

			offset += getFretY(fret + 1);
		}
	}

	if (isFlipped) closeTag(svg, 'g');

	// Remove duplicate gradients
	let hash = {};
	let list = [];
	gradients.forEach(function(gradient)
	{
		let key = gradient.join('|');
		if (!hash[key])
		{
			list.push(gradient);
			hash[key] = true;
		}
	});
	gradients = list;

	// Create the gradients to fill the notes
	gradients.forEach(function(lg, index)
	{
		openTag(svg, 'linearGradient', { id: `lg-${lg.join('-')}` });

		lg.forEach(scaleIndex => {
			appendSingleTag(svg, 'stop', { 'offset':     `${index*(100/lg.length)}%`, 'stop-color': scales[scaleIndex].color });
			appendSingleTag(svg, 'stop', { 'offset': `${(index+1)*(100/lg.length)}%`, 'stop-color': scales[scaleIndex].color });
		});

		closeTag(svg, 'linearGradient');
	});

	closeTag(svg, 'svg');

	// Create the blob containing the SVG text
	let blob = new Blob([svg.join('')], { type: 'image/svg+xml;charset=utf-8' });

	// Return an object containing the dimensions of the SVG and the blob itself
	return { w: svgW, h: svgH, blob, };
}

/**
 * Create a canvas from a SVG and apply a callback on the result
 */
function createCanvasFromSVG(svg, width, height, callback)
{
	// Create a canvas the size of the SVG
	let canvasWrapper = document.getElementById('canvas-wrapper');
	canvasWrapper.innerHTML = `<canvas width="${width}" height="${height}" id="canvas-export"><canvas>`;

	let canvas  = document.getElementById('canvas-export');
	let context = canvas.getContext('2d');
	let domURL  = window.URL || window.webkitURL || window;
	let url     = domURL.createObjectURL(svg);
	let img     = new Image();

	img.onload = function ()
	{
		// Draw the SVG on a white background
		context.fillStyle = 'white';
		context.fillRect(      0, 0, canvas.width, canvas.height);
		context.drawImage(img, 0, 0, canvas.width, canvas.height);

		// Apply the callback on the resulting canvas
		callback(canvas);

		// Destroy the URL object and remove the canvas
		domURL.revokeObjectURL(url);
		canvasWrapper.removeChild();
	};

	img.src = url;
}
