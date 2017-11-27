import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import BarcodeScanner from './BarcodeScanner.js';

export default class BarcodeScreen extends React.Component {
  componentWillReceiveProps(props) {
    console.log('new props: ', props);
    alert(this.props.message);
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <BarcodeScanner handleScan={this.props.handleScan}/>
          <View style={styles.QRCodeContainer}>
          <Image style={styles.QRCode} source={{uri: this.props.userQRCode}} /> 
          </View>       
        </View>
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
  QRCode: {
    width: 300,
    height: 300,
    opacity: 0.75
  },
  QRCodeContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
