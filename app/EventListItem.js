import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

export default class EventListItem extends Component {
  showDetails() {
    this.props.navigator.push({ name: 'event-details', data: this.props.data });
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.showDetails.bind(this)}
        underlayColor={'#EEEEEE'}
      >
        <View style={styles.container}>
          <Image
            source={{ uri: this.props.data.avatar_url }}
            style={styles.picture}
          />
          <View>
            <Text>{this.props.data.name}</Text>
            <Text style={styles.title}>{this.props.data.city}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 8
  },
  picture: {
    width: 64,
    height: 64,
    borderRadius: 0,
    marginRight: 8
  },
  title: {
    color: '#848484'
  }
});
