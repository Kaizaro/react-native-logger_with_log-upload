import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {LOG_COLORS} from '../../constants/styles';

const LogItem = (props) => (
  <View style={{...styles.flatListItem, borderColor: props.borderColor}}>
    <Text style={styles.indexText}>{props.index}</Text>
    <Text style={styles.logText}>{props.item}</Text>
  </View>
);

const styles = StyleSheet.create({
  flatListItem: {
    flexDirection: 'row',
    borderLeftWidth: 4,
    paddingLeft: 10,
    marginBottom: 10,
    width: '100%',
  },
  indexText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: LOG_COLORS.GREY,
    marginRight: 5,
    marginTop: 5,
  },
  logText: {
    fontSize: 16,
    color: LOG_COLORS.MAIN_DARK,
  },
});

export default LogItem;
