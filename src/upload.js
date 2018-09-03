import "core-js/shim";
import path from 'path';
import cliOptions from './cli-options';
import log from 'bristol';

import { getCidsForFiles } from './utils/files';

// log.profile( 's-sync' )
( async () =>
{
	log.info('starting upload.....')
    const arrayOfCids = await getCidsForFiles( cliOptions );

    await Promise.all( arrayOfCids.map( async ( fileObj, i ) =>
    {
        const deets = await fileObj;
        console.log( deets.path, deets.uri )
        return;
    } )
    )

    // log.profile( 's-sync' )

    process.exit();
} )()
