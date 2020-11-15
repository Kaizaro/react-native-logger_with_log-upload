import React from 'react';
import { Platform } from 'react-native';
const RNFS = require('react-native-fs');
import { logger } from 'react-native-logs';
import { colorConsoleAfterInteractions } from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';
import { rnFsFileAsync } from 'react-native-logs/dist/transports/rnFsFileAsync';
import {
  getApplicationName,
  getBrand,
  getManufacturer,
  getModel,
  getSystemVersion,
} from 'react-native-device-info';

export const currentTime = Date.now();
const LOG_DIRECTORY = `${RNFS.DocumentDirectoryPath}/Logs`;
const LOG_FILE_NAME = `Log_${currentTime}`;

const LOG_TAG = 'LogConfig';

export let deviceBrand = { brand: 'n/a' };
export let deviceModel = { model: 'n/a' };

const OPERATING_SYSTEM = Platform.OS;
export const IS_ANDROID = OPERATING_SYSTEM === 'android';

const MkdirOptions = {
  NSURLIsExcludedFromBackupKey: true, // iOS only
};

RNFS.mkdir(LOG_DIRECTORY, MkdirOptions);

const LOG_LEVELS = {
  info: 0,
  debug: 1,
  warn: 2,
  error: 3,
  request: 4,
  response_status: 5,
  response: 6,
  response_error: 7,
  system_event: 8,
};

const LOG_LEVELS_NAMES = {
  info: 'info',
  debug: 'debug',
  warn: 'warn',
  error: 'error',
  request: 'request',
  response_status: 'response_status',
  response: 'response',
  response_error: 'response_error',
  system_event: 'system_event',
};

const commonTransportOptions = {
  dateFormat: 'utc',
  loggerName: LOG_FILE_NAME,
  loggerPath: LOG_DIRECTORY,
};

//const log = logger.createLogger(fileLogConfig);
const createLog = logger.createLogger({
  severity: 'debug',
  transport: (msg, level, options) => {
    colorConsoleAfterInteractions(msg, level, options);
    rnFsFileAsync(msg, level, options);
  },
  transportOptions: commonTransportOptions,
  levels: LOG_LEVELS,
});

if (__DEV__) {
  createLog.setSeverity('debug');
} else {
  createLog.setSeverity('error');
}

const logSessionStart = async () => {
  const appName = await getApplicationName();
  const manufacturer = await getManufacturer();
  const systemVersion = await getSystemVersion();
  const brand = await getBrand();
  const model = await getModel();
  deviceBrand.brand = brand;
  deviceModel.model = model;

  createLog.system_event(
    JSON.stringify(
      {
        LOG_TAG,
        methodName: 'loggerInit',
        session_OS: OPERATING_SYSTEM,
        device: JSON.stringify(
          { appName, manufacturer, brand, model, systemVersion },
          null,
          2
        ),
        endLine: '1',
      },
      null,
      2
    )
  );
};

logSessionStart();

export { createLog, LOG_LEVELS_NAMES, LOG_DIRECTORY, LOG_FILE_NAME };
