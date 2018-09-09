/**
 * index.js
 *
 * Main server program
 *
 * bookends-userscript server mockup
 *
 * 3/9/18
 *
 * Copyright
 */

const express = require('express') ;
const app = express() ;
const chokidar = require('chokidar') ;
const fsPromises = require('fs').promises ;


let urlencoded = express.urlencoded({extended: true}) ;

let id = 0 ;

app.post('/scan', urlencoded, (req, res) => {
	id++ ;
	console.log(`Request received: ${req}`);
	// req.body.text ; text to be scanned
	// req.body.format ; reference format to use
	let watcher = chokidar.watch(`${__dirname}/../tmp/${id}.output.formatted.txt`, {awaitWriteFinish: true}) ;

	// When input file scanned and results written to matching file, return this file
	watcher.on('add', path => {
		// Read path and return to client
		console.log(`Reading from: ${path}`) ;
		fsPromises.readFile(path)
		.then((resolve, reject) => {
			if (reject) 
				throw reject ;
			
			res.type('text/html') ;
			res.send(resolve) ;
			watcher.close() ;
		}) ;
	}) ;
	// Write text to be parsed to disk in temp file
	let out = `${__dirname}/../tmp/${id}.output.txt` ;
	console.log(`Writing to: ${out}`) ;
	console.log(JSON.stringify(req.body)) ;
	fsPromises.writeFile(out, req.body.text)
	.then((res, rej) => {
		if (rej) {
			watcher.close() ;
			throw rej ;
		}
	}) ;
}) ;

app.listen(2001, () => console.log('App listening on port 2001!')) ;