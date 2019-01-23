import logger from './logger';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// TODO, actual timeout here.
export const keepAliveUntil = successCondition =>
{
    logger.trace( '.' );
    if ( !successCondition ) setTimeout( keepAliveUntil, 1000, successCondition );
}
