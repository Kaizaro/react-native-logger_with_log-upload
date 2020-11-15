import React from 'react';
import {StyleSheet, SectionList} from 'react-native';

const LogSectionList = (props) => (
  <SectionList
    style={styles.flatList}
    sections={props.sectionListData}
    keyExtractor={(item, index) => item + index}
    renderSectionHeader={({section: {title}}) =>
      props.renderSectionTitle(title)
    }
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

export default LogSectionList;
