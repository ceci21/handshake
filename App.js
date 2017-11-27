import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import CameraExample from './components/CameraExample.js';
import BarcodeScanner from './components/BarcodeScanner.js';
import UserCredentialsPage from './components/UserCredentialsPage.js';
import takeSnapshotAsync from 'expo/src/takeSnapshotAsync';
import BarcodeScreen from './components/BarcodeScreen.js';
import UserDataScreen from './components/UserDataScreen.js';
import { Audio } from 'expo';
import io from 'socket.io-client';
import AddEntriesScreen from './components/AddEntriesScreen.js';

const audioFiles = {
  success: require('./ComputerSFX_alerts-056.mp3'),
  beep: require('./Data-Beep-Notifier-Email-Received.mp3'),
  fail: require('./ComputerSFX_alerts-046.mp3')
};

import helpers from './helpers.js';

// const server = 'http://192.168.0.12:3000';
const server = 'http://10.30.64.233:3000';
// const server = 'http://handshake-server.herokuapp.com'

const socket = io(server);

const playSoundNotification = async source => {
  console.log('Playing sound now');
  const { sound, status } = await Audio.Sound.create(source, { shouldPlay: true });
  sound.playAsync();
};

socket.on('playSound', type => {
  console.log('Sound type: ', type);
  if (type === 'success') {
    playSoundNotification(audioFiles.success);
  } else if (type === 'beep') {
    playSoundNotification(audioFiles.beep);
  } else if (type === 'fail') {
    playSoundNotification(audioFiles.fail);
  }
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userQRCode: 'http://www.altinawildlife.com/wp-content/uploads/2016/10/Google-app-icon-small.png',
      QRCodeData: null,
      view: 'add-entries-screen',
      message: '',
      user: null,
      selectedUser: null
    };
    this.getUserQRCode = this.getUserQRCode.bind(this);
    this.handleReturnedImage = this.handleReturnedImage.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  refresh(both, loggedIn, loggedOut) {
    // State object which will have additional properties added to it.
    var state = {};

    // If no arguments, simply force an update.
    if (arguments.length === 0) {
      this.forceUpdate();
      return;
    }

    // If both is defined but not loggedIn or loggedOut, set the state and return.
    if (both && !loggedIn && !loggedOut) {
      this.setState(both);
      return;
    } else if (both && (loggedIn || loggedOut)) {
      // If one or both of loggedIn or loggedOut are defined, still add both object to state.
      state = Object.assign(state, both);
    }

    // Check if username exists. If so, give loggedIn state change. If not, give loggedOut state change.
    helpers.get(server + '/username', response => {
      let user = response._bodyText;
      if (user.length > 0) {
        state = Object.assign(state, loggedIn);
      } else if (user === '') {
        state = Object.assign(state, loggedOut);
      }
      this.setState(state);
    });
  }

  handleLogin(userData) {
    helpers.post(server + '/login', userData, response => {
      response = JSON.parse(response._bodyText);
      this.getUserQRCode();
      this.refresh({ message: response.message }, { view: 'qrcode-screen', user: userData.username });
    });
  }

  handleSignup(userData) {
    helpers.post(server + '/signup', userData, response => {
      response = JSON.parse(response._bodyText);
      this.refresh({ message: response.message });
    });
  }

  handleScan(QRCodeData) {
    let handshakeData = {
      scanningUser: this.state.user,
      scannedUser: QRCodeData
    };
    helpers.post(server + '/handshake', handshakeData, response => {
      console.log('Handshake response: ', response);
      socket.emit('playSound', 'success');
      this.refresh(null, { QRCodeData: QRCodeData, selectedUser: QRCodeData, view: 'user-data-screen' });
    });
  }

  handleReturnedImage(response) {
    let QRCode = response._bodyText;
    this.refresh(null, { userQRCode: QRCode });
  }

  getUserQRCode() {
    helpers.post(server + '/qrcode', {}, this.handleReturnedImage);
  }

  render() {
    let view = <View />;
    if (this.state.view === 'login') {
      view = (
        <View style={styles.container}>
          <Text>{this.state.message}</Text>
          <Text style={styles.text}>Login Page</Text>
          <UserCredentialsPage handleSubmit={this.handleLogin} type={this.state.view} />
          <Image source={{ uri: this.state.userQRCode }} style={styles.image} />
          <Button
            onPress={() => {
              this.refresh({ view: 'signup' });
            }}
            title="Sign Up"
          />
        </View>
      );
    } else if (this.state.view === 'signup') {
      view = (
        <View style={styles.container}>
          <Text>{this.state.message}</Text>
          <Text style={styles.text}>Signup Page</Text>
          <UserCredentialsPage handleSubmit={this.handleSignup} type={this.state.view} />
          <Image source={{ uri: this.state.img }} style={styles.image} />
          <Button
            onPress={() => {
              this.refresh({ view: 'login' });
            }}
            title="Log In"
          />
        </View>
      );
    } else if (this.state.view === 'qrcode-screen') {
      view = (
        <BarcodeScreen userQRCode={this.state.userQRCode} message={this.state.message} handleScan={this.handleScan} />
      );
    } else if (this.state.view === 'view-qrcode-data-screen') {
      view = (
        <View style={styles.container}>
          <Text>{this.state.QRCodeData}</Text>
          <Button
            title="Go Back"
            onPress={() => {
              this.refresh(null, { view: 'qrcode-screen' });
            }}
          />
        </View>
      );
    } else if (this.state.view === 'user-data-screen') {
      view = <UserDataScreen selectedUser={this.state.selectedUser} refresh={this.refresh} server={server} />;
     } else if (this.state.view === 'add-entries-screen') {
      view = <AddEntriesScreen />;
    } else if (this.state.view === 'home') {
      view = <Options changeView={this.refresh} />
    } else {
      console.log('Other views');
    }
    return view;
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
    fontSize: 40,
    color: '#000000'
  },
  image: {
    width: 164,
    height: 164
  },
  smallText: {
    fontSize: 20
  }
});
