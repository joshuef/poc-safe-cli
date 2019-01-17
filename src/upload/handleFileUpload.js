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

    // return delay(10000)
    // return new Promise( async ( resolve, reject ) =>
    // {
    logger.trace( 's-sync-handling-file-upload' )


    // TODO:
    // Enable a target url for files.
    // Build out public/subPublicName for these if needed.
    // Enable linking a file direct to an existing pub/subPub.

    const fileName = path.basename( theFilePath );
    const size = await fs.stat( theFilePath ).size;

    if ( size > MAX_FILE_SIZE )
    {
        logger.error( `${theFilePath} is larger than the allowed file size of ${MAX_FILE_SIZE / 1000000 }` )
        throw new Error( `${theFilePath} is larger than the allowed file size of ${MAX_FILE_SIZE / 1000000 }` )

    }

    try
    {
        logger.trace( 's-sync-handling-file-upload-work begins' )

        logger.trace( 'begin of readfile', theFilePath )

        // TODO read prior to auth
        const data = fs.readFileSync( theFilePath );

        let string = data.toString()


        // return string.length;
        const cipher = app.cipherOpt.newPlainText();



        // TODO: Why is this needed?
        // delay( 5000 )

        // await data.toString();
        logger.trace( 'file read...', theFilePath, string.length );
        const writer = await app.immutableData.create();

        // return writer;
        // console.log( 'wriiiiiiiter' )
        logger.trace( 'writer created... for', theFilePath )
        let writing = writer.write( string )

        // return 'boom'

        //  const cipherOpt = await app.cipherOpt.newPlainText();
        // const immdWriter = await app.immutableData.create();
        // await idWriter.write('<public file buffer data>');
        // const idAddress = await idWriter.close(cipherOpt);

        //TODO break up data into chunks for progress reportage.

        const mimeType = 'text/plain';
        await cipher;
        await writing;

        logger.trace( 'writer writ...', theFilePath )
        const address = await writer.close( cipher, true, mimeType );
        logger.trace( 'writer closed...', theFilePath )

        // if( /dev/.test( process.env.NODE_ENV ) )
        // {
        //     await delay( 10000 );
        // }

        logger.trace( 's-sync-handling-file-upload-work ends', address.xorUrl )
        return( {
            path : theFilePath,
            uri  : address.xorUrl
        } )


    }
    catch( err )
    {
        logger.error( 'FileUploader problems', err );

        throw err ;
    }

    // } )

}
