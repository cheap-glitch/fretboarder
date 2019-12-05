
/**
 * modules/export.js
 */

import jsPDF      from 'jspdf'
import { saveAs } from 'file-saver'

import xml        from '@/modules/xml'
import data       from '@/modules/data'
import {
	generateModelNotes,
	getStringNotes,
} from '@/modules/music'

/**
 * Create and export a PDF from a SVG
 */
export function exportSVGToPDF(_svg)
{
	createCanvasFromSVG(_svg.blob, _svg.w*20, _svg.h*20, function(_canvas)
	{
		// Create a landscape-oriented A4-sized PDF (units are in milimeters)
		let pdf = new jsPDF({ orientation: 'landscape' });

		// Insert the canvas in the PDF and save it
		pdf.addImage(_canvas, 'PNG', 0, 0, 297, (_canvas.height*297)/_canvas.width, 'NONE', 0);
		pdf.save('fretboard.pdf');
	});
}

/**
 * Create and save an image (PNG or JPEG format) from a SVG using a canvas
 */
export function exportSVGToImage(_svg, _format)
{
	// Create a canvas & export it as an image
	createCanvasFromSVG(_svg.blob, _svg.w*10, _svg.h*10, _canvas => saveAs(_canvas.toDataURL(`image/${_format}`), `fretboard.${_format}`));
}

/**
 * Create a canvas from a SVG and apply a callback to the result
 */
export function createCanvasFromSVG(_SVGBlob, _canvasW, _canvasH, _callback)
{
	// Create a canvas the size of the SVG
	let canvasWrapper = document.getElementById('canvas-wrapper');
	canvasWrapper.innerHTML = `<canvas width="${_canvasW}" height="${_canvasH}" id="canvas-export"><canvas>`;

	let canvas  = document.getElementById('canvas-export');
	let context = canvas.getContext('2d');
	let domURL  = window.URL || window.webkitURL || window;
	let url     = domURL.createObjectURL(_SVGBlob);
	let img     = new Image();

	img.onload = function ()
	{
		// Draw the SVG on a white background
		context.fillStyle = 'white';
		context.fillRect(      0, 0, canvas.width, canvas.height);
		context.drawImage(img, 0, 0, canvas.width, canvas.height);

		// Apply the callback on the resulting canvas
		_callback(canvas);

		// Destroy the URL object and remove the canvas
		domURL.revokeObjectURL(url);
		canvasWrapper.removeChild();
	};

	img.src = url;
}

/**
 * Return a SVG drawing the current state of the fretboard
 */
export function exportFretboardToSVG(_nbStrings, _fretMin, _fretMax, _tuning, _scales, _isFlipped, _isNotesNameDisplayed, _isSizeFixed)
{
	let svg            = [];
	let gradients      = [];

	const nbFrets      = _fretMax - _fretMin;
	const fbW          = 200;
	const fbH          = (13/3)*_nbStrings;
	const fretW        = fbW/nbFrets;
	const fretH        = fbH/(_nbStrings - 1);
	const inlaySize    = 1.15;
	const fbInlayFrets = [3, 5, 7, 9, 15, 17, 19, 21];

	const marginTop    = 2;
	const marginBottom = 5;
	const marginLeft   = 1;
	const marginRight  = 4.5;
	const svgW         = fbW + marginRight + marginLeft;
	const svgH         = fbH + marginTop   + marginBottom;

	// Compute the notes of each scale
	_scales.forEach(__scale => __scale.notes = generateModelNotes(data[`${__scale.type}s`][__scale.model].model, __scale.tonality));

	// Start the SVG output
	xml.open(svg, 'svg', {
		xmlns:    'http://www.w3.org/2000/svg',
		version:  '1.2',
		width:    _isSizeFixed ? svgW : '',
		height:   _isSizeFixed ? svgH : '',
		viewBox:  `0 0 ${svgW} ${svgH}`,
	});

	// Embed some basic styles for text
	let textStyles = [
		'.normal { font: 0.12em sans-serif;      }',
		'.bold   { font: bold 0.12em sans-serif; }',
		'.note   { font: bold 0.10em sans-serif; }',
	];
	xml.openClose(svg, 'style', textStyles.join(' '), {});

	// Apply a transformation to flip the whole SVG if needed
	if (_isFlipped) xml.open(svg, 'g', { 'transform': `scale(-1, 1) translate(-${svgW}, 0)` });

	// Return the y position of a fret
	const getFretY = _fret => !_fret ? 0 : fretW*((3*nbFrets - 1)/(2*nbFrets - 2) - _fret/(nbFrets - 1));

	// Draw the frets
	for (let fret=_fretMin, offset=0; fret<=_fretMax; fret++)
	{
		// Draw the fret number
		if (fret > 0)
		{
			let x = offset - getFretY(fret)/2 + marginRight;

			// Inverse à nouveau le numéro si besoin
			if (_isFlipped) xml.open(svg, 'g', { 'transform': `translate(${svgW}, 0) scale(-1, 1)` });

			xml.openClose(svg, 'text', fret, {
				'x':            _isFlipped ? (svgW - x) : x,
				'y':            fbH + marginTop + 4,
				'fill':         '#aaa',
				'class':        fbInlayFrets.includes(fret) ? 'bold' : 'normal',
				'text-anchor':  'middle',
			});

			if (_isFlipped) xml.close(svg, 'g');
		}

		// Draw the next fret bar
		offset += getFretY(fret + 1);
		xml.tag(svg, 'line', {
			'x1':               offset + marginRight,
			'x2':               offset + marginRight,
			'y1':               marginTop,
			'y2':               fbH + marginTop,
			'stroke':           'gray',
			'stroke-width':     2,
			'vector-effect':    'non-scaling-stroke',
			'shape-rendering':  'crispEdges',
		});

		// Function to draw the inlays
		const drawInlay = y => xml.tag(svg, 'circle', {
			'r':     inlaySize,
			'cx':    offset - getFretY(fret)/2 + marginRight,
			'cy':    y + marginTop,
			'fill': '#ddd',
		});

		// Draw the inlays
		if (fbInlayFrets.includes(fret))
		{
			if (_nbStrings <= 6)
			{
				drawInlay(fbH/2);
			}
			else if (_nbStrings == 7)
			{
				drawInlay(fbH/2 - fretH/2);
				drawInlay(fbH/2 + fretH/2);
			}
			else if (_nbStrings == 8)
			{
				drawInlay(fbH/2 - fretH);
				drawInlay(fbH/2 + fretH);
			}
			else
			{
				if (_nbStrings % 2 == 0)
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
			if (_nbStrings <= 6)
			{
				drawInlay(fbH/2 - fretH);
				drawInlay(fbH/2 + fretH);
			}
			else if (_nbStrings == 7)
			{
				drawInlay(fbH/2 - fretH*3/2);
				drawInlay(fbH/2 + fretH*3/2);
			}
			else if (_nbStrings == 8)
			{
				drawInlay(fbH/2 - fretH*2);
				drawInlay(fbH/2 + fretH*2);
			}
			else
			{
				if (_nbStrings % 2 == 0)
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
	for (let string=0; string<_nbStrings; string++)
	{
		xml.tag(svg, 'line', {
			'x1':               marginRight,
			'x2':               fbW + marginRight,
			'y1':               string*fretH + marginTop,
			'y2':               string*fretH + marginTop,
			'stroke-width':     2,
			'stroke':           '#222',
			'shape-rendering':  'crispEdges',
			'vector-effect':    'non-scaling-stroke',
		});
	}

	// Draw the nut
	xml.tag(svg, 'line', {
		'x1':               marginRight + .5,
		'x2':               marginRight + .5,
		'y1':               marginTop,
		'y2':               fbH + marginTop,
		'stroke-width':     1,
		'stroke':           '#666',
		'shape-rendering':  'crispEdges',
	});

	// Draw the highlighted notes
	for (let string=1; string<=_nbStrings; string++)
	{
		let stringNotes = getStringNotes(_tuning[_nbStrings - string]);

		for (let fret=_fretMin, offset=0; fret<=_fretMax; fret++)
		{
			let notes = [];

			// Get all the scales to which the note belongs
			_scales.forEach((__scale, __index) => {
				if (__scale.notes.includes(stringNotes[fret]))
					notes.push(__index);
			});

			if (notes.length)
			{
				// Add a gradient to the list
				if (notes.length > 1) gradients.push(notes);

				let x = (fret == 0) ? 1.8 : offset - getFretY(fret)/2 + marginRight;
				let y = (string - 1)*fretH + marginTop;
				let r = 1.6;

				// Draw the note
				xml.tag(svg, 'circle', {
					'r':  r,
					'cx': x,
					'cy': y,

					// If the note belongs to more than one scale, fill it with a gradient
					'fill': (notes.length > 1) ? `url(#lg-${notes.join('-')})` : _scales[notes[0]].color,
				});

				// Draw the note name
				if (_isNotesNameDisplayed)
				{
					// If the fretboard is flipped, flip the text again to render it properly
					if (_isFlipped) xml.open(svg, 'g', { transform: `translate(${svgW}, 0) scale(-1, 1)` });

					xml.openClose(svg, 'text', data.tonalities[stringNotes[fret]],
					{
						'x':            _isFlipped ? (svgW - x) :  x,
						'y':            y + r/3,
						'fill':         'white',
						'class':        'note',
						'text-anchor':  'middle',
					});

					if (_isFlipped) xml.close(svg, 'g');
				}
			}

			offset += getFretY(fret + 1);
		}
	}

	if (_isFlipped) xml.close(svg, 'g');

	// Remove duplicate gradients
	let hash = {};
	let list = [];
	gradients.forEach(function(_gradient)
	{
		let key = _gradient.join('|');
		if (!hash[key])
		{
			list.push(_gradient);
			hash[key] = true;
		}
	});
	gradients = list;

	// Create the gradients to fill the notes
	gradients.forEach(function(_lg, _index)
	{
		xml.open(svg, 'linearGradient', { id: `lg-${_lg.join('-')}` });

		_lg.forEach(__scaleIndex => {
			xml.tag(svg, 'stop', { 'offset':     `${_index*(100/_lg.length)}%`, 'stop-color': _scales[__scaleIndex].color });
			xml.tag(svg, 'stop', { 'offset': `${(_index+1)*(100/_lg.length)}%`, 'stop-color': _scales[__scaleIndex].color });
		});

		xml.close(svg, 'linearGradient');
	});

	xml.close(svg, 'svg');

	// Create the blob containing the SVG text
	let blob = new Blob([svg.join('')], { type: 'image/svg+xml;charset=utf-8' });

	// Return an object containing the dimensions of the SVG and the blob itself
	return { w: svgW, h: svgH, blob, };
}
