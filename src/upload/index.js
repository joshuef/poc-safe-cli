#!/usr/bin/env node

import "core-js/shim";
import path from 'path';
import cliOptions from '../cli-options';
import logger from '../logger';

import { uploadFilesAndRetrieveXorUrls } from './files';


// TODO: enable passing file OR dir.
// move immutable upload func into safe-app-node_js
// setup for against live
( async () =>
{
    logger.info( 'starting upload...' )
    const arrayOfXorUrls = await uploadFilesAndRetrieveXorUrls( cliOptions );

    await Promise.all( arrayOfXorUrls.map( async ( fileObj, i ) =>
    {
        const deets = await fileObj;
        console.log( deets.path, deets.uri )
        return;
    } )
    )

    process.exit();
} )()
