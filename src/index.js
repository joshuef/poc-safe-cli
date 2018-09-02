import rdf from 'rdf';
import path from 'path';
import { authenticate } from './safeNetwork';
import { handleFileUpload } from './fileUploader';

require("babel-core/register");
require("babel-polyfill");

// import rdflib from 'rdflib';
// import {
// 	outputFolder,
// 	vocabMapFileName
// } from './constants';

import fs from 'fs-extra';
import klaw from 'klaw';
import program from 'commander';

// import mime from 'mime-types';
import logger from './logger';
import pkg from '../package.json';

logger.profile('s-sync')
logger.profile('s-sync-walker')


program
  .version( pkg.version,  )
  .option('-s, --src-dir [dir]', 'Source directory to upload')
  // .option('-s, --src-dir', 'Source directory to upload')
  .parse(process.argv);


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
				console.error(err.message)
				console.error(item.path) // the file the error occurred on

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

const initUploader = async ( options ) =>
{
	// console.log(options);
	// return new Promise( (resolve, reject ) =>
	// {

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

		// let fun = async () =>
		// {
		//

			let truedDone = await handleFiles( allItemsToUpload );
			console.log('end of walk')
			// resolve(truedDone);

			console.log(truedDone);
		// }

		console.log('the init options is done')
	// })

}


const handleFiles = async ( allItemsToUpload ) => {

	let res;

	console.log( allItemsToUpload)
	logger.info(`Going to be uploading ${allItemsToUpload.length} files...`)
	try{
		const app = await authenticate();
		res = allItemsToUpload.map( async theFilePath =>
		{
			return handleFileUpload( app, theFilePath );


			// return new Promise( async (resolve, reject) =>
			// {
			// 	try{
			//
			// 		// res.push(cid);
			// 		resolve( cid )
			// 	}catch( e )
			// 	{
			// 		reject( e );
			// 	}
			//
			// })

		})

		console.log('ressssss before done', res );

		let done = await Promise.all( res );

		console.log('afterrr', done)
		logger.info('all handleFileUploading done, supposeduly')

	}
	catch( err )
	{
		logger.error( ':(', err )

	}


		logger.profile('s-sync')

		console.log('DONED:   ' , res)
		return res;
	// return 'done';
	// })
}


// initUploader( program )
// 	.then( d =>
// 	{
// 		console.log('that is this done', d)
// 	})


(async () => console.log( await initUploader( program ) ) )()
