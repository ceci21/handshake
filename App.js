import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import CameraExample from './CameraExample.js';
import BarcodeScannerExample from './BarcodeScannerExample.js';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 80,
    color: "#000000"
  }
});
