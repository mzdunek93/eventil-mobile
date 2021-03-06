import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { RkCard, RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

import Touchable from './Touchable'; 

const styles = RkStyleSheet.create(theme => ({
  location: {
    marginRight: 8,
  }
}));

export default class EventCard extends PureComponent {
  render() {
    const { event, style, imgStyle } = this.props;

    let location;
    if(event.online) {
      location = 'online';
    } else {
      location = `${event.city || "unknown"}, ${event.country || "unknown"}`;
    }

    return (
      <Touchable 
        onPress={() => Actions.event({ id: event.id, name: event.name })} 
        style={style}
      >
        <RkCard rkType='shadowed'>
          <View rkCardHeader style={imgStyle}>
            <Image source={{ uri: event.header_image }} rkCardImg style={imgStyle} />
          </View>
          <View rkCardContent>
            <RkText rkType='date subtitle small' style={{ height: 20 }}>
              {moment(event.started_at).format("ddd, DD MMM YYYY h:mm a").toUpperCase()}
            </RkText>
            <RkText rkType='large' style={{ height: 50 }}>{event.name || "unknown"}</RkText>
          </View>
          <View rkCardFooter>
            <Ionicons name="ios-pin-outline" size={22} color={RkTheme.current.colors.text.subtitle} style={styles.location} />
            <RkText rkType='subtitle' numberOfLines={1}>{location}</RkText>
            <View style={{ width: 10 }} />
          </View>
        </RkCard>
      </Touchable>
    )
  }
}