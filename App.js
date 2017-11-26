import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import CameraExample from './components/CameraExample.js';
import BarcodeScannerExample from './components/BarcodeScannerExample.js';
import UserCredentialsPage from './components/UserCredentialsPage.js';
import takeSnapshotAsync from 'expo/src/takeSnapshotAsync';

import helpers from './helpers.js'

const server = 'http://192.168.0.12:3000';
// const server = 'http://handshake-server.herokuapp.com'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: "http://www.altinawildlife.com/wp-content/uploads/2016/10/Google-app-icon-small.png",
    };
    this.getImage = this.getImage.bind(this);
    this.handleReturnedImage = this.handleReturnedImage.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleReturnedImage(response) {
    let image = response._bodyInit
    this.setState({img: image});
  }

  handleLogin(userData) {
    helpers.post(server + '/login', userData, this.handleReturnedImage);
  }

  getImage() {
    helpers.get(server + '/', this.handleReturnedImage);
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Top Text
        </Text>
        <UserCredentialsPage handleLogin={this.handleLogin}/>
        <Image source={{uri: this.state.img}} style={styles.image} />
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
  },
  image: {
    width: 164,
    height: 164
  },
  smallText: {
    fontSize: 20
  }
});
