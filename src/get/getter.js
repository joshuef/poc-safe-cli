import { authenticate } from '../safeNetwork';
import logger from '../logger';

export const get = async ( uri ) =>
{
    try
    {
        let app = await authenticate();
        const data = await app.webFetch( uri );
        logger.info( 'data received:' , data.body.toString() )
    }
    catch( err )
    {
        logger.error( 'an error in get: ',err )
        throw err;
    }

}

export default get
