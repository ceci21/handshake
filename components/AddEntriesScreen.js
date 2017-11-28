import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Button, Picker, Modal} from 'react-native';
import AddEntryModal from './AddEntryModal.js';

export default class AddEntriesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entryNames: this.props.selectedUserData || ['Name', 'Email', 'Website'],
      entries: [],
      entryData: {}
    }
  }
  
  componentWillMount() {
    this.setState({entries: this.getEntries(this.state.entryNames)});
  }

  getEntries = (entryNames) => {
    let entries = entryNames.map((entryName) => {
      return (
        <TextInput 
          id={entryName} 
          placeholder={entryName} 
          style={styles.textInput} 
          onChangeText={(text) => {
            this.setState((prevState, props) => {
              let entryData = Object.assign({}, prevState.entryData);
              entryData[entryName] = text;
              return {entryData: entryData};
            });
          }}
        />
      );
    });
    return entries;
  }

  addEntry = (name) => {
    this.setState((prevState, props) => {
      // Add entry name.
      let entryNames = prevState.entryNames.slice();
      entryNames.push(name);
      // Get new entries.
      let entries = this.getEntries(entryNames);
      return {entryNames: entryNames, entries: entries};
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.entries}
        <AddEntryModal 
          addEntry={this.addEntry} 
        />
        <Button title="Submit entry" onPress={() => {
          this.props.handleSubmitEntries(this.state.entryData);
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
