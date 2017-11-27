import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

import helpers from '../helpers.js';

export default class UserDataScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null
    }
  }

  componentDidMount() {
    console.log('Component mounting....');
    helpers.post(this.props.server + '/userdata', {username: this.props.selectedUser}, (response) => {
      let data = JSON.parse(response._bodyText);
      console.log('Data from mounting: ', data);
      this.setState({userData: data});
    })
  }

  render() {
    return (
      <View style={styles.container}>
       <Text>{JSON.stringify(this.state.userData)}</Text>
       <Button title="QR Screen" onPress={() => {
         this.props.refresh(null, {view: 'qrcode-screen'});
       }} />
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
