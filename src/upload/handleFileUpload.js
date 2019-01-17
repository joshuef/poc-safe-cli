import path from 'path';
// import { PerformanceObserver, performance } from 'perf_hooks';
import fs from 'fs-extra';
import {
    MAX_FILE_SIZE,
    UPLOAD_CHUNK_SIZE
} from '../constants'
import logger from '../logger';


export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

export const handleFileUpload = async ( app, theFilePath ) =>
{
    logger.trace( 's-sync-handling-file-upload' )


    // TODO:
    // Enable a target url for files.
    // Build out public/subPublicName for these if needed.
    // Enable linking a file direct to an existing pub/subPub.

    const fileName = path.basename( theFilePath );
    const size = fs.statSync( theFilePath ).size;

    if ( size > MAX_FILE_SIZE )
    {
        logger.error( `${theFilePath} is larger than the allowed file size of ${MAX_FILE_SIZE / 1000000 }` )
        throw error( `${theFilePath} is larger than the allowed file size of ${MAX_FILE_SIZE / 1000000 }` );

    }

    try
    {
        logger.trace( 's-sync-handling-file-upload-work begins' )

        logger.trace('begin of readfile')
        const data = await fs.readFileSync( theFilePath ).toString();

        const cipher = await app.cipherOpt.newPlainText();
        logger.trace( 'cypher...' )

        const writer = await app.immutableData.create()

        logger.trace( 'writer created...' )
        // TODO: Why is this needed?
        // delay( 5000 )
        await writer.write( data )


       //  const cipherOpt = await app.cipherOpt.newPlainText();
       // const immdWriter = await app.immutableData.create();
       // await idWriter.write('<public file buffer data>');
       // const idAddress = await idWriter.close(cipherOpt);

        logger.trace( 'writer writ...' )
        //TODO break up data into chunks for progress reportage.

        const mimeType = 'text/plain';
        const address = await writer.close( cipher, true, mimeType );
        logger.trace( 'writer closed...' )

        // if( /dev/.test( process.env.NODE_ENV ) )
        // {
        //     await delay( 10000 );
        // }

        logger.trace( 's-sync-handling-file-upload-work ends', address.xorUrl )
        return {
            path : theFilePath,
            uri  : address.xorUrl
        }


    }
    catch( err )
    {
        // logger.error( 'FileUploader problems' );

        throw err;
    }
}
