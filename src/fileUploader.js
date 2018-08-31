import path from 'path';
import fs from 'fs-extra';
import {
	MAX_FILE_SIZE,
	UPLOAD_CHUNK_SIZE
} from '../constants'
import logger from '../logger';


const writeFile = ( app, dataToWrite) => (
      new Promise(async (resolve, reject) => {
		  // const containerPath = parseNetworkPath(this.networkPath);
		  //
		  // fileObject
		  // TODO, get path from fileObectt????? OR WHAT....
		  const theFilePath = '?';
    const fileStats = fs.statSync( file );
    let chunkSize = UPLOAD_CHUNK_SIZE;
    const fileData = fs.openSync( file, 'r');
    let offset = 0;
    let buffer = null;
    const { size } = fileStats;



        try {
          // if (this.cancelled) {
          //   return reject(new Error());
          // }

          if (dataToWrite < chunkSize) {
            chunkSize = dataToWrite;
          }


          buffer = Buffer.alloc(chunkSize);
          fs.readSync(fileData, buffer, 0, chunkSize, offset);
          await fileObject.write(buffer);
          offset += chunkSize;
          dataToWrite -= chunkSize;

          if (offset === size) {
            callback(null, {
              isFile: true,
              isCompleted: false,
              size: chunkSize,
            });
            await file.close();
            return resolve(file);
          }
          callback(null, {
            isFile: true,
            isCompleted: false,
            size: chunkSize,
          });
          await writeFile(file, dataToWrite);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
    );


export const handleFileUpload = async ( app, theFilePath, networkPath ) =>
{

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
		//
		const writer = await app.immutableData.create()
		console.log('writer?', writer)
		// console.log('---->a', await writer);
		await writer.write("some string\n")
		console.log('---->b');
		await writer.write("second string")
		console.log('---->c');
		const cipher = await app.cipherOpt.newPlainText();
		console.log('---->',cipher);
		const address= await writer.close(cipher)

		console.log('addre----------------', address)
		// console.log(address)
		// console.log('whut');
		// 	.then( async writer =>
		// 	{
		// 		// return writer;
		// 	})
			// .then((address) => app.immutableData.fetch(address))
			// .then((reader) => reader.read())
			// .then((payload) => {
			//   console.log("Data read from ImmutableData: ", payload.toString());
			// })

			// const reader = await app.immutableData.fetch(address);
			// const p = await reader.read();
			// console.log('addre----------------', p.toString())


	}
	catch( err )
	{
		console.error('ummm',err);
	}



	// return new Promise(async (resolve) => {
    //   try {
    //     // const pubCntr = await this.api.getPublicContainer();
    //     // const servFolderName = await this.api.getMDataValueForKey(pubCntr, containerPath.dir);
    //     const servFolder = await this.api.getServiceFolderMD(servFolderName);
    //     const nfs = servFolder.emulateAs('NFS');
    //     const file = await nfs.open();
    //     await writeFile(file, size);
    //     try {
    //       await nfs.insert(containerPath.file, file);
    //     } catch (e) {
    //       if (e.code !== CONSTANTS.ERROR_CODE.ENTRY_EXISTS) {
    //         callback(e);
    //         return resolve();
    //       }
    //       const fileXorname = await servFolder.get(containerPath.file);
    //       if (fileXorname.buf.length !== 0) {
    //         callback(e);
    //         return resolve();
    //       }
    //       await nfs.update(containerPath.file, file, fileXorname.version + 1);
    //     }
    //     callback(null, {
    //       isFile: true,
    //       isCompleted: true,
    //       size: 0,
    //     });
    //     resolve();
    //   } catch (err) {
    //     callback(err);
    //   }
    // });

    // this[_status].total.files = 1;
    // this[_fileTask] = new Helper.FileUploadTask(this[_safeApi], this[_localPath], `${this[_nwPath]}/${fileName}`);
    // this[_fileTask].execute(this[_taskCb]);
  }
