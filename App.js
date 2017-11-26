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
      view: 'login',
      message: ''
    };
    this.getImage = this.getImage.bind(this);
    this.handleReturnedImage = this.handleReturnedImage.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleReturnedImage(response) {
    let image = response._bodyInit
    this.setState({img: image});
  }

  handleLogin(userData) {
    helpers.post(server + '/login', userData, (response) => {
      let msg = response._bodyText
      this.setState({message: msg});
    });
  }

  handleSignup(userData) {
    console.log(this);
    console.log('user data: ', userData);
    helpers.post(server + '/signup', userData, (response) => {
      console.log(response._bodyText);
      let msg = response._bodyText;
      this.setState({message: msg});
    });
  }

  getImage() {
    helpers.get(server + '/', this.handleReturnedImage);
  }


  render() {
    let view = <View></View>;
    if (this.state.view === 'login') {
      view = (
        <View style={styles.container}>
          <Text>{this.state.message}</Text>
          <Text style={styles.text}>
            Login Page
          </Text>
          <UserCredentialsPage handleSubmit={this.handleLogin} type={this.state.view} />
          <Image source={{uri: this.state.img}} style={styles.image} />
           <Button onPress={() => { 
             this.setState({view: 'signup'});
            }} title="Sign Up" 
          />
        </View>
      );
    } else if (this.state.view === 'signup') {
      view = (
        <View style={styles.container}>
          <Text>{this.state.message}</Text>
          <Text style={styles.text}>
            Signup Page
          </Text>
          <UserCredentialsPage handleSubmit={this.handleSignup} type={this.state.view}/>
          <Image source={{uri: this.state.img}} style={styles.image} />
           <Button onPress={() => { 
             this.setState({view: 'login'});
            }} title="Log In" 
          />
        </View>
      );
    } else {
      console.log('Other views');
    }
    return (
      view
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
