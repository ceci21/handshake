import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import BarcodeScanner from './BarcodeScanner.js';
import UserCredentialsPage from './UserCredentialsPage.js';

export default class SignupScreen extends React.Component {
  componentWillReceiveProps(props) {
    console.log('new props: ', props);
    alert(this.props.message);
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>{this.props.message}</Text>
          <Text style={styles.container}>Signup Page</Text>
          <UserCredentialsPage handleSubmit={this.props.handleSignup} type="Sign Up" />
          <Button
            onPress={() => {
              this.props.refresh({ view: 'login' });
            }}
            title="Log In"
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
  }
});
