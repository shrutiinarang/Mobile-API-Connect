import React, {Component} from 'react';
import {StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import FlatListExample from './src/components/FlatList';

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatListExample />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },
});
