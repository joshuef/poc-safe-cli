import { authenticate } from '../safeNetwork';
import logger from '../logger';

export const get = async ( uri ) =>
{
    try
    {
        logger.trace( 'Attempting to GET ', uri )
        let app = await authenticate();
        const data = await app.webFetch( uri );
        logger.info( 'data received:' , data.body.toString() )

        return data;
    }
    catch( err )
    {
        logger.error( 'an error in get: ',err )
        throw err;
    }

}

export default get
