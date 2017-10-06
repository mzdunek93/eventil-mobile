import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { RkCard, RkText, RkStyleSheet } from 'react-native-ui-kitten';
import moment from 'moment';

import Touchable from './Touchable'; 

const styles = RkStyleSheet.create(theme => ({
  location: {
    height: 20,
    resizeMode: 'contain',
    marginRight: 3,
  }
}));

export default (props) => (
  <Touchable 
    onPress={() => Actions.event({ event: props.event })} 
    style={props.style}
  >
    <RkCard rkType='shadowed'>
      <View rkCardHeader>
        <Image source={{ uri: props.event.header_image }} rkCardImg />
      </View>
      <View rkCardContent>
        <RkText rkType='date subtitle small' style={{ height: 20 }}>
          {moment(props.event.started_at).format("MMMM Do HH:mm").toUpperCase()}
        </RkText>
        <RkText rkType='large' style={{ height: 45 }}>{props.event.name}</RkText>
      </View>
      <View rkCardFooter>
        <Image source={require('../assets/images/location.png')} style={styles.location} />
        <RkText rkType='subtitle' numberOfLines={1}>{props.event.city}, {props.event.country}</RkText>
        <View style={{ width: 10 }} />
      </View>
    </RkCard>
  </Touchable>
)