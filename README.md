# @ react-native-logger_with_log-upload

The module was designed for logging react-native applications.

The module is designed to detect edge cases in client-server interaction and to help clients.

To install the module:
1. Open terminal
2. Enter the command: {yarn: yarn add; npm: npm install} yarn add git + https: //some_url+credentials.com/some_subdomain/logger.git
3. Done)

Install dependencies
1. Enter the command: {yarn: yarn add; npm: npm install} yarn add @ react-native-community / clipboard && yarn add react-native-file-viewer && yarn add react-native-fs && yarn add react-native-device-info


To update:
1. Update module version in package.json
2. Repeat the steps of installing the module.

# Module functions
{logInfo, logDebug, logWarn, logError, logSystemEvent, logRequest, logResponseStatus, logResponse, logResponseError}

UI component of LogModal module

# Using a module
Example of use in the project:

   
      class AppWrapper extends React.Component {
    
      render() {
      
        const {allowDev, isDevUser} = this.props;
      
         return (
              <...
              
                {allowDev &&<LogModal isProductionEnvironment={!isDevUser} />}
             
              </....>
         );
       }
      }
 

Example of logUpload:

                    export const uploadLogs = async (firebaseToken, tokeb, logUploadEndpoint) => {
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
                           'X-device-id': firebaseToken,
                           'X-Device-name': deviceName,
                         },
                         body: formData,
                       };
                       console.log(LOG_TAG, 'uploadLogs', logUploadEndpoint, uploadParams, formData);
                       await uploadFiles(logUploadEndpoint, uploadParams);
                     };

