import logger from './logger';

export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

// TODO, actual timeout here.
export const waitOn = successCondition =>
{
    logger.trace( '.' );
    if ( !successCondition ) setTimeout( waitOn, 1000, successCondition );
}
