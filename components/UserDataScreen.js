import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import helpers from '../helpers.js';

const server = 'http://192.168.0.12:3000';

export default class UserDataScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null
    }
  }

  componentDidMount() {
    console.log('Component mounting....');
    helpers.post(server + '/userdata', {username: this.props.selectedUser}, (response) => {
      let data = response._bodyText;
      this.setState({userData: data});
    })
  }

  render() {
    return (
      <View style={styles.container}>
       <Text>{this.state.userData}</Text>
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
  }
});
