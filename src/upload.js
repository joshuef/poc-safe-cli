import rdf from 'rdf';
import path from 'path';
import { authenticate } from './safeNetwork';
import { handleFileUpload } from './fileUploader';

// require("babel-core/register");
// require("babel-polyfill");

import fs from 'fs-extra';
import klaw from 'klaw';
import cliOptions from './cli-options';

// import mime from 'mime-types';
import logger from './logger';
import pkg from '../package.json';

logger.profile('s-sync')
logger.profile('s-sync-walker')



const enKlaw = ( dir ) =>
{
	const allItemsToUpload = [] // files, directories, symlinks, etc

	return new Promise( (resolve, reject) =>
	{
		klaw( dir )
			.on('data', item => {
				// ignore the src folder.
				// TODO: Should ignore dirs entirely and just go with files themselves.
				if( item.path === dir ) return;

				allItemsToUpload.push(item.path)
			})
			.on('error', (err, item) => {
				console.error(item.path) // the file the error occurred on
				console.error(err.message)

				reject(err )
			})
			.on('end', async () =>
			{

				logger.profile('s-sync-walker')

				resolve( allItemsToUpload )
				// process.exit();

			}) // => [ ... array of files]
	})
}

const getCidsForFiles = async ( options ) =>
{
	if( ! options.srcDir )
	{
		logger.error('No src dir provided');
		process.exit(1)
		// throw new Error( 'no src dir provided')
	}

	const srcDir = path.resolve( options.srcDir );
	if(  typeof srcDir !== 'string' ) return logger.error('Weird src dir provided');

	logger.info( srcDir );

	let allItemsToUpload = await enKlaw( srcDir );


	return uploadFiles( allItemsToUpload );
}


const uploadFiles = async ( allItemsToUpload ) => {

	let res;

	logger.info(`Going to be uploading ${allItemsToUpload.length} files...`)
	try{
		const app = await authenticate();
		res = allItemsToUpload.map( async theFilePath => handleFileUpload( app, theFilePath ) )


		await Promise.all( res );

		logger.info('all handleFileUploading done, supposeduly')

	}
	catch( err )
	{
		logger.error( ':(', err )

	}

	return res;

}

(async () => {
	const arrayOfCids = await getCidsForFiles( cliOptions );

	await Promise.all( arrayOfCids.map( async ( fileObj, i ) => {
			const deets = await fileObj;
			console.log( deets.path, deets.uri )
			return;
		})
	)

	logger.profile('s-sync')

	process.exit();
} )()
