import program from 'commander';
import pkg from '../package.json';

program
  .version( pkg.version )
  .option('-s, --src-dir [dir]', 'Source directory to upload')
  .option('-l, --log-level [level]', 'More logs please.')

  // .option('-s, --src-dir', 'Source directory to upload')
  .parse(process.argv);

export default program;
