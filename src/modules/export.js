
/**
 * modules/export.js
 */

// import { saveAs }         from 'file-saver'

import data               from '@/modules/data'
import * as music         from '@/modules/music'
import { colorscheme }    from '@/modules/colorscheme'
import { objectMapToObj } from '@/modules/object'

/**
 * Create and save an image of the fretboard
 */
export function exportFretboard(format, ...fretboardParams)
{
	exportFretboardToSVG.apply(null, fretboardParams);

	switch (format)
	{
		case 'jpg':
		case 'png':
			// createCanvasFromSVG(svg.blob, svg.width*10, svg.height*10, canvas => saveAs(canvas.toDataURL(`image/${format}`), `fretboard.${format}`));
			break;

		case 'svg':
			// saveAs(svg.blob, 'fretboard.svg');
			break;
	}
}

/**
 * Return a snapshot of the current state of the fretboard in SVG format
 */
function exportFretboardToSVG(nbStrings, fretMin, fretMax, tuning, scales, isFretboardFlipped, isDisplayingNotesName, isDarkModeOn, isSizeFixed)
{
	const svg             = [];
	const gradients       = [];

	// Helper functions to generate XML
	const camelAttributes = ['viewBox', 'gradientTransform'];
	const camel2Kebab     = str                          => camelAttributes.includes(str) ? str : str.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`);
	const getAttrsString  = attrs                        => Object.keys(attrs).reduce((str, attr) => attrs[attr] ? `${str} ${camel2Kebab(attr)}="${attrs[attr]}"` : str, '');
	const openTag         = (xml, tag, attrs)            => xml.push(`<${tag}${getAttrsString(attrs)}>`);
	const closeTag        = (xml, tag)                   => xml.push(`</${tag}>`);
	const appendSingleTag = (xml, tag, attrs)            => xml.push(`<${tag}${getAttrsString(attrs)} />`);
	const appendFullTag   = (xml, tag, innerText, attrs) => { openTag(xml, tag, attrs); xml.push(innerText); closeTag(xml, tag); }

	// Layout
	const marginTop       = 2;
	const marginLeft      = 1;
	const marginBottom    = 5;
	const marginRight     = 4.5;
	const fretboardWidth  = 200;
	const fretboardHeight = (13/3)*nbStrings;
	const nbFrets         = fretMax - fretMin;
	const fretWidth       = fretboardWidth/nbFrets;
	const fretHeight      = fretboardHeight/(nbStrings - 1);
	const svgWidth        = fretboardWidth  + marginRight + marginLeft;
	const svgHeight       = fretboardHeight + marginTop   + marginBottom;
	const inlaySize       = 1.10;
	const fretsWithInlays = [3, 5, 7, 9, 15, 17, 19, 21];

	// Colorscheme
	const palette = objectMapToObj(colorscheme, (key, colors) => colors[isDarkModeOn ? 1 : 0]);
	const colors  = {
		bg:         palette['--color--bg'],
		inlay:      isDarkModeOn ? palette['--color--bg--accent'] : '#eee',
		string:     palette['--color--string'],
		fret:       palette['--color--fret'],
		fretNumber: palette['--color--text--secondary'],
		noteName:   'white',
	};

	// Compute the notes of each scale
	const scalesNotes = scales.map(scale => music.generateModelNotes(data[`${scale.type}s`][scale.model].model, scale.tonality));

	// Start the SVG output
	openTag(svg, 'svg', {
		xmlns:   'http://www.w3.org/2000/svg',
		version: '1.2',
		width:   isSizeFixed ? svgWidth  : '',
		height:  isSizeFixed ? svgHeight : '',
		viewBox: `0 0 ${svgWidth} ${svgHeight}`,
		style:   `background-color: ${colors.bg}`,
	});

	// Embed some basic styles for text
	const textStyles = [
		'.normal { font:      0.12em sans-serif; }',
		'.bold   { font: bold 0.12em sans-serif; }',
		'.note   { font: bold 0.10em sans-serif; }',
	];
	appendFullTag(svg, 'style', textStyles.join(' '), {});

	// Apply a transformation to flip the whole SVG if needed
	if (isFretboardFlipped) openTag(svg, 'g', { transform: `scale(-1, 1) translate(-${svgWidth}, 0)` });

	// Return the position of a fret on the y-axis
	const getFretY = fret => !fret ? 0 : fretWidth*((3*nbFrets - 1)/(2*nbFrets - 2) - fret/(nbFrets - 1));

	/**
	 * Frets
	 * ---------------------------------------------------------------------
	 */
	for (let fret=fretMin, offset=0; fret<=fretMax; fret++)
	{
		// Draw the fret number
		if (fret > 0)
		{
			const x = offset - getFretY(fret)/2 + marginRight;

			// Flip the fret numbers if needed
			if (isFretboardFlipped) openTag(svg, 'g', { transform: `translate(${svgWidth}, 0) scale(-1, 1)` });

			appendFullTag(svg, 'text', fret, {
				x:          isFretboardFlipped ? (svgWidth - x) : x,
				y:          fretboardHeight + marginTop + 4,
				fill:       colors.fretNumber,
				class:      fretsWithInlays.includes(fret) ? 'bold' : 'normal',
				textAnchor: 'middle',
			});

			if (isFretboardFlipped) closeTag(svg, 'g');
		}

		// Draw the next fret bar
		offset += getFretY(fret + 1);
		appendSingleTag(svg, 'line', {
			x1:             offset + marginRight,
			x2:             offset + marginRight,
			y1:             marginTop,
			y2:             fretboardHeight + marginTop,
			stroke:         colors.fret,
			strokeWidth:    2,
			vectorEffect:   'non-scaling-stroke',
			shapeRendering: 'crispEdges',
		});

		// Function to draw the inlays
		const drawInlay = y => appendSingleTag(svg, 'circle', {
			r:    inlaySize,
			cx:   offset - getFretY(fret)/2 + marginRight,
			cy:   y + marginTop,
			fill: colors.inlay,
		});

		// Draw the inlays
		if (fretsWithInlays.includes(fret))
		{
			if (nbStrings <= 6)
			{
				drawInlay(fretboardHeight/2);
			}
			else if (nbStrings == 7)
			{
				drawInlay(fretboardHeight/2 - fretHeight/2);
				drawInlay(fretboardHeight/2 + fretHeight/2);
			}
			else if (nbStrings == 8)
			{
				drawInlay(fretboardHeight/2 - fretHeight);
				drawInlay(fretboardHeight/2 + fretHeight);
			}
			else
			{
				if (nbStrings % 2 == 0)
				{
					drawInlay(fretboardHeight/2 - fretHeight*2);
					drawInlay(fretboardHeight/2 + fretHeight*2);
				}
				else
				{
					drawInlay(fretboardHeight/2 - fretHeight*3/2);
					drawInlay(fretboardHeight/2 + fretHeight*3/2);
				}
			}
		}
		if (fret == 12)
		{
			if (nbStrings <= 6)
			{
				drawInlay(fretboardHeight/2 - fretHeight);
				drawInlay(fretboardHeight/2 + fretHeight);
			}
			else if (nbStrings == 7)
			{
				drawInlay(fretboardHeight/2 - fretHeight*3/2);
				drawInlay(fretboardHeight/2 + fretHeight*3/2);
			}
			else if (nbStrings == 8)
			{
				drawInlay(fretboardHeight/2 - fretHeight*2);
				drawInlay(fretboardHeight/2 + fretHeight*2);
			}
			else
			{
				if (nbStrings % 2 == 0)
				{
					drawInlay(fretboardHeight/2);
					drawInlay(fretboardHeight/2 - fretHeight*3);
					drawInlay(fretboardHeight/2 + fretHeight*3);
				}
				else
				{
					drawInlay(fretboardHeight/2 - fretHeight*5/2);
					drawInlay(fretboardHeight/2 + fretHeight*5/2);
				}
			}
		}
	}

	// Draw the nut
	appendSingleTag(svg, 'line', {
		x1:             marginRight + .5,
		x2:             marginRight + .5,
		y1:             marginTop,
		y2:             fretboardHeight + marginTop,
		strokeWidth:    1,
		stroke:         colors.fret,
		shapeRendering: 'crispEdges',
	});

	/**
	 * Strings
	 * ---------------------------------------------------------------------
	 */
	for (let string=0; string<nbStrings; string++)
	{
		appendSingleTag(svg, 'line', {
			x1:             marginRight,
			x2:             fretboardWidth    + marginRight,
			y1:             string*fretHeight + marginTop,
			y2:             string*fretHeight + marginTop,
			stroke:         colors.string,
			strokeWidth:    2,
			shapeRendering: 'crispEdges',
			vectorEffect:   'non-scaling-stroke',
		});
	}

	/**
	 * Notes
	 * ---------------------------------------------------------------------
	 */
	for (let string=1; string<=nbStrings; string++)
	{
		const stringNotes = music.getStringNotes(tuning[nbStrings - string]);

		for (let fret=fretMin, offset=0; fret<=fretMax; fret++)
		{
			// Get all the scales containing the fret note
			const noteScales = scales.filter((scale, index) => scalesNotes[index].includes(stringNotes[fret])).map((_, index) => index);
			console.info(noteScales);

			// Ignore inactive frets
			if (!noteScales.length) return;

			const x = (fret == 0) ? 1.8 : offset - getFretY(fret)/2 + marginRight;
			const y = (string - 1)*fretHeight + marginTop;
			const r = 1.6;
			const gradientColors = noteScales.map(index => scales[index].color).join('-');

			// Add a new gradient to the list if needed
			if (noteScales.length > 1 && !gradients.includes(gradientColors))
				gradients.push(gradientColors);

			// Draw the note
			appendSingleTag(svg, 'circle', {
				r:  r,
				cx: x,
				cy: y,

				// If the note belongs to more than one scale, fill it with a gradient
				fill: (noteScales.length > 1) ? `url(#lg-${gradientColors})` : scales[noteScales[0]].color,
			});

			// Draw the note name
			if (isDisplayingNotesName)
			{
				// If the fretboard is flipped, flip the text again to render it properly
				if (isFretboardFlipped) openTag(svg, 'g', { transform: `translate(${svgWidth}, 0) scale(-1, 1)` });

				appendFullTag(svg, 'text', data.tonalities[stringNotes[fret]], {
					x:          isFretboardFlipped ? (svgWidth - x) :  x,
					y:          y + r/3,
					fill:       colors.noteName,
					class:      'note',
					textAnchor: 'middle',
				});

				if (isFretboardFlipped) closeTag(svg, 'g');
			}

			offset += getFretY(fret + 1);
		}
	}

	if (isFretboardFlipped) closeTag(svg, 'g');

	/**
	 * Gradients
	 * ---------------------------------------------------------------------
	 */
	console.info(gradients);
	gradients.forEach(function(gradient)
	{
		openTag(svg, 'linearGradient', {
			id: `lg-${gradient}`,
			// gradientTransform: 'rotate(45)',
		});

		gradient.split('-').forEach(function(stopColor, stopIndex, colors)
		{
			appendSingleTag(svg, 'stop', { offset:     `${stopIndex*(100/colors.length)}%`, stopColor });
			appendSingleTag(svg, 'stop', { offset: `${(stopIndex+1)*(100/colors.length)}%`, stopColor });
		});

		closeTag(svg, 'linearGradient');
	});

	closeTag(svg, 'svg');

	console.info(svg);

	// Create the blob containing the SVG text
	const blob = new Blob([svg.join('')], { type: 'image/svg+xml;charset=utf-8' });

	// Return an object containing the dimensions of the SVG and the blob itself
	return { width: svgWidth, height: svgHeight, blob, };
}

/**
 * Create a canvas from a SVG and apply a callback on the result
 */
export function createCanvasFromSVG(svg, width, height, callback)
{
	// Create a canvas the size of the SVG
	const canvasWrapper     = document.getElementById('canvas-wrapper');
	canvasWrapper.innerHTML = `<canvas width="${width}" height="${height}" id="canvas-export"><canvas>`;

	const  canvas  = document.getElementById('canvas-export');
	const  context = canvas.getContext('2d');
	const  domURL  = window.URL || window.webkitURL || window;
	const  url     = domURL.createObjectURL(svg);
	const  img     = new Image();

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
