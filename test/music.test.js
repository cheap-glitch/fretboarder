
/**
 * test/music.test.js
 */

require('chai').should();

import data                   from '../src/modules/data.js'
import { generateModelNotes } from '../src/modules/music.js';

describe("music.js", () => {

	describe("generateModelNotes()", () => {

		it("generates correct scales", () => {
			// C natural major
			generateModelNotes(data.scales.maj.model, 'C' ).should.have.ordered.members(['C' , 'D' , 'E' , 'F' , 'G' , 'A' , 'B']);
			// G# natural major
			generateModelNotes(data.scales.maj.model, 'G#').should.have.ordered.members(['G#', 'Bb', 'C' , 'C#', 'D#', 'F' , 'G']);
		});

	});

});
