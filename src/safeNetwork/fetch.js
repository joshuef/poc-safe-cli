import authenticate from './authenticate';
// import logger from '../logger';


// TODO: Q. how to persist app for many fetches/efficiency?
const fetch = async ( uri ) =>
{
    let app = authenticate();

    let data = await app.webFetch( uri );

    return data;
}

export default fetch;
