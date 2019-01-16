import { FilesMap, FileItem } from 'safe-schema';
import { shepherd } from 'semantic-shepherd';
import { resolveableMap, safeId } from 'safe-schema';
import { man, validate } from 'rdf-check-mate';
import rdflib from 'rdflib';

import logger from '../logger';
import {
    authenticate,
    addEntryToMutable,
    commitRdfMdToNetwork,
    createMutable
} from '../safeNetwork';
import { RDF_NFS_TYPE_TAG } from '../constants';


let app;


logger.warn( `If FilesMap returns undefined, you need ot remember:
    right now, we need to build all the RDF deps (and probably link em),
    nothing is published yet! the type of FilesMap is: ${typeof FilesMap}` );
// const createNfsList = async ( { mdlocationUri = '', pathsCasArray = [], encrypt = false } ) =>
export const createNfsList = async ( data , targetXorAddress ) =>
{
    logger.info( 'data', data )
    if( !data || typeof data !== 'object' )
    {
        logger.error( 'data is not an object', data )
        // throw new Error( 'Data passed into createNfsList should be an array.')
    }

    // try
    // {
    app = await authenticate();
    // }
    // catch( err )
    // {
    //     logger.error( ':(', err )
    // }


    let ourTargetMD;
    // If a XOR exists, update. If not. create....
    if( targetXorAddress )
    {
        throw new Error( 'no handling for existing MDs at this point' )
        ourTargetMD = await app.mutableData.newPublic( targetXorAddress, RDF_NFS_TYPE_TAG );
    }
    else
    {

        ourTargetMD = await app.mutableData.newRandomPublic( RDF_NFS_TYPE_TAG );
        await ourTargetMD.quickSetup( {} )
    }

    const safeRDF = ourTargetMD.emulateAs( 'rdf' );


    // TODO: this needs to have an ID to be passed to RDFMEPLZ
    const ourFilesMap = {
        version : "1",
        id      : 'safe://someXORofamap',
        default : 'safe://someXORofamap',
    };

    logger.trace( 'Creationinnnnn NFS', ourFilesMap );

    //safe schema defaultValue...
    const result = await man( FilesMap );
    logger.trace( 'man outcome',result )
    const valid =  await validate( FilesMap, ourFilesMap );
    logger.trace( 'validity check outcome',valid )

    let rdfObj = await shepherd( ourFilesMap, FilesMap );

    safeRDF.rdf = rdfObj;

    //yes this is not the most efficient.
    let allItemsArray = Object.keys( data ).map( async ( location ) =>
    {
        console.log( 'location', location )
        console.log( 'xorUrl', data[ location ] )

        const target = data[ location ];

        const fileItem = {
            id : `${ourFilesMap.id}/${location}`,
            target
        };


        const valid =  await validate( FileItem, ourFilesMap );
        logger.trace( 'validity check outcome or fileItem',valid )

        let thisItem = await shepherd( fileItem, FileItem );

        rdfObj.add( thisItem )
    } )

    await Promise.all( allItemsArray );

    let fileMapResolver;
    let fileMapTurtle = new Promise( ( resolve, reject ) =>
    {
        fileMapResolver = resolve;
    } );

    // console.log(rdfObj)
    rdflib.serialize( null, rdfObj, ourFilesMap.id, 'text/turtle', ( err, result ) =>
    {
        new Promise( ( resolve, reject ) =>
        {
            if( err )
            {
                logger.error( '!!!!!!!!!!!!!!!!!errorrrr', err )
                throw new Error( err );
            }

            fileMapResolver( result )
        } );
    } );

    fileMapTurtle = await fileMapTurtle;

    logger.info( 'SERLIALISEDDDDD THE fileMapTurtle RESOLVEABLEMAPPP' )
    console.log( 'fulllllllllllllll filemap',fileMapTurtle )
    let location;

    try
    {

        logger.info( ':::::::::::::::::::::::::' )
        location = await commitRdfMdToNetwork( rdfObj, ourFilesMap.id, ourTargetMD );
    }
    catch( e )
    {
        logger.error( 'problem with puttting to network', e )
    }


    logger.info( 'comitttttteedddddddd' )
    return location.xorUrl;
    // logger.trace( 'And our data to be saving:', data );
}

export const addNfsListing = async ( md, key, value ) =>
{
    logger.trace( 'addNfsListing' )
    await addEntryToMutable( { md, key, value } );

    logger.trace( 'addNfsListing done!!!!! for', key );

}



// createNfsList();
