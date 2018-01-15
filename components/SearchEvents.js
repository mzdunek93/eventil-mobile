import React, { Component } from 'react'
import {
  View,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Toucha,
  TextInput
} from 'react-native'
import { RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import gql from 'graphql-tag';
import { Actions } from 'react-native-router-flux'
import _ from 'lodash';

import graphql from '../graphql';

import EventCard from './EventCard'
import { ListEventFragment } from './EventsList';

const { width } = Dimensions.get('window');

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCard: { 
    paddingHorizontal: 10,
    paddingVertical: 5 
  },
  eventsContainer: {
    paddingVertical: 10
  },
  cardImg: {
    height: (width - 20)/2
  },
  searchInput: {
    borderWidth: 0,
    color: 'white',
    height: 50,
    paddingHorizontal: 5,
    fontFamily: 'OpenSans'
  }
}));

const ListLoader = (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
    <ActivityIndicator color={RkTheme.current.colors.foreground} size="large"/>
  </View>
)
const ListPadding = <View style={{ height: 5 }} />

class InputBar extends Component {
  componentDidMount() {
    this.ref.focus();
  }

  render() {
    return (
      <TextInput
        ref={ component => this.ref = component }
        style={styles.searchInput}
        underlineColorAndroid='white'
        selectionColor='white'
        onChangeText={_.throttle((text) => Actions.refresh({ query: text }), 500)}
      />
    )
  }
}

@graphql(gql`
  ${ListEventFragment}
  query Query($eventsCursor: String, $query: String) {
    events(name: $query, first: 10, after: $eventsCursor) @connection(key: "events", filter: ["name"]) {
      ...ListEvent
    }
  }
`)
export default class City extends Component {
  static navigationOptions = {
    headerRight: <Ionicons name='ios-search' size={40} color='white'></Ionicons>,
    headerCenter: props => <InputBar {...props} />
  }

  refresh = () => {
    this.events.scrollToOffset(0);
    this.props.refetch();
  }

  render () {
    const { events, fetchMoreEvents, hasMoreEvents, loading, query } = this.props;
    if(!query) {
      return <View style={styles.container}><Text>Type query to start searching</Text></View>
    }
    return (
      <FlatList data={events} renderItem={({item}) => <EventCard key={item.id} event={item} style={styles.eventCard} imgStyle={styles.cardImg} />} 
        keyExtractor={(event) => event.id} showsHorizontalScrollIndicator={false} style={styles.eventsContainer}
        onEndReached={fetchMoreEvents} onEndReachedThreshold={1}
        ListFooterComponent={hasMoreEvents ? ListLoader : ListPadding} ref={(list) => { this.events = list }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.refresh} />}
      />
    );
  }
}