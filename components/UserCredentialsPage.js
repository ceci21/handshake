import React from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class UserCredentialsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  render() {
    return (
      <View>
        <TextInput 
          ref="UsernameInput"
          style={styles.textInput} 
          placeholder={'Enter username'}
          editable={true}
          onChangeText={(text) => {
            this.setState({username: text})
          }}
          onSubmitEditing={(event) => {
            this.refs.PasswordInput.focus();
          }}
        />
        <TextInput
          ref="PasswordInput"
          style={styles.textInput} 
          placeholder={'Enter password'}
          secureTextEntry={true} 
          editable={true}
          onChangeText={(text) => {
            this.setState({password: text})
          }}
          onSubmitEditing={(event) => {
            let userData = {
              username: this.state.username,
              password: this.state.password
            };
            this.props.handleSubmit(userData);
          }}
        />
        <Button 
          title={this.props.type.toUpperCase()} 
          onPress={() => {
            let userData = {
              username: this.state.username,
              password: this.state.password
            };
            this.props.handleSubmit(userData);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: 200,
    height: 50
  }
});