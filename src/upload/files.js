import "core-js/shim";
import path from 'path';
import fs from 'fs-extra';
import klaw from 'klaw';
import logger from '../logger';
import { authenticate } from '../safeNetwork';
import { handleFileUpload } from './handleFileUpload';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );


export const enKlaw = ( dir ) =>
{
    logger.info( 's-sync-walker started' )
    const allItemsToUpload = [] // files, directories, symlinks, etc

    return new Promise( ( resolve, reject ) =>
    {
        klaw( dir )
            .on( 'data', item =>
            {
                // ignore the src folder.
                // TODO: Should ignore dirs entirely and just go with files themselves.
                if( item.path === dir ) return;

                allItemsToUpload.push( item.path )
            } )
            .on( 'error', ( err, item ) =>
            {
                logger.error( item.path ) // the file the error occurred on
                logger.error( err.message )

                reject( err )
            } )
            .on( 'end', async () =>
            {

                logger.info( 's-sync-walker ended' )

                resolve( allItemsToUpload )
                // process.exit();

            } ) // => [ ... array of files]
    } )
}

export const uploadFilesAndRetrieveXorUrls = async ( options ) =>
{
    if( ! options.srcDir )
    {
        logger.error( 'No src dir provided' );
        // process.exit( 1 )
        throw new Error( 'no src dir provided')
    }

    const srcDir = path.resolve( options.srcDir );
    if(  typeof srcDir !== 'string' ) return logger.error( 'Weird src dir provided' );

    logger.trace( 'received srcDir:', srcDir );

    let allItemsToUpload = await enKlaw( srcDir );

    logger.trace('klawed');
    let res;

    logger.info( `Going to be uploading ${allItemsToUpload.length} files...` )
    try
    {
        const app = await authenticate();

        logger.trace('about to upload stuff')
        //returning promises
        res = allItemsToUpload.map( async theFilePath => handleFileUpload( app, theFilePath ) )
        // res = allItemsToUpload.map( async theFilePath => delay(10000) )

        // let something = await Promise.all( res );

        // logger.info( 'all handleFileUploading done, supposedly', something )

    }
    catch( err )
    {
        logger.error( ':(', err )
        throw err;
    }

    return res;
}
