import React, { Fragment, PureComponent } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import FileViewer from 'react-native-file-viewer';

import LogItem from './components/LogModalFlatlistItem';
import SectionTitle from './components/LogModalSectionTitleItem';
import LogFlatList from './components/LogModalFlatlist';
import LogSectionList from './components/LogModalSectionList';

import {
  CURRENT_LOG_FILE_PATH,
  readFile,
  readFilesFromLogsDir,
} from '../fileUtils/LogReader';
import { LOG_COLORS } from '../constants/styles';
import { splitLogToLines } from '../utils';
import { saveCurrentSessionLog, saveLogs } from '../fileUtils/LogsSaver';
import {
  cleanDownloadsLogsDirectory,
  cleanLogFilesDirectory,
} from '../fileUtils/LogCleaner';
import { IS_ANDROID } from '../config';
import {
  createTempLogFile,
  TEMP_LOGS_FILE,
} from '../fileUtils/TempFileHandler';

const testIcon = require('../assets/icons/test.png');

const copyIcon = require('../assets/icons/copy.png');
const deleteIcon = require('../assets/icons/delete.png');
const deleteAlertIcon = require('../assets/icons/delete-alert.png');

export const { height, width } = Dimensions.get('window');

class LogModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      logModalVisible: false,
      flatListVisible: false,
      logData: [],
      sectionListVisible: false,
      sectionListData: [],
    };
  }
  openLogModal = () => {
    this.setState({
      pending: true,
      logModalVisible: true,
      flatListVisible: false,
    });
    this.readCurrentSessionLog();
  };

  readCurrentSessionLog = async () => {
    this.setState({
      pending: true,
      sectionListVisible: false,
      flatListVisible: false,
    });
    const text = await readFile();
    const tempArray = await splitLogToLines(text);
    this.setState({ logData: tempArray }, () =>
      this.setState({ pending: false, flatListVisible: true })
    );
  };

  readLogsDirectory = async () => {
    this.setState({
      pending: true,
      sectionListVisible: false,
      flatListVisible: false,
    });
    const logsArray = await readFilesFromLogsDir();
    console.log(logsArray);

    this.setState({ sectionListData: logsArray }, () =>
      this.setState({ pending: false, sectionListVisible: true })
    );
  };

  switchLogInterval = () => {
    const { flatListVisible } = this.state;
    if (flatListVisible) {
      this.readLogsDirectory();
    } else {
      this.readCurrentSessionLog();
    }
  };

  closeLogModal = () => {
    this.setState({
      logModalVisible: false,
    });
  };

  copyLogsToClipboard = () => {
    const { flatListVisible, logData, sectionListData } = this.state;
    if (flatListVisible) {
      Clipboard.setString(JSON.stringify(logData, null, 1));
    } else {
      Clipboard.setString(JSON.stringify(sectionListData, null, 1));
    }
  };

  saveLogs = async () => {
    this.setState({
      pending: true,
      sectionListVisible: false,
      flatListVisible: false,
    });
    const { flatListVisible, sectionListData } = this.state;
    if (flatListVisible) {
      if (IS_ANDROID) {
        await saveCurrentSessionLog();
      } else {
        await FileViewer.open(CURRENT_LOG_FILE_PATH, {
          onDismiss: console.log('DISMISSED'),
        });
      }
    } else {
      if (IS_ANDROID) {
        await saveLogs();
      } else {
        await createTempLogFile(JSON.stringify(sectionListData, null, 2));
        await FileViewer.open(TEMP_LOGS_FILE, {
          onDismiss: console.log('DISMISSED'),
        });
      }
    }
    this.readCurrentSessionLog();
  };

  deleteLogsFromInternalStorage = async () => {
    this.setState({
      pending: true,
      sectionListVisible: false,
      flatListVisible: false,
    });
    await cleanLogFilesDirectory();
    this.readCurrentSessionLog();
  };

  deleteLogsFromDownloads = async () => {
    this.setState({
      pending: true,
      sectionListVisible: false,
      flatListVisible: false,
    });
    await cleanDownloadsLogsDirectory();
    this.readCurrentSessionLog();
  };

  renderItem = ({ item, index }) => {
    const borderColor = this.getLineBorderColor(item);
    return <LogItem borderColor={borderColor} index={index} item={item} />;
  };

  renderSectionTitle = (title) => <SectionTitle title={title} />;

  getLineBorderColor = (logLine) => {
    if (logLine.includes('INFO')) {
      return LOG_COLORS.TRANSPARENT_GREY;
    }

    if (logLine.includes('DEBUG')) {
      return LOG_COLORS.GREY;
    }

    if (logLine.includes('REQUEST')) {
      return LOG_COLORS.GREEN;
    }

    if (logLine.includes('RESPONSE_STATUS')) {
      return LOG_COLORS.ORANGE;
    }

    if (logLine.includes('RESPONSE_ERROR')) {
      return LOG_COLORS.DARK_RED;
    }

    if (logLine.includes('RESPONSE')) {
      return LOG_COLORS.DARK_BLUE;
    }

    if (logLine.includes('ERROR')) {
      return LOG_COLORS.RED;
    }

    if (logLine.includes('SYSTEM_EVENT')) {
      return LOG_COLORS.INDIGO;
    }
  };

  render() {
    const { isProductionEnvironment } = this.props;
    const {
      logModalVisible,
      pending,
      logData,
      sectionListData,
      flatListVisible,
      sectionListVisible,
    } = this.state;
    return (
      <Fragment>
        {!logModalVisible && (
          <TouchableOpacity
            style={{
              ...styles.testButton,
              borderColor: isProductionEnvironment
                ? LOG_COLORS.RED
                : LOG_COLORS.DARK_BLUE,
            }}
            onPress={() => this.openLogModal()}
            activeOpacity={0.5}
          >
            <Image
              style={styles.buttonIcon}
              source={testIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        )}
        <Modal
          presentationStyle={'overFullScreen'}
          animationType={'fade'}
          animated={true}
          transparent={true}
          visible={logModalVisible}
          onRequestClose={() => this.closeLogModal()}
        >
          <View
            onPress={() => this.closeLogModal()}
            activeOpacity={1}
            style={styles.modalContainer}
          >
            {!pending && (
              <View style={styles.modalBlock}>
                <View style={styles.topButtonRow}>
                  <TouchableOpacity
                    style={styles.deleteAlertButton}
                    onPress={() => this.deleteLogsFromInternalStorage()}
                    activeOpacity={0.5}
                  >
                    <Image
                      style={styles.buttonIcon}
                      source={deleteAlertIcon}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                  {IS_ANDROID && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => this.deleteLogsFromDownloads()}
                      activeOpacity={0.5}
                    >
                      <Image
                        style={styles.buttonIcon}
                        source={deleteIcon}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => this.copyLogsToClipboard()}
                    activeOpacity={0.5}
                  >
                    <Image
                      style={styles.buttonIcon}
                      source={copyIcon}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => this.closeLogModal()}
                    activeOpacity={0.5}
                  >
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalTitleText}>
                  {flatListVisible ? 'Логи текущей сессии' : 'Логи за 36 часов'}
                </Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.switchLogInterval()}
                    activeOpacity={0.5}
                  >
                    <Text style={styles.buttonText}>
                      {flatListVisible
                        ? 'Логи за 36 часов'
                        : 'Логи текущей сессии'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.saveLogs()}
                    activeOpacity={0.5}
                  >
                    <Text style={styles.buttonText}>Загрузить</Text>
                  </TouchableOpacity>
                </View>
                {flatListVisible && (
                  <LogFlatList logData={logData} renderItem={this.renderItem} />
                )}
                {sectionListVisible && (
                  <LogSectionList
                    sectionListData={sectionListData}
                    renderSectionTitle={this.renderSectionTitle}
                    renderItem={this.renderItem}
                  />
                )}
              </View>
            )}
          </View>
        </Modal>
      </Fragment>
    );
  }
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LOG_COLORS.MODAL_BACKGROUND_COLOR,
    paddingTop: getStatusBarHeight() + 16,
    paddingBottom: getBottomSpace() + 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  modalBlock: {
    flex: 1,
    width: '100%',
    backgroundColor: LOG_COLORS.WHITE,
    borderRadius: 8,
    flexDirection: 'column',
  },
  buttonRow: {
    height: 46,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  topButtonRow: {
    height: 24,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteAlertButton: {
    marginHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  testButton: {
    position: 'absolute',
    top: height / 2,
    left: 20,
    backgroundColor: LOG_COLORS.WHITE,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  deleteButton: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  closeButton: {
    borderWidth: 2,
    borderColor: LOG_COLORS.MAIN_DARK,
    borderRadius: 56,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  copyButton: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  buttonIcon: {
    height: 24,
    width: 24,
  },
  button: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: LOG_COLORS.MAIN_DARK,
    borderRadius: 4,
    marginHorizontal: 2,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: LOG_COLORS.MAIN_DARK,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: LOG_COLORS.MAIN_DARK,
    textAlign: 'center',
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LOG_COLORS.MAIN_DARK,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LogModal;
