#!/usr/bin/env node

import "core-js/shim";
import logger from '../logger';
import cliOptions from '../cli-options';
import get from './getter';

// self executing cli func
( async () =>
{
    logger.info( 's-get starting' );

    await get( cliOptions.get );

    process.exit();
} )()
