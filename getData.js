import data from './data_from_LOV_site';
import request from 'request-promise-native';
import fs from 'fs-extra';
import path from 'path';

// console.log(data);

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// cpunt up links till we a reach a threshold covering LOV data.
let totalLinksIn = 0;

// const vocabData = [];
const x = {};

const getData = async () =>
{

	// console.log('vocabData before: ', vocabData)

	let dataPromises = data.map( async vocab =>
		{
			console.log('at the first dataaaaa', x)
			if( totalLinksIn > 2500 )
			{
				// console.warn('Exceeding count. Stopping.')
				return;
			}

			totalLinksIn = totalLinksIn + vocab.nbIncomingLinks;

			const prefix = vocab.prefix;

			if( !prefix ) return;

			const link = `https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/search?q=${prefix}`;
			const lovResponse = await request(link);

			const json = JSON.parse(lovResponse);

			const results = json.results;

			let ours = results.find( result => result['_source'].prefix === prefix);

			let source = ours['_source'].uri;
			console.log('this res>>>>>>>>>>>>>>>>>>>', source, x);

			x[ prefix ] = source;

			const options = {
				url :source,
				headers: {
					'Content-Type' : 'application/ld+json'
				}
			}
			let vocabData = await request( options );
			const outputLocation = path.resolve( __dirname, 'vocabs', prefix );

			let type;
			if( vocabData.includes( '@prefix' ) )
			{
				type = '.ttl'
			}

			if( vocabData.includes( 'xmlns' ) )
			{
				type = '.xml'
			}


			//this can include the other two, but in the end, if its starts thus, it's html
			if( vocabData.startsWith( '<!DOCTYPE' ) )
			{
				type = '.html'
			}

			if( vocabData.length === 0 )
			{
				console.log( prefix, 'not found');
				return;
			}

			fs.outputFile( outputLocation + type, vocabData );

			await delay( 1000 );
		})


		await Promise.all( dataPromises );

		console.log('data retrievedddddd', x);


}


getData();
