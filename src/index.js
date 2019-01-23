#!/usr/bin/env node
import "core-js/shim";

import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw';

import {PID_LOCATION} from './constants';
import logger from './logger';
import cliOptions from './cli-options';
import { ipcSendAuthResponse } from './safeNetwork/bootstrap';
export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// logger.info('Root index was called', cliOptions)


export const enKlaw = ( dir ) =>
{
    logger.info( 's-sync-walker started' )
    const allPids = [] // files, directories, symlinks, etc

    return new Promise( ( resolve, reject ) =>
    {
        klaw( dir )
            .on( 'data', item =>
            {
                let base = path.basename( item.path );

                // console.log('base', base)
                // ignore the src folder.
                // TODO: Should ignore dirs entirely and just go with files themselves.
                if( ! base.includes( '.pid' ) ) return;

                console.log('this one exists', base)
                allPids.push( item.path )
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

                resolve( allPids )

            } ) // => [ ... array of files]
    } )
}


( async () =>
{
    // logger.warn('all things passed in', cliOptions)
    // logger.warn('all things passed in argv', process.argv)
    const response = cliOptions.response;

    let pid = cliOptions.pid;

    if( process.platform !== 'darwin')
    {
        logger.info( 'pid', pid )

        if ( pid === undefined )
        {
            throw Error( '--pid undefined' )
        }

        if ( response === undefined )
        {
            throw Error( '--response undefined' )
        }

        logger.warn( 'ipcSendAuthResponse(' + pid + ',' + cliOptions.response + ')' )
        await ipcSendAuthResponse( String( pid ), cliOptions.response )

    }

    if( process.platform === 'darwin')
    {
        // pid = fs.readFileSync( PID_LOCATION, 'utf8' );
        const foundPids = await enKlaw( PID_LOCATION );

        if( ! foundPids.length > 0 )
        {
            throw Error( 'no pid file found' )

        }

        for (var i = 0; i < foundPids.length; i++) {
            // const thePid = foundPids[i]
            const thePid = fs.readFileSync( foundPids[i] );
            try{

                await ipcSendAuthResponse( String( thePid ), cliOptions.response );

                logger.trace('send something successfully...', thePid);
                break;
            }
            catch( e )
            {
                logger.trace('one IPC not found... doesnt matter probably')
            }

        }


        logger.trace('ALL PIDDDSSSSSS', foundPids);
    }


    logger.warn( 'root of all safe' , pid, response  );

    // await delay( 1000 )
    process.exit();
} )()
