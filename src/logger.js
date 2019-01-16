import log from 'bristol';
import palin from 'palin';
import program from 'commander';
import cliOptions from './cli-options';
import path from 'path';


import {
    logFileName,
} from './constants';


// 	levels = error, warn, info, debug, and trace

let logLevel = cliOptions.logLevel;

if( !logLevel )
    logLevel = 'warn';


if( typeof logLevel === 'boolean' )
    logLevel = 'trace';


const rootFolder = path.basename( path.dirname( __dirname ) );

log.addTarget( 'file', { file: path.resolve( process.cwd(), logFileName )} )
    .withLowestSeverity( 'debug' )
    .withHighestSeverity( 'error' );

log.addTarget( 'file', { file: path.resolve( __dirname, '..', logFileName )} )
    .withFormatter( 'human' )
    .withLowestSeverity( 'debug' )
    .withHighestSeverity( 'error' );

log.addTarget( 'console' ).withFormatter( palin,
    {
        //shorten log output to contents of this folder.
	    rootFolderName : rootFolder,
        objectDepth    : 4 // more js output
	  }
)
    .withLowestSeverity( logLevel )
    .withHighestSeverity( 'error' )



process.on( 'uncaughtTypeError', ( err ) =>
{
    log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.error( 'whoops! there was an uncaught type error:' );
    log.error( err );
    log.error( err.file );
    log.error( err.line );
} );

process.on( 'uncaughtException', ( err ) =>
{
    log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.error( 'whoops! there was an uncaught error:' );
    log.error( err );
    log.error( err.file );
    log.error( err.line );
} );

process.on( 'unhandledRejection', ( reason, p ) =>
{
    log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.error( 'Unhandled Rejection:' );
    log.error( reason );
} );
export default log;
