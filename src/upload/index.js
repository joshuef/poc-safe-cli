#!/usr/bin/env node

import "core-js/shim";
import path from 'path';
import cliOptions from '../cli-options';
import logger from '../logger';

import { uploadFilesAndRetrieveXorUrls } from './files';


// TODO: enable passing file OR dir.
// move immutable upload func into safe-app-node_js
// setup for against live
const doUploading =  async () =>
{
    logger.info( 'starting upload...' )
    const arrayOfXorUrls = await uploadFilesAndRetrieveXorUrls( cliOptions );

    let allUploaded = await Promise.all( arrayOfXorUrls );


    allUploaded.map( async ( fileObj, i ) =>
    {
        // const deets = fileObj;
        console.log( fileObj.path, fileObj.uri )
        return;
    } )

    process.exit();
}


doUploading();
