import path from 'path';
import fs from 'fs-extra';
import {
	MAX_FILE_SIZE,
	UPLOAD_CHUNK_SIZE
} from './constants'
import logger from './logger';


export const delay = time => new Promise( resolve => setTimeout( resolve, time ) );

//
// const writeFile = ( app, dataToWrite) => (
//       new Promise(async (resolve, reject) => {
// 		  // const containerPath = parseNetworkPath(this.networkPath);
// 		  //
// 		  // fileObject
// 		  // TODO, get path from fileObectt????? OR WHAT....
// 		  const theFilePath = '?';
//     const fileStats = fs.statSync( file );
//     let chunkSize = UPLOAD_CHUNK_SIZE;
//     const fileData = fs.openSync( file, 'r');
//     let offset = 0;
//     let buffer = null;
//     const { size } = fileStats;
//
//
//
//         try {
//           // if (this.cancelled) {
//           //   return reject(new Error());
//           // }
//
//           if (dataToWrite < chunkSize) {
//             chunkSize = dataToWrite;
//           }
//
//
//           buffer = Buffer.alloc(chunkSize);
//           fs.readSync(fileData, buffer, 0, chunkSize, offset);
//           await fileObject.write(buffer);
//           offset += chunkSize;
//           dataToWrite -= chunkSize;
//
//           if (offset === size) {
//             callback(null, {
//               isFile: true,
//               isCompleted: false,
//               size: chunkSize,
//             });
//             await file.close();
//             return resolve(file);
//           }
//           callback(null, {
//             isFile: true,
//             isCompleted: false,
//             size: chunkSize,
//           });
//           await writeFile(file, dataToWrite);
//           resolve();
//         } catch (err) {
//           reject(err);
//         }
//       })
//     );


export const handleFileUpload = ( app, theFilePath, networkPath ) =>
{

	return new Promise( async ( resolve, reject ) =>
	{
		// await delay(2500)
		// resolve('yaaaaas')
		logger.profile('s-sync-handling-file-upload')

		console.log('handling file upload')
		// constructor(api, localPath, networkPath) {
		// super();
		// this.api = api;
		// this.localPath = localPath;
		// this.networkPath = networkPath;
		// this.cancelled = false;
		// }

		// TODO:
		// Enable a target url for files.
		// Build out public/subPublicName for these if needed.
		// Enable linking a file direct to an existing pub/subPub.

		const fileName = path.basename(theFilePath);
		const size = fs.statSync(theFilePath).size;

		if (size > MAX_FILE_SIZE)
		{
			logger.error( `${theFilePath} is larger than the allowed file size of ${MAX_FILE_SIZE / 1000000 }`)
			return;

		}

		try{
			logger.profile('s-sync-handling-file-upload-work')

			// app.immutableData.create()
			//  .then(
			//  (writer) => writer.write("some string\n")
			//    .then(() => writer.write("second string"))
			//    .then(() => app.cipherOpt.newPlainText())
			//    .then((cipher) => writer.close(cipher))
			//  ).then((address) => app.immutableData.fetch(address))
			//  .then((reader) => reader.read())
			//  .then((payload) => {
			//    console.log("Data read from ImmutableData: ", payload.toString());
			//  })

			const writer = await app.immutableData.create()
			delay(100)
			// console.log('writer?', writer)
			// console.log('---->a', await writer);
			await writer.write("some string\n")
			delay(100)
			console.log('---->b');
			await writer.write("second string")
			delay(100)
			console.log('---->c');
			const cipher = await app.cipherOpt.newPlainText();
			delay(100)
			console.log('---->d');
			const address= await writer.close(cipher, true)


			console.log('addre----------------', address.cid )

			resolve( address.cid )

			//
			// const reader = await app.immutableData.fetch( address );
			//
			// console.log('---->d');
			// const payload = await reader.read();
			//
			// console.log('---->e');
			//
			//
			// console.log('pload----------------', payload.toString())
			//
			logger.profile('s-sync-handling-file-upload-work')



		}
		catch( err )
		{
			console.error('ummm',err);

			reject( err )
		}


		logger.profile('s-sync-handling-file-upload')


		resolve( 'booo :( x' )

	});


  }
