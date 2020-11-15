import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {LOG_COLORS} from '../../constants/styles';

const SectionTitle = (props) => (
  <View style={styles.sectionTitle}>
    <Text style={styles.sectionTitleText}>{props.title}</Text>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    borderBottomColor: LOG_COLORS.FIRE_RED,
    borderBottomWidth: 3,
    padding: 5,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: LOG_COLORS.OPAQUE_GREY,
  },
  sectionTitleText: {
    fontSize: 18,
    color: LOG_COLORS.MAIN_DARK,
  },
});

export default SectionTitle;
