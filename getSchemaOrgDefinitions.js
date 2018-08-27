import data from './schema.org.json';
import request from 'request-promise-native';
import fs from 'fs-extra';
import path from 'path';
import logger from './logger';

import {
	outputFolderSchemaDefinitions,
 } from './constants';

logger.info('Starting fetch of schema.org properties.')
const downloadData = async ( schemaObject ) =>
{
	const theName = schemaObject.name;

	const link = `https://schema.org/${theName}.jsonld`;

	if( schemaObject.children )
	{
		schemaObject.children.forEach(
			(item) => downloadData(item)
		);
	}


	logger.info( 'Requesting, ', theName );
	const data =  await request(link);
	const fileOutputLocation = path.resolve( outputFolderSchemaDefinitions, theName + '.jsonld' );
	fs.outputFile( fileOutputLocation, data )
	logger.info( theName, 'Retrieved' );

};

downloadData( data );
