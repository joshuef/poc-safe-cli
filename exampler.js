import fs from 'fs-extra';
import path from 'path';
import logger from './logger';

import {
	outputFolder,
	outputFolderSchemaDefinitions
 } from './constants';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

const termChosen = 'Book';
const sampleObject = { 'title' : 'Dave', 'author' : 'me', 'published' : 'now', 'publisher': 'yes ' };


const getSampleProps = async ( term, filterObject ) =>
{
	let json = await fs.readJson( path.resolve(outputFolderSchemaDefinitions, term + '.jsonld') );

	const ourObject = {};

	const graph = json['@graph'];

	const filterObjectKeysArray = filterObject ? Object.keys( filterObject ) : null;

	graph.forEach( ( prop, i ) => {

		Object.entries( prop ).forEach( ([key, value]) => {

			if( key === '@type' && value !== 'Property' )
				return;


			if( key === 'rdfs:label' )
			{
				if( filterObject && !filterObjectKeysArray.includes( value ) )
					return;


				ourObject[ value ] = prop['rdfs:comment'];

			}
		})

	});

	return ourObject;
}

const getYourObject = async ( ) => {

	let outObject = await getSampleProps(termChosen);

	console.log('Definitions you could be using: ', outObject)
}


// getYourObject();



const makeMineA = async ( term, yourObject ) =>
{
	let outObject = await getSampleProps(term, yourObject);
	console.log('With your object: ', outObject);
	console.log('You entered:::: ', yourObject);

	// todo, validate && show issues.

}

makeMineA( termChosen, sampleObject );
