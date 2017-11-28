import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
       <Button title="QR Screen" onPress={() => {
         this.props.refresh(null, {view: 'qrcode-screen'});
       }} />
      <Button title="Add Entries Screen" onPress={() => {
         this.props.refresh(null, {view: 'add-entries-screen'});
       }} />
      <Button title="User Data Screen" onPress={() => {
         this.props.refresh(null, {view: 'user-data-screen'});
       }} />
      <Button title="Login Screen" onPress={() => {
         this.props.refresh(null, {view: 'login'});
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
