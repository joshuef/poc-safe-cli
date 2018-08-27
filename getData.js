import data from './data_from_LOV_site';
import request from 'request-promise-native';
import fs from 'fs-extra';
import path from 'path';

import {
	outputFolder,
	vocabMapFileName
 } from './constants';

// console.log(data);

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// cpunt up links till we a reach a threshold covering LOV data.
let totalLinksIn = 0;

// const vocabData = [];
const vocabPrefixLocationMap = {};

const getData = async () =>
{

	// console.log('vocabData before: ', vocabData)

	let dataPromises = data.map( async vocab =>
		{
			// console.log('at the first dataaaaa', vocabPrefixLocationMap)
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
			// console.log('this res>>>>>>>>>>>>>>>>>>>', source, vocabPrefixLocationMap);


			const options = {
				url :source,
				headers: {
					'Content-Type' : 'application/ld+json'
				}
			}
			const vocabDataResponse = await request( options );
			const fileOutputLocation = path.resolve( outputFolder, prefix );



			let type;
			if( vocabDataResponse.includes( '@prefix' ) )
			{
				type = '.ttl'
			}

			if( vocabDataResponse.includes( 'xmlns' ) )
			{
				type = '.xml'
			}


			//this can include the other two, but in the end, if its starts thus, it's html
			if( vocabDataResponse.startsWith( '<!DOCTYPE' ) )
			{
				type = '.html'
			}

			if( vocabDataResponse.length === 0 )
			{
				console.log( prefix, 'not found');
				return;
			}

			vocabPrefixLocationMap[ prefix + type ] = source;
			fs.outputFile( fileOutputLocation + type, vocabDataResponse );

			await delay( 1000 );
		})


		await Promise.all( dataPromises );


		await fs.outputJson( path.resolve( outputFolder, vocabMapFileName ), vocabPrefixLocationMap )

		console.log('vocab data retreived, and written:', vocabPrefixLocationMap);

}


getData();
