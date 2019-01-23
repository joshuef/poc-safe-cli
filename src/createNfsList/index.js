#!/usr/bin/env node

import "core-js/shim";
// import logger from '../logger';
import cliOptions from '../cli-options';
// import {addNfsListing, createNfsList} from './createNfsList';
import { createNfsList} from './createNfsList';

const stdin = process.openStdin();

let data = [];

// stdin.resume();
// stdin.setEncoding( 'utf8' );
//
// // when interrupt.
// process.on( 'SIGINT', function ()
// {
//     console.log( 'Got a SIGINT. Goodbye cruel world' );
//     process.exit( 0 );
// } );
//
// let mutableDatum;
// const dataObj = {};


const test = async () =>
{
    //TESTING
    const url = await createNfsList( {
        'somefile/path'    : 'safe://somewhereerreee',
        // 'another/path'     : 'safe://else',
        // 'another/path/sub' : 'safe://again'
    } );

    console.log('we have a urll:', url)
}

test();
// stdin.on( 'data', async ( chunk ) =>
// {
//
//     logger.info( 'receiving data in createnfs', chunk )
//     const chunkArray =  chunk.split( '\n' ) ;
//
//     chunkArray.forEach( async d =>
//     {
//         const uriPair = d.split( ' ' );
//
//         const path = uriPair[0];
//         const uri = uriPair[1];
//         if( !path.length || ! uri.length ) return;
//
//
//         dataObj[path] = uri;
//
//     } );
//
// } );
//
// stdin.on( 'end', async () =>
// {
//
//
//     let filesMapUrl = await createNfsList( dataObj );
//
//     console.log( filesMapUrl )
//     process.exit();
// } );
