import fs from 'fs-extra';
import path from 'path';
import logger from './logger';

import {
	outputFolder,
	outputFolderSchemaDefinitions
 } from './constants';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );


const outputSampleProps = async ( term ) =>
{
	let json = await fs.readJson( path.resolve(outputFolderSchemaDefinitions, term + '.jsonld') );

	// logger.info('json', json);

	const ourObject = {};

	const graph = json['@graph'];

	graph.forEach( ( prop, i ) => {

		// if( i > 3 ) return;

		// const label = prop['@id'];

		Object.entries( prop ).forEach( ([key, value]) => {

			if( key === '@type' && value !== 'Property' )
				return;


			// console.log('key', key, 'value', value)
			if( key === 'rdfs:label' )
			{
				// console.log('LABELLLL', key);

				ourObject[ value ] = prop['rdfs:comment'];
			}
		})


		// logger.info('getting prop', prop )
		// if( prop["@type"] === "rdf:Property" )
		// {
 		// 	ourObject[ label ] = prop['rdfs:comment'] ;
		// }
	});

	return ourObject;
}

const getYourObject = async ( ) => {

	let outObject = await outputSampleProps('Book');

	console.log('>>>>>', outObject)
	// return outObject;
}


getYourObject();
