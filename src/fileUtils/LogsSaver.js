const RNFS = require('react-native-fs');

import { LOG_DIRECTORY, LOG_FILE_NAME } from '../config';
import { getFilesFromLogsDir } from './LogReader';
import { logError, logSystemEvent } from '../loggers/CommonLogger';

export const DOWNLOADS_LOGS_DIRECTORY = `${RNFS.DownloadDirectoryPath}/Logs`;
const CURRENT_LOG_FILE_PATH = `${LOG_DIRECTORY}/${LOG_FILE_NAME}.txt`;

const LOG_TAG = '>>> LogSaver';

const MkdirOptions = {
  NSURLIsExcludedFromBackupKey: true, // iOS only
};

export const saveLogs = async () => {
  try {
    const logFilesArray = await getFilesFromLogsDir();
    const currentUtcTime = `${new Date().toUTCString()}`;
    const folderForCurrentSave = currentUtcTime.replace(/[^a-zA-Z0-9]/g, '');
    const destinationFolder = `${DOWNLOADS_LOGS_DIRECTORY}/${folderForCurrentSave}`;
    await makeLogsDir(destinationFolder);
    await Promise.all(
      logFilesArray.map(async (element) => {
        const sourceFilePath = element.filepath;
        const fileName = element.filename;
        const destFilePath = `${destinationFolder}/${fileName}`;
        await RNFS.copyFile(sourceFilePath, destFilePath);
        logSystemEvent(LOG_TAG, 'saveLogs', `saved file ${destFilePath}`);
        return true;
      })
    );
    return true;
  } catch (error) {
    logError(LOG_TAG, 'saveLogs', error);
    return false;
  }
};

export const saveCurrentSessionLog = async () => {
  try {
    const currentUtcTime = `${new Date().toUTCString()}`;
    const folderForCurrentSave = currentUtcTime.replace(/[^a-zA-Z0-9]/g, '');
    const destinationFolder = `${DOWNLOADS_LOGS_DIRECTORY}/${folderForCurrentSave}`;
    await makeLogsDir(destinationFolder);
    const destFilePath = `${destinationFolder}/${LOG_FILE_NAME}`;
    await RNFS.copyFile(CURRENT_LOG_FILE_PATH, destFilePath);
    logSystemEvent(
      LOG_TAG,
      'saveCurrentSessionLog',
      `saved file ${destFilePath}`
    );
    return true;
  } catch (error) {
    logError(LOG_TAG, 'saveCurrentSessionLog', error);
    return error;
  }
};

const makeLogsDir = async (destinationFolder) => {
  try {
    return await RNFS.mkdir(destinationFolder, MkdirOptions);
  } catch (error) {
    console.log(LOG_TAG, 'makeLogsDir', error);
    logError(LOG_TAG, 'makeLogsDir', error);
    return error;
  }
};
