import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  ActivityIndicator
} from 'react-native'
import gql from 'graphql-tag';
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import { MapView } from 'expo';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';

import graphql from '../graphql';

import { ListEventFragment } from './EventsList';
import EventCard from './EventCard'

const styles = RkStyleSheet.create(theme => ({
  eventCard: { 
    width: 300, 
    paddingRight: 10
  },
  cardImg: {
    height: 120
  },
  title: {
    marginBottom: 12,
  },
  eventsContainer: {
    marginHorizontal: -16,
    paddingLeft: 16,
  },
  line: {
    backgroundColor: RkTheme.current.colors.light,
    height: 1,
    marginTop: 20,
    marginBottom: 20
  },
}));

const ListLoader = (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 20 }}>
    <ActivityIndicator color={RkTheme.current.colors.foreground} size="large"/>
  </View>
)
const ListPadding = <View style={{ width: 16 }} />

@graphql(gql`
  ${ListEventFragment}
  query Query($eventsCursor: String, $city: String, $topics: [String]) {
    events(where: $city, topics: $topics, first: 10, after: $eventsCursor) @connection(key: "events", filter: ["where", "topics"]) {
      ...ListEvent
    }
  }
`, {
  options: ({ event }) => ({ variables: { city: event.city, topics: event.topics.map(topic => topic.name)} })
})
export default class Related extends PureComponent {
  render() {
    const { event, loading, refetch, events, fetchMoreEvents, hasMoreEvents } = this.props;

    let displayedEvents = events.filter(filtered => filtered.id != event.id);
    if(displayedEvents.length) {
      return (
        <View>
          <View style={styles.line} />
          <RkText rkType='xlarge' style={styles.title}>Related events</RkText>
          <FlatList 
            horizontal={true} 
            data={events.filter(filtered => filtered.id != event.id)} 
            renderItem={({item}) => <EventCard event={item} key={item.id} style={styles.eventCard} imgStyle={styles.cardImg} />}
            keyExtractor={(event) => event.id} 
            showsHorizontalScrollIndicator={false} 
            onEndReached={fetchMoreEvents} 
            onEndReachedThreshold={1}
            ListFooterComponent={hasMoreEvents ? ListLoader : ListPadding} 
            ref={(list) => { this.events = list }} 
            style={styles.eventsContainer} />
        </View>
      )
    } else {
      return null;
    }
  }
}