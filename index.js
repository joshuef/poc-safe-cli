import rdflib from 'rdflib';

import fs from 'fs-extra';
import klaw from 'klaw';
import path from 'path';
import mime from 'mime-types';

// console.log(data);
const store = rdflib.graph();

const buildRdf = ( vocabs ) =>
{
	vocabs.forEach( async vocabPath => {
		let mimeType = mime.lookup( vocabPath );

		if( !mimeType ) return;

		console.log('MIME?', mimeType);

		const data = fs.readFileSync( vocabPath ).toString();

		// console.log(data)

		rdflib.parse(data, store, id, mimeType, cb);


	})
}

const vocabs = []
klaw( path.resolve(__dirname, 'vocabs') )
	.on( 'data', item => vocabs.push(item.path) )
	.on( 'end', () => {
		console.dir( vocabs );
		buildRdf(vocabs);
	});
