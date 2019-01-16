import rdflib from 'rdflib';

import authenticate from './authenticate';
import logger from '../logger';

let app;
const DEFAULT_TYPE_TAG = 17263;

// TODO: Q. how to persist app for many fetches/efficiency?
export const createMutable = async ( data ) =>
{
    logger.trace( 'Creating MD', data )




    // let theOptions = {
    //     ...options,
    //     encrypt : false,
    //     typeTag : DEFAULT_TYPE_TAG
    // }
    app = app || await authenticate();
    let md;

    logger.trace( 'Created md 111111111111111 like' )

    //
    // if( !theOptions.encrypt )
    // {
    md = await app.mutableData.newRandomPublic( DEFAULT_TYPE_TAG );
    // md = await app.mutableData.newRandomPublic( theOptions.typeTag );
    // }
    //
    logger.trace( 'Created md 222222222222222 like' )

    // logger.trace('Created MD')
    //
    // return md;
    let setMd
    try
    {

        setMd= await md.quickSetup( data, 'NFS dataaaaa', 'Something about it' );
        logger.trace( 'Created md quick like' )
        // logger.trace('Createeeeee', await setMd.getNameAndTag())
    }
    catch ( e )
    {
        logger.error( '[[[[[[[[[[[]]]]]]]]]]]',e )

        throw new Error( e )
    }
    logger.trace( 'hmmmmmmmmmmmmmmmmmmmmmmmmme' )

    return md;
}


// export const addEntryToMutable = async ( { md, location, entryKey, entryPath, typeTag = DEFAULT_TYPE_TAG } ) =>
export const addEntryToMutable = async ( options = { } ) =>
{
    logger.trace( 'Adding entry to MD' )
    let theOptions = {
        ...options,
        encrypt : false,
        typeTag : DEFAULT_TYPE_TAG,
    }

    if( ! options.key || !options.value ) throw new Error( 'No data to be adding to MD....' )

    app = app || await authenticate();

    let ourMd = options.md ; // || get the address....

    // try // TODO: Do checks against existing things.
    // optionally do encryption too.
    const mutation = await app.mutableData.newMutation();

    await mutation.insert( options.key, options.value );

    logger.trace( 'mutation inserted successfully:' );

    try
    {
        await ourMd.applyEntriesMutation( mutation );

    }
    catch( e )
    {
        logger.error( e )
    }

    logger.trace( 'MData added successfully:', options.key );

}



const JSON_LD_MIME_TYPE = 'application/ld+json';
const RDF_GRAPH_ID = '@id';

const asyncSerialiseToJson = async ( rdf, id ) =>
{
    logger.info( 'async serlialiseesee' )
    return new Promise( ( resolve, reject ) =>
    {
        const cb = ( err, parsed ) =>
        {
            // console.log('async cv', err, parsed)
            if ( err )
            {
                logger.info( 'async serlialiseesee cbbcbcbcbcbcb! err', err )
                return reject( err );
            }
            resolve( parsed );
        };
        // TODO: serialise it with compact when it's jsonld. This is
        // currently not possible as it's not supporrted by rdflib.js
        rdflib.serialize( null, rdf, id, JSON_LD_MIME_TYPE, cb );
    } );
}

// just pulled out of safeapp for now.
/**
* Commit the RDF document to the underlying MutableData on the network
*
* @param {Boolean} [toEncrypt=false] flag to encrypt the data to be committed
*
* @returns {Promise}
*/
export const commitRdfMdToNetwork = async ( rdf, id, md, toEncrypt = false ) =>
{
    logger.info( '111111111' )
    const serialJsonLd = await asyncSerialiseToJson( rdf, id );
    logger.info( 'serilasedd', serialJsonLd )
    const graphs = JSON.parse( serialJsonLd );
    const mutation = await md.app.mutableData.newMutation();

    // TODO: Enable handling of existing MDs.
    // currently getting entries never returns for new MDs
    try
    {

        // const entries = await md.getEntries();
        // logger.info('2222222222')
        // const entriesList = await entries.listEntries();

    }
    catch( e )
    {
        console.error( 'an error in geEntiresss',e )
    }
    const mData = md;
    const graphPromises = graphs.map( async ( graph ) =>
    {
        const unencryptedKey = graph[RDF_GRAPH_ID];
        let key = unencryptedKey;
        let match = false;

        // find the current graph in the entries list and remove it
        // (before replacing via the rdf graph) this is to be able to remove any
        // remaining entries (not readded via rdf) as they have been
        // removed from this graph.
        // await Promise.all( entriesList.map( async ( entry, i ) =>
        // {
        //     if ( !entry || !entry.key || match ) return;
        //
        //     let keyToCheck = entry.key.toString();
        //
        //     if ( toEncrypt )
        //     {
        //         try
        //         {
        //             const decryptedKey = await mData.decrypt( entry.key );
        //             keyToCheck = decryptedKey.toString();
        //         }
        //         catch ( error )
        //         {
        //             // if ( error.code !== errConst.ERR_SERIALISING_DESERIALISING.code )
        //             // {
        //             logger.warn( 'we dont have error codes yet, this might be one to ignore if its about deserlialising...' );
        //             logger.error( 'Error decrypting MutableData entry in rdf.commit():', error );
        //             // }
        //             // ok, let's then assume the entry is not encrypted
        //             // this maybe temporary, just for backward compatibility,
        //             // but in the future we should always expect them to be encrpyted
        //         }
        //     }
        //
        //     if ( unencryptedKey === keyToCheck )
        //     {
        //         delete entriesList[i];
        //         match = entry;
        //     }
        // } ) );

        let stringifiedGraph = JSON.stringify( graph );
        if ( toEncrypt )
        {
            key = await mData.encryptKey( key );
            stringifiedGraph = await mData.encryptValue( stringifiedGraph );
        }

        if ( match )
        {
            return mutation.update( key, stringifiedGraph, match.value.version + 1 );
        }
        return mutation.insert( key, stringifiedGraph );
    } );

    await Promise.all( graphPromises );

    // remove RDF entries which are not present in new RDF
    // await entriesList.forEach( async ( entry ) =>
    // {
    //     if ( entry )
    //     {
    //         let keyToCheck = entry.key.toString();
    //
    //         if ( toEncrypt )
    //         {
    //             try
    //             {
    //                 const decryptedKey = await mData.decrypt( entry.key );
    //                 keyToCheck = decryptedKey.toString();
    //             }
    //             catch ( error )
    //             {
    //                 // if ( error.code !== errConst.ERR_SERIALISING_DESERIALISING.code )
    //                 // {
    //                 logger.warn( 'we dont have error codes yet, this might be one to ignore if its about deserlialising...' );
    //
    //                 console.warn( 'Error decrypting MutableData entry in rdf.commit():', error );
    //                 // }
    //                 // ok, let's then assume the entry is not encrypted
    //                 // this maybe temporary, just for backward compatibility,
    //                 // but in the future we should always expect them to be encrpyted
    //             }
    //         }
    //
    //         if ( keyToCheck.startsWith( 'safe://' ) )
    //         {
    //             await mutation.delete( entry.key, entry.value.version + 1 );
    //         }
    //     }
    // } );

    await md.applyEntriesMutation( mutation );
    const nameAndTag = await md.getNameAndTag();
    return nameAndTag;
}
