import React, { Component } from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import gql from 'graphql-tag';
import { Actions } from 'react-native-router-flux'
import { RkCard, RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

import graphql from '../graphql';

import Tag from './Tag'
import EventCard from './EventCard'

const { width, height } = Dimensions.get('window');

const styles = RkStyleSheet.create(theme => ({
  header: {
    padding: 10,
  },
  tagContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    marginRight: 5,
    marginBottom: 5,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderColor: RkTheme.current.colors.light,
    borderWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  eventCard: { 
    width: 300, 
    paddingRight: 10
  },
  eventCardFull: { 
    paddingBottom: 10,
    paddingRight: 10
  },
  eventsContainer: {
    paddingLeft: 10
  },
  cardImg: {
    height: 150
  }
}));

const ListLoader = (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 20 }}>
    <ActivityIndicator color={RkTheme.current.colors.foreground} size="large"/>
  </View>
)
const ListPadding = <View style={{ width: 10 }} />
const SearchButton = (
  <TouchableOpacity onPress={_ => Actions.searchEvents()}>
    <Ionicons name='ios-search' size={40} color='white'></Ionicons>
  </TouchableOpacity>
);

const ListEvent = gql`
  fragment ListEvent on EventConnection {
    edges {
      node {
        id
        name
        started_at
        header_image
        city
        country
        online
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
`;

@graphql(gql`
  ${ListEvent}
  query Query($eventsCursor: String, $featuredEventsCursor: String, $location: String, $topics: [String]) {
    featuredEvents: events(featured: true, first: 3, after: $featuredEventsCursor) @connection(key: "events", filter: ["featured"]) {
      ...ListEvent
    }
    targetedEvents: events(featured: false, topics: $topics, where: $location, first: 5, after: $eventsCursor) @connection(key: "events", filter: ["where", "topics", "featured"]) {
      ...ListEvent
    }
    events(featured: false, first: 5, after: $eventsCursor) @connection(key: "events", filter: ["featured"]) {
      ...ListEvent
    }
    topics(top: true) {
      name
      count
    }
    cities {
      name
      count
    }
  }
`, {
  options: ({ location, interests }) => ({ variables: { location, topics: interests } })
})
export default class EventsList extends Component {
  static navigationOptions = {
    headerRight: SearchButton
  }

  refresh = async () => {
    this.featuredEvents.scrollToOffset(0);
    this.targetedEvents.scrollToOffset(0);
    this.events.scrollToOffset(0);
    await this.props.refresh();
  }

  render() {
    const { 
      events, fetchMoreEvents, hasMoreEvents, 
      targetedEvents, fetchMoretargetedEvents, hasMoretargetedEvents, 
      featuredEvents, fetchMoreFeaturedEvents, hasMoreFeaturedEvents, 
      topics, cities, loading, refetching, location, interests } = this.props;

    return (
      <ScrollView 
        style={styles.container} 
        refreshControl={<RefreshControl refreshing={refetching} onRefresh={this.refresh} />}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <RkText rkType='xlarge'>Featured events</RkText>
        </View>
        <FlatList 
          horizontal={false} 
          data={featuredEvents} 
          renderItem={({item}) => <EventCard event={item} key={item.id} style={styles.eventCardFull} imgStyle={styles.cardImg} />} 
          keyExtractor={(event) => event.id} 
          showsHorizontalScrollIndicator={false} 
          ref={(list) => { this.featuredEvents = list }} 
          style={styles.eventsContainer} />
        { targetedEvents.length > 0 && 
          <View>
            <View style={styles.header}>
              <RkText rkType='xlarge'>Matching your interests</RkText>
            </View>
            <FlatList 
              horizontal={true} 
              data={targetedEvents} 
              renderItem={({item}) => <EventCard event={item} key={item.id} style={styles.eventCard} imgStyle={styles.cardImg} />}
              keyExtractor={(event) => event.id} 
              showsHorizontalScrollIndicator={false} 
              onEndReached={fetchMoretargetedEvents} 
              onEndReachedThreshold={1}
              ListFooterComponent={hasMoretargetedEvents ? ListLoader : ListPadding} 
              ref={(list) => { this.targetedEvents = list }} 
              style={styles.eventsContainer} />
            </View>}
        <View style={styles.header}>
          <RkText rkType='xlarge'>Other events</RkText>
        </View>
        <FlatList 
          horizontal={true} 
          data={events} 
          renderItem={({item}) => <EventCard event={item} key={item.id} style={styles.eventCard} imgStyle={styles.cardImg} />}
          keyExtractor={(event) => event.id} 
          showsHorizontalScrollIndicator={false} 
          onEndReached={fetchMoreEvents} 
          onEndReachedThreshold={1}
          ListFooterComponent={hasMoreEvents ? ListLoader : ListPadding} 
          ref={(list) => { this.events = list }} 
          style={styles.eventsContainer} />
        <View style={styles.header}>
          <RkText rkType='xlarge'>Popular Cities</RkText>
        </View>
        <View style={styles.tagContainer}>
          {cities.map(city => <Tag data={city} key={city.name} />)}
        </View>
        <View style={styles.header}>
          <RkText rkType='xlarge'>Popular Topics</RkText>
        </View>
        <View style={styles.tagContainer}>
          {topics.map(topic => <Tag data={topic} key={topic.name} />)}
        </View>
        <View style={{height: 16}} />
      </ScrollView>
    );
  }
};

export const ListEventFragment = ListEvent;
