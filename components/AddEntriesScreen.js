import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Button, Picker, Modal} from 'react-native';
import AddEntryModal from './AddEntryModal.js';

export default class AddEntriesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entryNames: ['Name', 'Email', 'Website'],
      textInputs: [],
      entries: this.props.userData.entries
    }
  }
  
  componentWillMount() {
    this.setState({textInputs: this.getTextInputs(this.state.entryNames)});
  }

  getTextInputs = (entryNames) => {
    let textInputs = entryNames.map((entryName) => {
      return (
        <TextInput 
          id={entryName} 
          placeholder={entryName} 
          style={styles.textInput} 
          onChangeText={(text) => {
            this.setState((prevState, props) => {
              let entries = Object.assign({}, prevState.entries);
              entries[entryName] = text;
              return {entries: entries};
            });
          }}
        />
      );
    });
    return textInputs;
  }

  addEntry = (name) => {
    this.setState((prevState, props) => {
      // Add entry name.
      let entryNames = prevState.entryNames.slice();
      entryNames.push(name);
      // Get new textInputs.
      let textInputs = this.getTextInputs(entryNames);
      return {entryNames: entryNames, textInputs: textInputs};
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.textInputs}
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
