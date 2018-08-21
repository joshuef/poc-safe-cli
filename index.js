import data from './data_from_LOV_site';
import request from 'request-promise-native';
import fs from 'fs-extra';
import path from 'path';

// console.log(data);

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

let totalLinksIn = 0;
data.forEach( async vocab =>
{
	if( totalLinksIn > 2500 )
	{
		// console.warn('Exceeding count. Stopping.')
		return;
	}

	totalLinksIn = totalLinksIn + vocab.nbIncomingLinks;

	const prefix = vocab.prefix;

	const link = `https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/search?q=${prefix}`;
	let res = await request(link);

	let json = JSON.parse(res);

	const results = json.results;

	let ours = results.find( result => result['_source'].prefix === prefix);

	let source = ours['_source'].uri;
	console.log('this res>>>>>>>>>>>>>>>>>>>', source);

	const options = {
		url :source,
		headers: {
			'Content-Type' : 'application/ld+json'
		}
	}
	let vocabData = await request( options );
	const where = path.resolve( __dirname, 'vocabs', prefix );

	let type;
	if( vocabData.includes( '@prefix' ) )
	{
		type = '.ttl'
	}

	if( vocabData.startsWith( '<?xml' ) )
	{
		type = '.xml'
	}

	if( vocabData.startsWith( '<!DOCTYPE' ) )
	{
		type = '.html'
	}

	if( vocabData.length === 0 )
	{
		console.log( prefix, 'not found');
		return;
	}

	fs.outputFile( where + type, vocabData );

	await delay( 1000 );
})
