import cliOptions from './cli-options';
import logger from './logger';
import { fetch } from './safeNetwork';

logger.profile('s-get')


// TODO: why is console.log failing here?
(async () => {

	const data = await fetch( cliOptions.get );
	logger.profile('s-get')
	console.log(data)
	process.exit();
} )()
