import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

export default class BarcodeScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const hasCameraPermission = this.state.hasCameraPermission;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{backgroundColor: 'black'}} >
          <View style={{ flex: 1, minWidth: '100%', opacity: 0.5 }}>
            <BarCodeScanner type="front" onBarCodeRead={this._handleBarCodeRead} style={StyleSheet.absoluteFill} />
          </View>
        </View>
      );
    }
  }

  _handleBarCodeRead = ({ type, data }) => {
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.props.handleScan(data);
  };
}
