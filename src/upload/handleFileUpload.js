import path from 'path';
import mime from 'mime-types';
// import { PerformanceObserver, performance } from 'perf_hooks';
import fs from 'fs-extra';
import {
    MAX_FILE_SIZE,
    UPLOAD_CHUNK_SIZE
} from '../constants'
import logger from '../logger';


export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );


// TODO, actual timeout here.
const waitOn = successCondition =>
{
    logger.trace( 'wating....', successCondition );
    if ( !successCondition ) setTimeout( waitOn, 1000, successCondition );
}

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
        let thisOneIsUploaded = false;

        waitOn( thisOneIsUploaded );

        logger.trace( 's-sync-handling-file-upload-work begins' )

        logger.trace( 'begin of readfile', theFilePath )

        let mimeType = mime.lookup(theFilePath);
        if( !mimeType )
        {
            mimeType = 'text/plain';
        }

        logger.info(theFilePath, 'hasMimetype:', mimeType)
        // TODO read prior to auth
        const data = fs.readFileSync( theFilePath ).toString();

        let cipher = app.cipherOpt.newPlainText();
        // console.log( 'cypher...', cipher )
        // logger.trace( 'cypher... for...', theFilePath )


        const writer = await app.immutableData.create()
        // console.log( 'wriiiiiiiter' )
        logger.trace( 'writer created... for', theFilePath )
        // TODO: Why is this needed?
        // delay( 5000 )

        await data;
        logger.trace( 'file read...', theFilePath, data.length );
        await writer.write( data )

        // return 'boom'

        //  const cipherOpt = await app.cipherOpt.newPlainText();
        // const immdWriter = await app.immutableData.create();
        // await idWriter.write('<public file buffer data>');
        // const idAddress = await idWriter.close(cipherOpt);

        logger.trace( 'writer writ...', theFilePath )
        //TODO break up data into chunks for progress reportage.


        cipher = await cipher;


        const address = await writer.close( cipher, true, mimeType );
        logger.trace( 'writer closed...', theFilePath )

        thisOneIsUploaded = true;
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
