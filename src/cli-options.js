import program from 'commander';
import pkg from '../package.json';

program
    .version( pkg.version )
    .allowUnknownOption()
    // .option( '-s, --src-dir [dir]', 'Source directory to upload' )
    .option( '-s, --src-dir [dir]', 'Source directory to upload' )
    .option( '-l, --log-level [level]', 'More logs please.' )
    .option( '-p, --pid [process id]', 'Process ID.' )
    .option( '-r, --response [response URI]', 'Authenticator response URI.' )

// TODO: Separate these out...?
    .option( '-g, --get [uri]', 'safe://<uri><to><get>' )
    .parse( process.argv );

export default program;
