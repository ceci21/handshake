import React, { Component } from 'react';
import { StyleSheet, Modal, Text, TouchableHighlight, View, TextInput, Button } from 'react-native';

export default class AddEntryModal extends Component {

  state = {
    modalVisible: false,
    name: ''
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={styles.container}>
          <View>
            <Text>Hello World!</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="Enter name of your new entry."
              onChangeText={(text) => {
                this.setState({name: text});
              }}
              onSubmitEditing={(e) => {
                this.props.addEntry(this.state.name);
              }}
            />  

            <Button title="Submit" onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.props.addEntry(this.state.name);
            }}>
            </Button>
            <Button title="I didn't mean to do that" onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
            </Button>

          </View>
         </View>
        </Modal>

        <Button title="Add Entry" onPress={() => {
          this.setModalVisible(true)
        }}>
        </Button>

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
  textInput: {
    width: 200,
    height: 50
  }
});