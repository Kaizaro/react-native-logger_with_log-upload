const RNFS = require('react-native-fs');

import { LOG_DIRECTORY, LOG_FILE_NAME } from '../config';
import { logError } from '../loggers/CommonLogger';
import { splitLogToLines } from '../utils';

const LOG_TAG = '>>> LogReader';

export const CURRENT_LOG_FILE_PATH = `${LOG_DIRECTORY}/${LOG_FILE_NAME}.txt`;
// get a list of files and directories in the main bundle
export const readFile = async (filePath = CURRENT_LOG_FILE_PATH) =>
  await RNFS.readFile(filePath, 'utf8') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      //console.log('GOT RESULT', result);
      return result;
    })
    .catch((err) => {
      logError(LOG_TAG, 'readFile', `${err.message} ${err.code}`);
      return err;
    });

export const readFilesFromLogsDir = async () => {
  let logsArray = [];
  try {
    const logDirectoryContent = await RNFS.readDir(LOG_DIRECTORY);
    await Promise.all(
      logDirectoryContent.map(async (element) => {
        const fileName = element.name;
        const fileCreationTime = fileName.replace(/\D/g, '');
        const utcDateOfFile = new Date(+fileCreationTime).toUTCString();
        let data = await readFile(element.path);
        logsArray.push({
          title: `LogFile with session started at ${utcDateOfFile}`,
          data: splitLogToLines(data),
        });
        return logsArray;
      })
    );
    return logsArray;
  } catch (err) {
    logError(LOG_TAG, 'readFilesFromLogsDir', err);
    return err;
  }
};

export const getFilesFromLogsDir = async () => {
  let filesArray = [];
  try {
    const logDirectoryContent = await RNFS.readDir(LOG_DIRECTORY);
    await Promise.all(
      logDirectoryContent.map(async (element) => {
        const fileName = element.name;
        const fileCreationTime = fileName.replace(/\D/g, '');
        const utcDateOfFile = new Date(+fileCreationTime).toUTCString();
        filesArray.push({
          name: `Logs_${utcDateOfFile}`,
          filename: element.name,
          filepath: element.path,
          mimetype: 'text/plain',
        });
        return filesArray;
      })
    );
    return filesArray;
  } catch (err) {
    logError(LOG_TAG, 'readFilesFromLogsDir', err);
    return err;
  }
};
