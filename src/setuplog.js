import log from 'bristol';
import palin from 'palin';
import program from 'commander';
import cliOptions from './cli-options';
import path from 'path';


// 	levels = error, warn, info, debug, and trace

let logLevel = cliOptions.logLevel;

if( typeof logLevel === 'boolean' )
{
    logLevel = 'verbose';
}

const rootFolder = path.basename( path.dirname( __dirname ) );

// log.addTarget( 'file', { file: path.resolve( process.cwd(), 's-cli.log' )} )
log.addTarget( 'console' ).withFormatter( palin,
    {
        //shorten log output to contents of this folder.
	    rootFolderName : rootFolder,
        objectDepth    : 4 // more js output
	  }
);

export default log;
