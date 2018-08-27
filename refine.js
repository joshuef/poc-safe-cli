import data from './data_from_LOV_site';
import request from 'request-promise-native';
import fs from 'fs-extra';
import path from 'path';
import schemaOrg from './schema.org.json'
import { JefNode } from 'json-easy-filter';

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

	// const link = `https://schema.org/docs/tree.json`;
	// const lovResponse = await request(link);
	// const schemas = JSON.parse(lovResponse);
	// const results = js;
	// console.log('schemas', schemas);

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

				// return false;


				// console.log('NO CHILDREN ON THIS ITEM?!?!?!?', item)

				// console.log('key',key, 'vaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal',value)
			}
		);

		// console.log('resultofcheck', resultOfCheck)
		//
		// return resultOfCheck;
	};


	const getTerm = ( term ) =>
	{
		// const item;
		checkArrayForTerm( schemaOrg.children, term );
		// return answer;

	}


getTerm( building );

	console.log('YOU ARNSWER????', ourItem);


	// console.log('locationnnnnnnnnnnnnnnnnnnnnnnnnnnnn', location)


	// schemaOrg.validate( node =>
	// {
	// 	count++;
	//
	// 	if( count < 10 ) return;
	//
	// 	// console.log('node.name', node.value)
	// 	if( node.value === 'Book' );
	// 	{
	// 		console.log('node.value', node.value)
	// 		allResults.push(node);
	// 	}
	// } );


	// console.log('resutltsS?', allResults);



	// const promises = searching.map( async prop => {
	//
	//
	//
	// 	allResults.push( results );
	//
	// });
	//
	// await Promise.all( promises );
	//
	// console.log('ALLL???', allResults)




	// console.log('vocabData before: ', vocabData)
	//
	// let dataPromises = data.map( async vocab =>
	// 	{
	// 		// console.log('at the first dataaaaa', vocabPrefixLocationMap)
	// 		if( totalLinksIn > 2500 )
	// 		{
	// 			// console.warn('Exceeding count. Stopping.')
	// 			return;
	// 		}
	//
	// 		totalLinksIn = totalLinksIn + vocab.nbIncomingLinks;
	//
	// 		const prefix = vocab.prefix;
	//
	// 		if( !prefix ) return;
	//
	//
	// 		let ours = results.find( result => result['_source'].prefix === prefix);
	//
	// 		let source = ours['_source'].uri;
	// 		// console.log('this res>>>>>>>>>>>>>>>>>>>', source, vocabPrefixLocationMap);
	//
	//
	// 		const options = {
	// 			url :source,
	// 			headers: {
	// 				'Content-Type' : 'application/ld+json'
	// 			}
	// 		}
	// 		const vocabDataResponse = await request( options );
	// 		const fileOutputLocation = path.resolve( outputFolder, prefix );
	//
	//
	//
	// 		let type;
	// 		if( vocabDataResponse.includes( '@prefix' ) )
	// 		{
	// 			type = '.ttl'
	// 		}
	//
	// 		if( vocabDataResponse.includes( 'xmlns' ) )
	// 		{
	// 			type = '.xml'
	// 		}
	//
	//
	// 		//this can include the other two, but in the end, if its starts thus, it's html
	// 		if( vocabDataResponse.startsWith( '<!DOCTYPE' ) )
	// 		{
	// 			type = '.html'
	// 		}
	//
	// 		if( vocabDataResponse.length === 0 )
	// 		{
	// 			console.log( prefix, 'not found');
	// 			return;
	// 		}
	//
	// 		vocabPrefixLocationMap[ prefix + type ] = source;
	// 		fs.outputFile( fileOutputLocation + type, vocabDataResponse );
	//
	// 		await delay( 1000 );
	// 	})
	//
	//
	// 	await Promise.all( dataPromises );
	//
	//
	// 	await fs.outputJson( path.resolve( outputFolder, vocabMapFileName ), vocabPrefixLocationMap )
	//
	// 	console.log('vocab data retreived, and written:', vocabPrefixLocationMap);

}


getData();
