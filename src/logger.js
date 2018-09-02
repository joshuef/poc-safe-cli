import winston from 'winston';
import program from 'commander';
import cliOptions from './cli-options';



// 	const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   verbose: 3,
//   debug: 4,
//   silly: 5
// };
//
//

let logLevel = cliOptions.logLevel;

if( typeof logLevel === 'boolean' )
{
		logLevel = 'verbose';
}

const logger = winston.createLogger({
  // levels: 'cli',
  // colorize: 'al/l'

  // format: winston.format.json(),
  // colorize: true,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
	new winston.transports.Console({
	  format: winston.format.combine(
	            winston.format.colorize(),
	            winston.format.simple()
			),
			level: logLevel || 'error'
			// prettyPrint: true
	})
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
  ]
});

// logger.cli();

export default logger;
