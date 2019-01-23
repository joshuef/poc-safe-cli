#!/usr/bin/env node
import "core-js/shim";

import {PID_LOCATION} from './constants';
import logger from './logger';
import cliOptions from './cli-options';
import { ipcSendAuthResponse } from './safeNetwork/bootstrap';
import fs from 'fs-extra';
export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// logger.info('Root index was called', cliOptions)


( async () =>
{
    // logger.warn('all things passed in', cliOptions)
    // logger.warn('all things passed in argv', process.argv)
    const response = cliOptions.response;

    let pid = cliOptions.pid;

    if( process.platform === 'darwin')
    {
        pid = fs.readFileSync( PID_LOCATION, 'utf8' );
    }

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

    logger.warn( 'root of all safe' , pid, response  );

    // await delay( 1000 )
    process.exit();
} )()
