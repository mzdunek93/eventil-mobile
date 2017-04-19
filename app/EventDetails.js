import React, { Component } from 'react';
import {
  View,
  ListView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import ActionBar from './ActionBar';
import EventListItem from './EventListItem';
import * as eventService from './services/event-service-mock';

export default class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };
    eventService.findById(this.props.data.id).then(event => {
      this.setState({ event });
    });
  }

  render() {
    if (this.state && this.state.event) {
      let event = this.state.event;
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: event.avatar_url }} style={styles.picture} />
            <Text style={styles.bigText}>
              {event.name}
            </Text>
            <Text style={[styles.mediumText, styles.lightText]}>
              {event.city}
            </Text>
            <ActionBar
              mobilePhone={event.country}
              email={event.country}
            />
          </View>

          <View style={styles.emptyList}>
            <Text style={styles.lightText}>No agenda</Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FAFAFF',
    paddingBottom: 4,
    borderBottomColor: '#F2F2F7',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  manager: {
    paddingBottom: 10,
    alignItems: 'center'
  },
  picture: {
    width: 80,
    height: 80,
    borderRadius: 0
  },
  smallPicture: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  mediumText: {
    fontSize: 16
  },
  bigText: {
    fontSize: 20
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#AAAAAA'
  },
  list: {
    flex: 1
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lightText: {
    color: '#C7C7CC'
  }
});
