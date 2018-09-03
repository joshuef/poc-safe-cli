import cliOptions from './cli-options';
import { authenticate } from './safeNetwork';
import logger from './logger';

( async () =>
{
    logger.info( 's-get starting' )
    try
    {
		let app = await authenticate();
        const data = await app.webFetch( cliOptions.get );
        // logger.info( 's-get' )
        logger.info( 'data received:' , data.body.toString() )
    }
    catch( err )
    {
        logger.error( 'an error in get: ',err )
    }
    process.exit();
} )()
