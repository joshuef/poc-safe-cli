import "core-js/shim";
import path from 'path';
import cliOptions from './cli-options';
// import logger from './logger';

import { getCidsForFiles } from './utils/files';

// logger.profile( 's-sync' )

( async () =>
{
    const arrayOfCids = await getCidsForFiles( cliOptions );

    await Promise.all( arrayOfCids.map( async ( fileObj, i ) =>
    {
        const deets = await fileObj;
        console.log( deets.path, deets.uri )
        return;
    } )
    )

    // logger.profile( 's-sync' )

    process.exit();
} )()
