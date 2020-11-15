import React from 'react';
import {StyleSheet, FlatList} from 'react-native';

const LogFlatList = (props) => (
  <FlatList
    style={styles.flatList}
    contentContainerStyle={styles.contentContainer}
    alwaysBounceVertical={false}
    bounces={false}
    overScrollMode={'never'}
    keyExtractor={(item, index) => `${index}`}
    data={props.logData}
    renderItem={(item, index) => props.renderItem(item, index)}
  />
);

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'column',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'scroll',
  },
});

export default LogFlatList;
