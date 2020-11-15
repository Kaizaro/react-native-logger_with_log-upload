import { deviceBrand, deviceModel, IS_ANDROID } from '../config';
import { getFilesFromLogsDir } from './LogReader';
import {
  logResponse,
  logResponseError,
  logResponseStatus,
} from '../loggers/NetoiworkLogger';
import { cleanLogFilesDirectory } from './LogCleaner';
import {logError, logSystemEvent} from '../loggers/CommonLogger';

const LOG_TAG = '>>> LogUploader';

const UPLOAD_ENDPOINT = 'customer/deviceLogs';

const uploadFiles = async (uploadUrl, uploadParams) => {
  try {
    console.log(
        LOG_TAG,
        'uploadFiles',
        uploadUrl,
        'params:',
        uploadParams,
        'body:',
        uploadParams.body
    );
    const response = await fetch(uploadUrl, uploadParams);
    const responseStatus = response?.status;
    logResponseStatus(LOG_TAG, 'uploadFiles', responseStatus);
    if (responseStatus >=200 &&  responseStatus <=300) {
      logResponse(LOG_TAG, 'uploadFiles', await response.json());
      logSystemEvent(LOG_TAG, 'uploadLogs', 'LOG FILES UPLOADED!');
      logSystemEvent(LOG_TAG, 'uploadLogs', 'LOG FILES WILL BE DELETED');
      cleanLogFilesDirectory();
    } else {
      logResponseError(LOG_TAG, 'uploadFiles', response);
    }
  } catch (error) {
    logError(LOG_TAG, 'uploadFiles', error.message || error);
  }
};

export const uploadLogs = async (projectId, firebaseToken, tokeb, logUploadEndpoint) => {
  const deviceName = `${deviceBrand.brand}_${deviceModel.model}`;
  const files = await getFilesFromLogsDir();
  const formData = new FormData();
  await Promise.all(
      files.map((file) => {
        formData.append('files', {
          uri: IS_ANDROID ? 'file://' + file.filepath : file.filepath,
          type: file.mimetype,
          name: file.filename,
        });
        return formData;
      })
  );
  const uploadParams = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokeb}`,
      'X-Project': projectId,
      'X-device-id': firebaseToken,
      'X-Device-name': deviceName,
    },
    body: formData,
  };
  console.log(LOG_TAG, 'uploadLogs', logUploadEndpoint, uploadParams, formData);
  await uploadFiles(logUploadEndpoint, uploadParams);
};
