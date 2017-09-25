import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
} from 'react-native'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import { Actions } from 'react-native-router-flux'
import Carousel from 'react-native-snap-carousel';
import { RkCard, RkText, RkStyleSheet } from 'react-native-ui-kitten';
import moment from 'moment';

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

class EventsList extends Component {
  _renderEvent ({item, index}) {
    return (
      <Touchable 
        onPress={() => Actions.event({ event: item })} 
        style={{ width: 300, paddingHorizontal: 10 }}
        key={index}
      >
        <RkCard rkType='shadowed'>
          <View rkCardHeader>
            <Image source={{ uri: item.image }} rkCardImg/>
          </View>
          <View rkCardContent>
            <RkText rkType='date subtitle small' style={{ height: 20 }}>
              {moment(item.startDate).format("MMMM Do HH:mm").toUpperCase()}
            </RkText>
            <RkText rkType='large' style={{ height: 45 }}>{item.name}</RkText>
          </View>
          <View rkCardFooter>
            <Image source={require('../assets/images/location.png')} style={styles.location} />
            <RkText rkType='subtitle'>{item.city}, {item.country}</RkText>
          </View>
        </RkCard>
      </Touchable>
    );
  }

  render () {

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <RkText rkType='xlarge'>Featured events</RkText>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {this.props.featuredEvents.map((item, index) => this._renderEvent({item, index}))}
        </ScrollView>
        <View style={styles.header}>
          <RkText rkType='xlarge'>Other events</RkText>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {this.props.events.map((item, index) => this._renderEvent({item, index}))}
        </ScrollView>
        <View style={{height: 16}} />
      </ScrollView>
    );
  }
}

const getEvents = state => state.events;

const getFeaturedEvents = createSelector(
  getEvents,
  events => events.filter(event => event.featured)
);

const getNormalEvents = createSelector(
  getEvents,
  events => events.filter(event => !event.featured)
);

const mapStateToProps = function(state){
  return {
    featuredEvents: getFeaturedEvents(state),
    events: getNormalEvents(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList)
