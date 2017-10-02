import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import gql from 'graphql-tag';
import { RkCard, RkText, RkStyleSheet } from 'react-native-ui-kitten';
import moment from 'moment';

import graphql from '../graphql';

import Touchable from './Touchable'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = RkStyleSheet.create(theme => ({
  header: {
    padding: 10,
  },
  location: {
    height: 20,
    resizeMode: 'contain',
    marginRight: 3,
  }
}));

@graphql(gql`
  fragment ListEvent on Event {
    id
    name
    header_image
    started_at
    ended_at
    description
    city
    country
  }
  query Query {
    featuredEvents: events(featured: true) {
      ...ListEvent
    }
    events(featured: false) {
      ...ListEvent
    }
  }
`)
export default class EventsList extends Component {
  _renderEvent(event) {
    return (
      <Touchable 
        onPress={() => Actions.event({ event })} 
        style={{ width: 300, paddingHorizontal: 10 }}
        key={event.id}
      >
        <RkCard rkType='shadowed'>
          <View rkCardHeader>
            <Image source={{ uri: event.header_image }} rkCardImg/>
          </View>
          <View rkCardContent>
            <RkText rkType='date subtitle small' style={{ height: 20 }}>
              {moment(event.started_at).format("MMMM Do HH:mm").toUpperCase()}
            </RkText>
            <RkText rkType='large' style={{ height: 45 }}>{event.name}</RkText>
          </View>
          <View rkCardFooter>
            <Image source={require('../assets/images/location.png')} style={styles.location} />
            <RkText rkType='subtitle'>{event.city}, {event.country}</RkText>
          </View>
        </RkCard>
      </Touchable>
    );
  }

  render () {
    const { data: { events, featuredEvents } } = this.props;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <RkText rkType='xlarge'>Featured events</RkText>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {featuredEvents.map(event => this._renderEvent(event))}
        </ScrollView>
        <View style={styles.header}>
          <RkText rkType='xlarge'>Other events</RkText>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {events.map(event => this._renderEvent(event))}
        </ScrollView>
        <View style={{height: 16}} />
      </ScrollView>
    );
  }
}
