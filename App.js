import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import CameraExample from './components/CameraExample.js';
import BarcodeScanner from './components/BarcodeScanner.js';
import takeSnapshotAsync from 'expo/src/takeSnapshotAsync';
import BarcodeScreen from './components/BarcodeScreen.js';
import SelectedUserDataScreen from './components/SelectedUserDataScreen.js';
import { Audio } from 'expo';
import io from 'socket.io-client';
import AddEntriesScreen from './components/AddEntriesScreen.js';
import Test from './components/Test.js';
import SignupScreen from './components/SignupScreen.js';
import LoginScreen from './components/LoginScreen.js';

const audioFiles = {
  success: require('./ComputerSFX_alerts-056.mp3'),
  beep: require('./Data-Beep-Notifier-Email-Received.mp3'),
  fail: require('./ComputerSFX_alerts-046.mp3')
};

import helpers from './helpers.js';

const server = 'http://192.168.43.247:3000';
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
      view: 'login',
      message: '',
      user: null,
      userData: null,
      selectedUser: null,
      selectedUserData: null
    };
  }

  refresh = (both, loggedIn, loggedOut) => {
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

  handleLogin = userCredentials => {
    // Log in
    helpers.post(server + '/login', userCredentials, response => {
      console.log('User\'s data: ', userCredentials);
      response = JSON.parse(response._bodyText);
      // Get QR code.
      this.getUserQRCode();
      // Refresh app.
      this.refresh({ message: response.message }, { view: 'home', user: userCredentials.username });
    });

    helpers.post(server + '/userdata', {username: userCredentials.username}, response => {
      this.refresh({userData: response._bodyText.userData});
    })
  };

  handleSignup = userData => {
    helpers.post(server + '/signup', userData, response => {
      response = JSON.parse(response._bodyText);
      this.refresh({ message: response.message });
    });
  };

  handleScan = QRCodeData => {
    let handshakeData = {
      scanningUser: this.state.user,
      scannedUser: QRCodeData
    };
    helpers.post(server + '/handshake', handshakeData, response => {
      console.log('Handshake response: ', QRCodeData);
      socket.emit('playSound', 'success');
      this.refresh(null, { selectedUser: QRCodeData, view: 'user-data-screen' });
    });
  };

  handleSubmitEntries = entryData => {
    let userData = {
      user: this.state.user,
      entryData: entryData
    };
    helpers.post(server + '/updateuserentries', userData, response => {
      console.log(response._bodyText);
    });
  };

  handleReturnedImage = response => {
    let QRCode = response._bodyText;
    this.refresh(null, { userQRCode: QRCode });
  };

  getSelectedUserData = () => {
    helpers.post(server + '/selecteduserdata', { username: this.state.selectedUser }, response => {
      console.log('Get Selected User Data response', response);
      let data = JSON.parse(response._bodyText);
      this.setState({ selectedUserData: data });
    });
  };

  getUserData = () => {
    helpers.post(server + '/userdata', { username: this.state.user }, response => {
      let data = JSON.parse(response._bodyText);
      console.log('Data from mounting: ', data);
      this.setState({ userData: data });
    });
  }

  getUserQRCode = () => {
    helpers.post(server + '/qrcode', {}, this.handleReturnedImage);
  };

  render() {
    let view = <View />;
    if (this.state.view === 'login') {
      view = <LoginScreen message={this.state.message} handleLogin={this.handleLogin} refresh={this.refresh} />;
    } else if (this.state.view === 'signup') {
      view = <SignupScreen message={this.state.message} handleSignup={this.handleSignup} refresh={this.refresh} />;
    } else if (this.state.view === 'qrcode-screen') {
      view = <BarcodeScreen userQRCode={this.state.userQRCode} message={this.state.message} handleScan={this.handleScan} />
    } else if (this.state.view === 'view-qrcode-data-screen') {
      view = (
        <View style={styles.container}>
          <Text>{this.state.selectedUser}</Text>
          <Button
            title="Go Back"
            onPress={() => {
              this.refresh(null, { view: 'qrcode-screen' });
            }}
          />
        </View>
      );
    } else if (this.state.view === 'user-data-screen') {
      view = (
        <SelectedUserDataScreen
          getSelectedUserData={this.getSelectedUserData}
          selectedUserData={this.state.selectedUserData}
          refresh={this.refresh}
          server={server}
        />
      );
    } else if (this.state.view === 'add-entries-screen') {
      view = (
        <AddEntriesScreen
          selectedUserData={this.state.selectedUserData}
          handleSubmitEntries={this.handleSubmitEntries}
        />
      );
    } else if (this.state.view === 'home') {
      view = <Test refresh={this.refresh} />;
    } else {
      console.log('Other views');
    }
    return (
      <View style={styles.container}>
        {view}
        <Button
          title="Go Back"
          onPress={() => {
            this.refresh({ view: 'home' });
          }}
        />
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
