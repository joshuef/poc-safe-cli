import rdf from 'rdf';
import path from 'path';
import { authenticate } from './src/safeNetwork';
import { handleFileUpload } from './src/fileUploader';

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
import pkg from './package.json';

logger.profile('s-sync')
logger.profile('s-sync-walker')


program
  .version( pkg.version,  )
  .option('-s, --src-dir [dir]', 'Source directory to upload')
  // .option('-s, --src-dir', 'Source directory to upload')
  .parse(process.argv);

const initUploader = ( options ) =>
{
	// console.log(options);

	if( ! options.srcDir ) return logger.error('No src dir provided');

	const srcDir = path.resolve( options.srcDir );
	if(  typeof srcDir !== 'string' ) return logger.error('Weird src dir provided');

	logger.info( srcDir );
	const allItemsToUpload = [] // files, directories, symlinks, etc


	klaw( srcDir )
	  .on('data', item => {
		  // ignore the src folder.
		  // TODO: Should ignore dirs entirely and just go with files themselves.
		  if( item.path === srcDir ) return;

		  allItemsToUpload.push(item.path)
	  })
	  .on('error', (err, item) => {
		   console.error(err.message)
		   console.error(item.path) // the file the error occurred on
		 })
	  .on('end', () =>
	  {
		  logger.profile('s-sync-walker')

		  handleFiles( allItemsToUpload )
	  }) // => [ ... array of files]

}


const handleFiles = async ( allItemsToUpload ) => {
	const app = await authenticate();

	// allItemsToUpload.forEach( theFilePath =>
	// {
	let res;

	try{
		res = await handleFileUpload( app, allItemsToUpload[0] )

		logger.info('handleFileUpload done, supposeduly')

	}
	catch( e)
	{
		logger.error( ':(', err )

	}


		logger.profile('s-sync')

		console.log('DONED:   ' , res)

		process.exit();
	// })
}


initUploader( program );
