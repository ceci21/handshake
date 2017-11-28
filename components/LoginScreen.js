import React from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import BarcodeScanner from './BarcodeScanner.js';
import UserCredentialsPage from './UserCredentialsPage.js';

export default class LoginScreen extends React.Component {
  componentWillReceiveProps(props) {
    console.log('new props: ', props);
    alert(this.props.message);
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>{this.props.message}</Text>
          <Text style={styles.container}>Login Page</Text>
          <UserCredentialsPage handleSubmit={this.props.handleLogin} type="Log In" />
          <Button
            onPress={() => {
              this.props.refresh({ view: 'signup' });
            }}
            title="Sign Up"
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
