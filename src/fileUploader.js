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
		logger.profile('s-sync-handling-file-upload')


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

			const writer = await app.immutableData.create()
			// TODO: Why is this needed?
			delay(100)
			await writer.write("some string\n")
			await writer.write("second string")
			const cipher = await app.cipherOpt.newPlainText();
			const address= await writer.close(cipher, true)

			resolve( address.cid )

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
