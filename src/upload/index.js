#!/usr/bin/env node

import "core-js/shim";
import path from 'path';
import cliOptions from '../cli-options';
import logger from '../logger';
import { authenticate } from '../safeNetwork';
import { uploadFilesAndRetrieveXorUrls } from './files';


// TODO: enable passing file OR dir.
// move immutable upload func into safe-app-node_js
// setup for against live
const doUploading =  async () =>
{
    logger.info( 'starting upload...' )

    const app = await authenticate();

    logger.trace( 'about to upload stuff' )

    const testString = `test-${Math.random()}`;
      const idWriter = await app.immutableData.create();
      await idWriter.write(testString);
      const cipherOpt = await app.cipherOpt.newPlainText();
      const idAddress = await idWriter.close(cipherOpt);
      const data = await app.immutableData.fetch(idAddress);

console.log('??????????????',data);
    //
    // const arrayOfXorUrls = await uploadFilesAndRetrieveXorUrls( cliOptions );
    //
    // let allUploaded = await Promise.all( arrayOfXorUrls );

    // console.log('alluploaded?', allUploaded)
    // await Promise.all( arrayOfXorUrls.map( async ( fileObj, i ) =>
    // {
    //     const deets = await fileObj;
    //     console.log( deets.path, deets.uri )
    //     return;
    // } ) )

    // process.exit();
}


doUploading();
