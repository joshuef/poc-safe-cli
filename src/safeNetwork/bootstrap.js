/*
MIT License

APPLICABLE TO THIS FILE ONLY: cli bootstrap is adapted from safe-app-cli.js which is adapted from
https://github.com/project-decorum/decorum-lib/src/Safe.ts
commit: 1d08f743e60c7953169290abaa37179de3508862

Copyright (c) 2018 Benno Zeeman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

/**
 * Authorise app, and/or request access to shared Mutable Data via SAFE Browser
 *
 * This code injects two methods into the nodejs SAFE API object, one for
 * app authorisation and one to request access to a shared Mutable Data.
 */

import fs from 'fs';
import path from 'path';
import ipc from 'node-ipc';
import { initialiseApp, fromAuthUri } from '@maidsafe/safe-node-app';
import cliOptions from '../cli-options';
import {
    PID_LOCATION,
    PLACEHOLDER_SCHEME
} from '../constants';

import logger from '../logger';



process.on( 'SIGINT', function ()
{
    if( ipc && ipc.server )
    {
        ipc.server.stop();
        logger.info('IPC server stopped');
    }
} );


// Request permissions on a shared MD
const fromUri = async ( app, uri ) =>
{
    await app.auth.openUri( uri );

    const uri2 = await ipcReceive( String( process.pid ) );

    return app.auth.loginFromURI( uri2 );
}

// Request authorisation
export const bootstrap = async ( appInfo, appContainers, containerOpts, appInitOptions ) =>
{
    logger.trace( '__dirname: ' + String( __dirname ) )
    logger.trace( '\nSafe.bootstrap()\n  with appInfo: ' + JSON.stringify( appInfo ) +
    '  appInitOptions: ' + JSON.stringify( appInitOptions ) )

    const options = {
        libPath : getLibPath(),
        ...appInitOptions
    }

    await authorise( process.pid, appInfo, appContainers, containerOpts, options )

    logger.trace( 'ipcReceive awaiting...(' + process.pid + ')' )

    let uri = await ipcReceive( String( process.pid ) )

    logger.trace( 'ipcReveiedddd!!!!!!!' )

    // TODO revert to safe-node-app v0.9.1: call fromAuthUri() instead of fromAuthURI()
    return fromAuthUri( appInfo, uri, null, options )
}


const updateOSXHelperApp = async ( registeredScheme ) =>
{
    if( !registeredScheme )
    {
        logger.error( 'Did not register a scheme :(' )
    }
    const urlHelperPlistLocation = path.resolve( __dirname, '../url-helper.app/Contents/Info.plist' );

    return new Promise( (resolve, reject) => {

        logger.info( 'scheme we registered:', registeredScheme )
        logger.info( 'Your plist please....', urlHelperPlistLocation )
        fs.readFile( urlHelperPlistLocation, 'utf8', function ( err,data )
        {
            if ( err )
            {
                reject( err );
            }

            // <string>safe-xxx</string>
            const regex = new RegExp( `\<string\>${PLACEHOLDER_SCHEME}[A-Za-z0-9]*\<\/string\>`, 'g' );
            const present = regex.test( data );

            const result = data.replace( regex, `<string>${registeredScheme}</string>` );

            fs.writeFile( urlHelperPlistLocation, result, 'utf8', function ( err )
            {
                if ( err )
                {
                    reject( err );
                }
                resolve();
            } );
        } );
    })
}

async function authorise ( pid, appInfo, appContainers, containerOpts, options )
{
    // For development can provide a pre-compiled cmd to receive the auth URL
    // This allows the application to be run and debugged using node
    if ( !appInfo.customExecPath )
    {
        appInfo.customExecPath = [
            path.resolve( __dirname, '..', 'index.js' ),
            '--pid',
            String( pid ),
            '--response'
        ];

        const platform = process.platform;

        // we use a special app to send on the args, as we can't register a scheme to just the script.
        if( platform === 'darwin' )
        {
            appInfo.customExecPath = [
                path.resolve( __dirname, '..', 'url-helper.app' )
            ];

            fs.writeFile( PID_LOCATION, String( pid ), 'utf8', function ( err )
            {
                logger.info( 'pid written ' )
                if ( err ) return console.log( err );
            } );

            appInfo.bundle = 'com.maidsafe.url-helper';
        }

        logger.info( 'setting custom exec path:', appInfo, options )
    }

    logger.info( 'call Safe.initializeApp()...' )

    const app = await initialiseApp( appInfo, undefined, options );
    const registeredScheme = app.auth.registeredAppScheme;

    const awaitingOSXAppSetup = updateOSXHelperApp( registeredScheme );

    logger.info( 'call app.auth.genAuthUri()...' )
    const uri = await app.auth.genAuthUri( appContainers, containerOpts )

    logger.info( 'bootstrap.authorise() with appInfo: ' + JSON.stringify( appInfo ) +
    'appContainers: ' + JSON.stringify( appContainers ) )

    await awaitingOSXAppSetup;
    await app.auth.openUri( uri.uri )
}

const ipcReceive = async ( id ) =>
{
    logger.info( 'ipcReceive setup....(' + id + ')' )
    return new Promise( ( resolve ) =>
    {
        ipc.config.id = id
        ipc.config.maxRetries = 50;
        ipc.config.logger = logger.info;

        ipc.serve( () =>
        {
            ipc.server.on( 'auth-uri', ( data ) =>
            {
                // logger.trace( 'on(auth-uri) handling data.message: ' + data.message )
                resolve( data.message )
                ipc.server.stop()
            } )
        } )

        ipc.server.start()
    } )
}

export const ipcSendAuthResponse = async ( id, data ) =>
{
    logger.info( 'ipcSendAuthResponse(' + id + ', ' + data + ')' )

    return new Promise( ( resolve ) =>
    {
        ipc.config.id = id + '-cli'

        ipc.connectTo( id, () =>
        {
            ipc.of[id].on( 'connect', () =>
            {
                logger.info( 'on(connect)' )
                ipc.of[id].emit( 'auth-uri', { id: ipc.config.id, message: data } )

                resolve()
                ipc.disconnect( 'world' )
            } )
        } )
    } )
}

/**
 * @returns
 */
function getLibPath ()
{
    const roots = [
        path.join( __dirname, '../..' ),
        // path.dirname( process.argv[1] )
    ]

    const locations = [
        'node_modules/@maidsafe/safe-node-app/src/native'
    ]

    for ( const root of roots )
    {
        for ( const location of locations )
        {
            const dir = path.join( root, location )

            if ( fs.existsSync( dir ) )
            {
                logger.info( 'getLibPath() returning: ', dir )
                return dir
            }
        }
    }

    logger.info( 'No library directory found.' )
    throw Error( 'No library directory found.' )
}

// module.exports = Safe
