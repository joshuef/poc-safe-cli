import rdf from 'rdf';
// import rdflib from 'rdflib';

import fs from 'fs-extra';
import klaw from 'klaw';
import path from 'path';
import mime from 'mime-types';
import vocabMap from './vocabs/vocabMap.json'

// import * as jsonld from 'jsonld';


// console.log(data);
// const store = rdflib.graph();


import {
	outputFolder,
	vocabMapFileName
 } from './constants';

const buildRdf = ( vocabs ) =>
{
	Object.keys( vocabs ).forEach( async vocab => {

		console.log('parsing', vocab)
		const vocabPath = path.resolve( outputFolder, vocab );
		let mimeType = mime.lookup( vocabPath );

		if( !mimeType ) return;


		// if( mimeType !== 'application/xml' )
		if( mimeType === 'application/xml' )
		{
			console.log( vocab, 'cannot be parsed atm, as its xml, which rdflib hates.')
			return; // no xml for now
			mimeType = 'application/rdf+xml';
		}



		const data = fs.readFileSync( vocabPath ).toString();
		const vocabUri = vocabs[vocab];


		// console.log(data)

		let parsed;

		try{

			parsed = rdf.TurtleParser.parse( data, vocabUri );
			// console.log('MIME?', mimeType, vocabUri, parsed );
			// rdflib.parse(data, store, vocabUri, mimeType);
			// const doc = await jsonld.fromRDF(nquads, {format: mimeType});

			const fullyTurt = parsed.graph.toArray().join("\n");

			// console.log( 'person??????????????????',   )
		// ;

		// const turtle = parsed.graph
		// 	.toArray()
		// 	.sort(function(a,b){ return a.compare(b); })
		// 	.map(function(stmt){
		// 		return stmt.toTurtle(profile);
		// 	});
		//console.log(profile.n3());
		// console.log('TURTTTTTTTTTTTT',turtle.join('\n')	);


		}
		catch( e )
		{
			console.log( 'Parsing ', vocab, 'failed' )
			// console.error( 'Parsing ', vocab, 'failed due to: ', e.message )
		}


	})
}

// const vocabs = []
// klaw( path.resolve(__dirname, 'vocabs') )
// 	.on( 'data', item => vocabs.push(item.path) )
// 	.on( 'end', () => {
// 		console.dir( vocabs );
// 	});

buildRdf(vocabMap);

// const serialise = async (mimeType) => {
//   return new Promise((resolve, reject) => {
// 	const cb = (err, parsed) => {
// 	  if (err) {
// 		return reject(err);
// 	  }
// 	  resolve(parsed);
// 	};
//
// 	// TODO: serialise it with compact when is jsonld
// 	// rdflib.serialize(null, store, 'this.id', 'application/ld+json', cb);
//   });
// }


// // let ser = store.statementsMatching(undefined, undefined, 'Person')
// let ser = serialise().then(
// 	res => console.log('SER????????????',res)
// )
