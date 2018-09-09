/**
 * index.js
 *
 * Main program file
 *
 * bookends
 *
 * 2/9/18
 *
 * Copyright
 */


/*eslint-env browser*/

/*global GM*/

const superagent = require('superagent') ;
const SuperagentGmxhr = require('superagent-gmxhr') ;
SuperagentGmxhr.set(superagent) ;



GM.registerMenuCommand( 'Scan selected text', () => {
console.log(GM) ;

	try { // alert('Menu worked') ;
		// Get the selection object
		let s ;
		// s = window.getSelection();

		// Or if editor is in an iframe (such as with wordpress)
		s = window.document.querySelector('iframe').contentWindow.getSelection();

		let text = s.getRangeAt(0).commonAncestorContainer.innerHTML;

		console.log(`sending: request to http://localhost:2001/scan with: ${text}`);
		superagent.post('http://localhost:2001/scan', {text, format: 'APA'})
		.type('form')
		.then((resolve, reject) => {
			if (reject) {
				console.log(`reject=${reject}`);

				throw reject;
			}
			console.log(`resolve=${resolve.text}`);
			s.getRangeAt(0).commonAncestorContainer.innerHTML = resolve.text;
		});
		console.log(`request sent`);
		//Generates
		// '<p>This is some text.<br></p><p><br data-mce-bogus="1"></p>' ;
	} catch (e) {
		console.log(e);
	}

}, 's' ) ;

