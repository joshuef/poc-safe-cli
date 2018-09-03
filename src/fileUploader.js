import path from 'path';
// import { PerformanceObserver, performance } from 'perf_hooks';
import fs from 'fs-extra';
import {
    MAX_FILE_SIZE,
    UPLOAD_CHUNK_SIZE
} from './constants'
import logger from './logger';


export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

export const handleFileUpload = async ( app, theFilePath, networkPath ) =>
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
        return;

    }

    try
    {
        logger.trace( 's-sync-handling-file-upload-work' )

        const data = await fs.readFileSync( theFilePath ).toString();

        const writer = await app.immutableData.create()
        // TODO: Why is this needed?
        delay( 10000 )
        await writer.write( data )

        //TODO break up data into chunks for progress reportage.

        // await writer.write("second string")
        const cipher = await app.cipherOpt.newPlainText();
        const address= await writer.close( cipher, true )

        return {
            path : theFilePath,
            uri  : `safe://${address.cid}`
        }

        logger.trace( 's-sync-handling-file-upload-work' )

    }
    catch( err )
    {
        logger.error( 'ummm',err );

        throw err;
    }
}
