
/**
 * test/music.test.js
 */

require('chai').should();

import data                   from '../src/modules/data.js'
import { getNotesInterval   } from '../src/modules/music.js';
import { generateModelNotes } from '../src/modules/music.js';

describe("music.js", () => {

	describe("getNotesInterval()", () => {

		it("gives the correct interval between two notes", () => {
			getNotesInterval('A' , 'A' ).should.equal(0);
			getNotesInterval('A' , 'G#').should.equal(11);
			getNotesInterval('G#', 'A' ).should.equal(1);
			getNotesInterval('G#', 'Bb').should.equal(2);
		});

	});

	describe("generateModelNotes()", () => {

		it("generates correct scales", () => {
			// C natural major
			generateModelNotes(data.scales.maj.model, 'C' ).should.have.ordered.members(['C' , 'D' , 'E' , 'F' , 'G' , 'A' , 'B']);
			// G# natural major
			generateModelNotes(data.scales.maj.model, 'G#').should.have.ordered.members(['G#', 'Bb', 'C' , 'C#', 'D#', 'F' , 'G']);
		});

	});

});
