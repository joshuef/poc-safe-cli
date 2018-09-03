import "core-js/shim";
import path from 'path';
import cliOptions from '../cli-options';
import logger from '../logger';

import { getCidsForFiles } from './files';


// TODO: enable passing file OR dir.
// move immutable upload func into safe-app-node_js
// setup for against live
( async () =>
{
    logger.info( 'starting upload...' )
    const arrayOfCids = await getCidsForFiles( cliOptions );

    await Promise.all( arrayOfCids.map( async ( fileObj, i ) =>
    {
        const deets = await fileObj;
        console.log( deets.path, deets.uri )
        return;
    } )
    )

    process.exit();
} )()
