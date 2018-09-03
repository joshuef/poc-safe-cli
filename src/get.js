import cliOptions from './cli-options';
import { webFetch } from '@maidsafe/safe-node-app';

import logger from './setuplog';
// import log from 'bristol';


// TODO: why is console.log failing here?
( async () =>
{
	logger.info( 's-get' )
	try{

		const data = await webFetch( cliOptions.get );
		// logger.info( 's-get' )
		logger.info( data )
	}
	catch( err )
	{
		logger.error( err )
	}
    process.exit();
} )()
