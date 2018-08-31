import rdf from 'rdf';
import path from 'path';

// import rdflib from 'rdflib';
import {
	outputFolder,
	vocabMapFileName
} from './constants';

import fs from 'fs-extra';
import klaw from 'klaw';
import program from 'commander';

// import mime from 'mime-types';
import logger from './logger';
import pkg from './package.json';

const args = process.argv;

console.log( path.resolve('./') );

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
	  .on('data', item => allItemsToUpload.push(item.path))
	  .on('end', () => console.dir(allItemsToUpload)) // => [ ... array of files]

}


initUploader( program );
