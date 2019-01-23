import path from 'path';
import mime from 'mime-types';
import {
    delay,
    keepAliveUntil
} from '../helpers';
import fs from 'fs-extra';
import {
    MAX_FILE_SIZE,
    UPLOAD_CHUNK_SIZE
} from '../constants'
import logger from '../logger';

export const handleFileUpload = async ( app, theFilePath ) =>
{

    logger.trace( 's-sync-handling-file-upload' )

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

        keepAliveUntil( thisOneIsUploaded );

        logger.trace( 's-sync-handling-file-upload-work begins' )

        let mimeType = mime.lookup(theFilePath);
        if( !mimeType )
        {
            mimeType = 'text/plain';
        }

        logger.info(theFilePath, 'hasMimetype:', mimeType)
        // TODO read prior to auth
        const data = fs.readFileSync( theFilePath ).toString();

        let cipher = app.cipherOpt.newPlainText();

        const writer = await app.immutableData.create()

        await data;
        logger.trace( 'file read...', theFilePath, data.length );
        await writer.write( data )

        cipher = await cipher;

        const address = await writer.close( cipher, true, mimeType );
        logger.trace( 'writer closed...', theFilePath )

        thisOneIsUploaded = true;

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

}
