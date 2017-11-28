import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

import helpers from '../helpers.js';

export default class SelectedUserDataScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getSelectedUserData();

  }

  render() {
    return (
      <View style={styles.container}>
       <Text>{JSON.stringify(this.props.selectedUserData)}</Text>
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
