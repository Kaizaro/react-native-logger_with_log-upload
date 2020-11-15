import LogModal from './src/ui/LogModal';
import {
  logInfo,
  logDebug,
  logWarn,
  logError,
  logSystemEvent,
} from './src/loggers/CommonLogger';
import {
  logRequest,
  logResponseStatus,
  logResponse,
  logResponseError,
} from './src/loggers/NetoiworkLogger';
import { wipeOldLogs } from './src/fileUtils/LogCleaner';
import { uploadLogs } from './src/fileUtils/LogsUploader';

wipeOldLogs();

export {
  LogModal,
  logInfo,
  logDebug,
  logWarn,
  logError,
  logSystemEvent,
  logRequest,
  logResponseStatus,
  logResponse,
  logResponseError,
  uploadLogs,
};
