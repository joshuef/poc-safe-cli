import { initialiseApp } from '@maidsafe/safe-node-app';
import logger from '../logger';
import { bootstrap } from './bootstrap';

const appInfo = {
    id     : 'net.maidsafe.cli2.javascript.id',
    name   : 'NodeJS CLI Uploader Test',
    vendor : 'MaidSafe.net Ltd',
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

        if( process.env.NODE_ENV === 'test' )
        {
            app = await initialiseApp( appInfo, null, {
                forceUseMock           : true,
                // registerScheme : true,
                enableExperimentalApis : true
            } );

            await app.auth.loginForTest( null, publicNamesContainerPerms );
        }
        else
        {
            const env = process.env.NODE_ENV;
            const useMock = /dev/.test( env );
            logger.info( 'usemock', useMock );
            const appInitOptions = {
                forceUseMock           : useMock,
                registerScheme         : true,
                enableExperimentalApis : true
            }
            const containerOptions = null;
            app = await bootstrap( appInfo, publicNamesContainerPerms, containerOptions, appInitOptions )
            logger.info( 'Registered Scheme>>>>>>>>>>>>>>>>>>>>', app.auth.registeredScheme )
            // console.warn( 'Nothing has been set up with attempting to auth. Use NODE_ENV=test')
            // TODO: STUFF
            // const authUri = await app.auth.genAuthUri( publicNamesContainerPerms );

        }
    }
    catch( err )
    {
        throw err
        // logger.error( err.message, err.lineNumber )
    }

    return app;

}


export default authenticate;
