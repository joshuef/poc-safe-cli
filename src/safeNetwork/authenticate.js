import { initialiseApp } from '@maidsafe/safe-node-app';
import logger from '../logger';


const appInfo = {
    id           : 'net.maidsafe.test.javascript.id',
    name         : 'NodeJS CLI Uploader Test',
    vendor       : 'MaidSafe.net Ltd',
    forceUseMock : true
};


const publicNamesContainerPerms = {
    // _public as used for webId directory for now...
    _public      : ['Insert', 'Update', 'Delete'],
    _publicNames : ['Insert', 'Update', 'Delete'],
};

const authenticate = async ( ) =>
{
    let app;
    try
    {

        app = await initialiseApp( appInfo, null, { forceUseMock: true } );

        if( process.env.NODE_ENV === 'test' )
        {
            await app.auth.loginForTest( null, publicNamesContainerPerms );
        }
        else
        {
            // TODO: STUFF
            // await app.auth.loginForTest( null, publicNamesContainerPerms );

        }
    }
    catch( err )
    {
        logger.error( err.message, err.lineNumber )
    }

    return app;

}


export default authenticate;
