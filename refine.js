import fs from 'fs-extra';
import path from 'path';
import logger from './logger';

import {
	outputFolder,
	outputFolderSchemaDefinitions
 } from './constants';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

const getData = async () =>
{
	logger.warn('getting data')
	// book
	const building = 'Book';
	const searching = ['title', 'author', 'published', 'publisher' ];

	// const schemaOrg = fs.read
	//
	// schema.org... found it. SO. What do we do. Put in full link.
	// get object back.
	// pass in our object.
	//

	const allResults = [];


	let count = 0;

// sample object
// {
// 	"@context": {
// 	    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
// 	    "schema": "http://schema.org/",
// 	    "rdfs:subClassOf": { "@type": "@id" },
// 	    "name": "rdfs:label",
// 	    "description": "rdfs:comment",
// 	    "children": { "@reverse": "rdfs:subClassOf" }
// 	  },
//
// 	"@type": "rdfs:Class",  "description": "The most generic type of item.",
// 	"name": "Thing",
// 	"@id": "schema:Thing",
// 	"layer": "core",
// 	"children": []
// }


	let ourItem;
	const checkArrayForTerm = ( arrayToCheck, term ) =>
	{
		// console.log('key',key, 'vaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',value)
		// let resultOfCheck;

		arrayToCheck.forEach(
			(item, index) => {

				// const whereWeAre = currentLocale || [];
				// console.log('itemnamme', item.name) // sanitise options. lowercase etc.
				if( item.name && item.name === term )
				{
					// console.log('WE GOT A MAETCHHHHH', item)
					// resultOfCheck = item;
					ourItem =  item;

				}

				if( item.children )
				{
					// whereWeAre.push( index );
					return checkArrayForTerm( item.children, term )
				}

			}
		);

	};


	const getTerm = ( term ) =>
	{
		// const item;
		checkArrayForTerm( schemaOrg.children, term );
		// return answer;

	}


	getTerm( building );

	logger.info('YOU ARNSWER????', ourItem);

}


getData();
