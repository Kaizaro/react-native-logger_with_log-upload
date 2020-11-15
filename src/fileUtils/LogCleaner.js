import { logError, logSystemEvent } from '../loggers/CommonLogger';

const RNFS = require('react-native-fs');

import { currentTime, LOG_DIRECTORY } from '../config';
import { DOWNLOADS_LOGS_DIRECTORY } from './LogsSaver';
import { cleanTempLogsDirectory } from './TempFileHandler';

const DAY_IN_MILLISECONDS = 86400000;

const LOG_LIFE_TIME_VALUE = DAY_IN_MILLISECONDS * 1.5;

const LOG_TAG = '>>> LogCleaner';

export const wipeOldLogs = () => {
  logSystemEvent(
    LOG_TAG,
    'wipeOldLogs started',
    'Log files older than 36 hours will be deleted'
  );
  RNFS.readDir(LOG_DIRECTORY) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      //console.log('GOT RESULT', result);
      result.forEach((element) => {
        //console.log(element);
        const fileName = element.name;
        const fileCreationTime = fileName.replace(/\D/g, '');
        const fileAge = +currentTime - fileCreationTime;
        //console.log(fileAge);
        if (fileAge > LOG_LIFE_TIME_VALUE) {
          return (
            RNFS.unlink(element.path)
              .then(() => {
                logSystemEvent(
                  LOG_TAG,
                  'wipeOldLogs',
                  `OLD LOG FILE DELETED' ${fileName} with session started at ${new Date(
                    +fileCreationTime
                  ).toUTCString()}`
                );
              })
              // `unlink` will throw an error, if the item to unlink does not exist
              .catch((err) => {
                logError(LOG_TAG, 'wipeOldLogs', err.message);
              })
          );
        }
      });
    })
    .catch((err) => {
      logError(LOG_TAG, 'wipeOldLogs', `${err.message} ${err.code}`);
    });
  cleanTempLogsDirectory();
};

export const cleanLogFilesDirectory = async () => {
  try {
    const logDirectoryContent = await RNFS.readDir(LOG_DIRECTORY);
    await Promise.all(
      logDirectoryContent.map(async (element) => {
        //console.log(element);
        const fileName = element.name;
        const fileCreationTime = fileName.replace(/\D/g, '');

        await RNFS.unlink(element.path)
          .then(() => {
            logSystemEvent(
              LOG_TAG,
              'cleanLogFilesDirectory',
              `LOG FILE DELETED' ${fileName} with session started at ${new Date(
                +fileCreationTime
              ).toUTCString()}`
            );
            return true;
          })
          // `unlink` will throw an error, if the item to unlink does not exist
          .catch((err) => {
            logError(LOG_TAG, 'cleanLogFilesDirectory', err.message);
            return false;
          });
      })
    );
    return true;
  } catch (error) {
    logError(LOG_TAG, 'cleanDownloadsLogsDirectory', error);
  }
};

export const cleanDownloadsLogsDirectory = async () =>
  await RNFS.unlink(DOWNLOADS_LOGS_DIRECTORY)
    .then(() => {
      logSystemEvent(
        LOG_TAG,
        'cleanDownloadsLogsDirectory',
        `DIRECTORY ${DOWNLOADS_LOGS_DIRECTORY} DELETED`
      );
      return true;
    })
    // `unlink` will throw an error, if the item to unlink does not exist
    .catch((err) => {
      logError(LOG_TAG, 'cleanDownloadsLogsDirectory', err.message);
      return false;
    });
