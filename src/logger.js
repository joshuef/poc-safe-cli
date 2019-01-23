import log from 'bristol';
import palin from 'palin';
import program from 'commander';
import cliOptions from './cli-options';
import path from 'path';


import {
    logFileName,
} from './constants';

var ourLog = new log.Bristol();
// 	levels = error, warn, info, debug, and trace

let logLevel = cliOptions.logLevel;

if( !logLevel )
    logLevel = 'warn';


if( typeof logLevel === 'boolean' )
    logLevel = 'trace';


const rootFolder = path.basename( path.dirname( __dirname ) );

ourLog.addTarget( 'file', { file: path.resolve( process.cwd(), logFileName )} )
    .withLowestSeverity( 'debug' )
    .withHighestSeverity( 'error' );

ourLog.addTarget( 'file', { file: path.resolve( __dirname, '..', logFileName )} )
    .withFormatter( 'human' )
    .withLowestSeverity( 'debug' )
    .withHighestSeverity( 'error' );

ourLog.addTarget( 'console' ).withFormatter( palin,
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
    ourLog.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    ourLog.error( 'whoops! there was an uncaught type error:' );
    ourLog.error( err );
    ourLog.error( err.file );
    ourLog.error( err.line );
} );

process.on( 'uncaughtException', ( err ) =>
{
    ourLog.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    ourLog.error( 'whoops! there was an uncaught error:' );
    ourLog.error( err );
    ourLog.error( err.file );
    ourLog.error( err.line );
} );

process.on( 'unhandledRejection', ( reason, p ) =>
{
    ourLog.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    ourLog.error( 'Unhandled Rejection:' );
    ourLog.error( reason );
} );
export default ourLog;
