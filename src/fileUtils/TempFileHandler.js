const RNFS = require('react-native-fs');

import { LOG_FILE_NAME } from '../config';
import { logError, logSystemEvent } from '../loggers/CommonLogger';

export const TEMP_LOGS_DIRECTORY = `${RNFS.DocumentDirectoryPath}/TEMP/`;
export const TEMP_LOGS_FILE = `${TEMP_LOGS_DIRECTORY}${LOG_FILE_NAME}.txt`;

const LOG_TAG = '>>> TempFileHandler';

const MkdirOptions = {
  NSURLIsExcludedFromBackupKey: true, // iOS only
};

export const createTempLogFile = async (text) => {
  try {
    await makeTempLogsDir();
    await RNFS.writeFile(TEMP_LOGS_FILE, text, 'utf8');
    console.log('FILE WRITTEN!');
    logSystemEvent(
      LOG_TAG,
      'createTempLogFile',
      `created temp file ${TEMP_LOGS_FILE}`
    );
    return true;
  } catch (err) {
    logError(LOG_TAG, 'createTempLogFile', err.message);
  }
};

const makeTempLogsDir = async () => {
  try {
    return await RNFS.mkdir(TEMP_LOGS_DIRECTORY, MkdirOptions);
  } catch (error) {
    console.log(LOG_TAG, 'makeLogsDir', error);
    logError(LOG_TAG, 'makeLogsDir', error);
    return error;
  }
};

export const cleanTempLogsDirectory = async () =>
  await RNFS.unlink(TEMP_LOGS_DIRECTORY)
    .then(() => {
      logSystemEvent(
        LOG_TAG,
        'cleanTempLogsDirectory',
        `DIRECTORY ${TEMP_LOGS_DIRECTORY} DELETED`
      );
      return true;
    })
    // `unlink` will throw an error, if the item to unlink does not exist
    .catch((err) => {
      logError(LOG_TAG, 'cleanTempLogsDirectory', err.message);
      return false;
    });
