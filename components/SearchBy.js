import React, { Component } from 'react'
import {
  View,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native'
import { RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import moment from 'moment';
import gql from 'graphql-tag';

import graphql from '../graphql';

import EventCard from './EventCard'
import { ListEventFragment } from './EventsList';

const { width } = Dimensions.get('window');

const styles = RkStyleSheet.create(theme => ({
  eventCard: { 
    paddingHorizontal: 10,
    paddingVertical: 5 
  },
  eventsContainer: {
    paddingVertical: 10
  },
  cardImg: {
    height: (width - 20)/2
  }
}));

const ListLoader = (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
    <ActivityIndicator color={RkTheme.current.colors.foreground} size="large"/>
  </View>
)

const ListPadding = <View style={{ height: 5 }} />

@graphql(gql`
  ${ListEventFragment}
  query Query($eventsCursor: String, $city: String, $topic: String) {
    events(where: $city, topic: $topic, first: 10, after: $eventsCursor) @connection(key: "events", filter: ["where", "topic"]) {
      ...ListEvent
    }
  }
`)
export default class City extends Component {
  static navigationOptions = ({ navigation: { state: { params }} }) => ({
    title: `${params[params.by]} events`,
  })
  
  refresh = async () => {
    this.events.scrollToOffset(0);
    await this.props.refresh();
  }

  render () {
    const { events, fetchMoreEvents, hasMoreEvents, loading } = this.props;
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