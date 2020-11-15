import { createLog } from '../config';

export const logInfo = (ComponentTag, methodName, message) => {
  createLog.info(
    JSON.stringify(
      {
        ComponentTag,
        methodName,
        message,
        endLine: '1',
      },
      null,
      2
    )
  );
};

export const logDebug = (ComponentTag, methodName, message) => {
  createLog.debug(
    JSON.stringify(
      {
        ComponentTag,
        methodName,
        message,
        endLine: '1',
      },
      null,
      2
    )
  );
};

export const logWarn = (ComponentTag, methodName, message) => {
  createLog.warn(
    JSON.stringify(
      {
        ComponentTag,
        methodName,
        message,
        endLine: '1',
      },
      null,
      2
    )
  );
};

export const logError = (ComponentTag, methodName, error) => {
  createLog.error(
    JSON.stringify(
      {
        ComponentTag,
        methodName,
        error,
        endLine: '1',
      },
      null,
      2
    )
  );
};

export const logSystemEvent = (ComponentTag, methodName, message) => {
  createLog.system_event(
    JSON.stringify(
      {
        ComponentTag,
        methodName,
        message,
        endLine: '1',
      },
      null,
      2
    )
  );
};
