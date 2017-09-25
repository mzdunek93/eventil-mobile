import React, { Component } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
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

const styles = RkStyleSheet.create(theme => ({
  header: {
    height: 150,
    flexDirection: 'row'
  },
  image: {
    flex: 1,
    height: 150,
    resizeMode: 'cover'
  },
  location: {
    height: 20,
    resizeMode: 'contain',
    marginRight: 3,
  },
  locationContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start' 
  },
  content: {
    padding: 16
  },
  description: {
    marginTop: 16,
  }
}));

class Event extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.event.name}`,
  })

  render () {
    let { event } = this.props;

    return (
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: event.image }} style={styles.image}/>
        </View>
        <View style={styles.content}>
          <RkText rkType='date subtitle small' style={{ height: 20 }}>
            {moment(event.startDate).format("MMMM Do HH:mm").toUpperCase()}
          </RkText>
          <View style={styles.locationContainer}>
            <Image source={require('../assets/images/location.png')} style={styles.location} />
            <RkText rkType='subtitle'>{event.city}, {event.country}</RkText>
          </View>
          <RkText style={styles.description}>{event.about}</RkText>
        </View>
      </ScrollView>
    );
  }
}

export default Event
