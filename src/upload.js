import "core-js/shim";
import path from 'path';
import cliOptions from './cli-options';
import logger from './setuplog';

import { getCidsForFiles } from './utils/files';

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
