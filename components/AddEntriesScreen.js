import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Button, Picker, Modal} from 'react-native';
import AddEntryModal from './AddEntryModal.js';

export default class AddEntriesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: this.props.userData.entries
    }
  }



  getTextInputs = () => {
    let entries = this.state.entries;
    console.log('Entries: ', entries);
    let textInputs = entries.map((entry) => {
      return (
        <TextInput 
          id={entry.name} 
          placeholder={entry.name} 
          style={styles.textInput} 
          onSubmitEditing={(text) => {
            console.log(text);
            // this.setState((prevState, props) => {
            //   let entries = Object.assign({}, prevState.entries);
            //   entries[entry.name] = text;
            //   return {entries: entries};
            // });
          }}
        />
      );
    });
    return textInputs;
  }

  addEntry = (name) => {
    this.setState((prevState, props) => {

      // Create new entry and push to entries. 
      let entries = prevState.entries.slice();
      let entry = {
        name: name,
        value: null
      };
      entries.push(entry);

      // Get new text inputs. 
      return {entries: entries};
      
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* {this.state.textInputs} */}
        {this.getTextInputs()}
        <AddEntryModal 
          addEntry={this.addEntry} 
        />
        <Button title="Submit entry" onPress={() => {
          this.props.handleSubmitEntries(this.state.entries);
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
  },
  textInput: {
    width: 200,
    height: 50
  }
});
