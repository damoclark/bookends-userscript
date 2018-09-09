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

/*
TODO Create a framework that abstracts the specific tasks necessary to make this work for individual web-based editors

# High-level overview

Note: Askterisk steps executed by modular code specific for given website or web-based editor (e.g. Medium, Wordpress, etc)

1. Detect the editor

2. * If supported editor, execute specific JS to add 'Bookends Scan' to the existing UI

3. * Specific JS that can locate the parent DOM element of the selected text (by user)

4. DOM fragment (as HTML string), and send to bookends server (POST so sent as body - any size)

5. Receive scanned text from bookends server

6. * Specific JS that can replace the selected text, with scanned HTML text from bookends server <-- Module code per website/editor

 */

/*eslint-env browser*/

/*global GM*/

const superagent = require('superagent') ;
const SuperagentGmxhr = require('superagent-gmxhr') ;
SuperagentGmxhr.set(superagent) ;

console.log(GM) ;

// Adds the item to the browser context menu (just for proof of concept)
GM.registerMenuCommand( 'Scan selected text', () => {
console.log(GM) ;

	try {
		// Get the selection object
		let s = window.getSelection();

		// Or if editor is in an iframe (such as with wordpress)
		// let s = window.document.querySelector('iframe').contentWindow.getSelection();

		// Get the common parent of the selected HTML nodes TODO Make sure only selected text included
		let n = s.getRangeAt(0).commonAncestorContainer ;
		// If the node is a Text node, select its parent element node
		if (n instanceof Text) {
			n = n.parentElement ;
		}
		// Capture the contents as DOMString
		let text = n.innerHTML;

		console.log(`sending: request to http://localhost:2001/scan with: ${text}`);
		// text parameter holds the DOMString containing the selected text
		// format parameter specifies the Bookends 'format' to scan with
		superagent.post('http://localhost:2001/scan', {text, format: 'APA'})
		.type('form')
		.then((resolve, reject) => {
			if (reject) {
				console.log(`reject=${reject}`);

				throw reject;
			}
			console.log(`resolve=${resolve.text}`);
			// TODO If contenteditable editor, then can also use alternate method to replace selected text
			// window.document.execCommand('insertHTML', false, resolve.text);
			// If not using contenteditable, then replace the selected text by setting innerHTML
			s.getRangeAt(0).commonAncestorContainer.innerHTML = resolve.text;
		});
		console.log(`request sent`);
	} catch (e) {
		console.log(e);
	}

}, 's' ) ;

