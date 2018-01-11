import React, { PureComponent } from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  RefreshControl,
  Dimensions,
  Linking
} from 'react-native'
import gql from 'graphql-tag';
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import { MapView } from 'expo';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';

import graphql from '../graphql';

import Tag from './Tag';
import Related from './Related';

const { width } = Dimensions.get('window');

const styles = RkStyleSheet.create(theme => ({
  header: {
    height: 150,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    marginBottom: 12,
  },
  image: {
    flex: 1,
    height: width / 2,
    resizeMode: 'cover',
  },
  icon: {
    width: 22,
    textAlign: 'center',
    marginRight: 10,
  },
  infoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start',
    marginTop: 2,
    marginBottom: 2,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    position: 'relative',
    borderTopColor: RkTheme.current.colors.light,
    borderTopWidth: 1,
    shadowColor: '#00000021',
    shadowOffset: {
      height: 0
    },
    shadowOpacity: 0.5,
    shadowRadius: 4
  },
  line: {
    backgroundColor: RkTheme.current.colors.light,
    height: 1,
    marginTop: 20,
    marginBottom: 20
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 15
  },
  row: {
    flexDirection: 'row'
  },
  column: {
    flexDirection: 'column'
  },
  socialIcon: {
    marginRight: 8,
  }
}));

class Description extends PureComponent {
  state = {
    showAll: false,
  }

  render() {
    let { content } = this.props;
    content = content.replace(/<(?:.|\n)*?>/gm, '').trim();
    if(content.length <= 160 || this.state.showAll) {
      return <RkText>{content}</RkText>
    } else {
      return (
        <View>
          <RkText>{content.slice(0, 160) + '...'}</RkText>
          <RkText rkType='subtitle' onPress={() => this.setState({ showAll: true })} style={{ marginTop: 2 }}>Show all</RkText>
        </View>
      )
    }
  }
}

@graphql(gql`
query Query($id: ID!) {
  event(id: $id) {
    id
    name
    started_at
    ended_at
    header_image
    description
    city
    country
    lat
    lng
    place_name
    location
    topics {
      name
    }
    user {
      id
      name
      profile {
        twitter
        avatar
        github
        linkedin
        twitter
      }
    }
    groups {
      id
      name
      avatar
      facebook_id
      meetup
      twitter
      admins {
        id
        name
        profile {
          twitter
          avatar
          github
          linkedin
          twitter
        }
      }
    }
  }
}
`, {
  options: ({ screenProps }) => ({ variables: screenProps })
})
export default class Overview extends PureComponent {
  handleGetDirections = () => {
    const { event } = this.props;
    const uri = `http://maps.google.com/maps?q=${event.lat},${event.lng}`;
    
    return Linking.canOpenURL(uri).then(supported => {
      if (!supported) {
        return Promise.reject(new Error(`Could not open the uri: ${uri}`))
      } else {
        return Linking.openURL(uri)
      }
    })
  }

  getSocialLinks = (obj) => {
    const linkPatterns = {
      'facebook_id': id => `http://facebook.com/profile.php?id=${id}`,
      'meetup': name => `http://www.meetup.com/${name}/`,
      'twitter': name => `http://twitter.com/${name}/`,
      'github': name => `https://github.com/${name}/`,
    }

    return Object.keys(obj)
      .filter(key => obj[key] && linkPatterns[key])
      .map(key => (
        <FontAwesome name={key.split('_')[0]} size={24} color={RkTheme.current.colors.foreground} style={styles.socialIcon}
          onPress={() => Linking.openURL(linkPatterns[key](obj[key]))} />
      ))
  }

  renderOrganizers() {
    const { event: { user, groups }} = this.props;
    let admins = groups
      .map(group => group.admins)
      .reduce((acc, admins) => acc.concat(admins), [])
      .filter(admin => admin.id != 1436);

    let organizers = null;

    if(groups.length || admins.length) {
      organizers = (
        <View>
          <View style={styles.line} />
          <RkText rkType='large' style={styles.title}>Organizers</RkText>
          {admins.map(admin => (
            <View key={'admin' + admin.id} style={styles.row}>
              <Image source={{uri: admin.profile.avatar}} style={styles.avatar} />
              <View style={styles.column}>
                <RkText rkType='semibold medium' style={{ marginBottom: 5 }}>{admin.name}</RkText>
                <View style={styles.row}>
                  {this.getSocialLinks(admin)}
                </View>
              </View>
            </View>
          ))}
          {groups.map(group => (
            <View key={'group' + group.id} style={styles.row}>
              <Image source={{uri: group.avatar}} style={styles.avatar} />
              <View style={styles.column}>
                <RkText rkType='semibold medium' style={{ marginBottom: 5 }}>{group.name}</RkText>
                <View style={styles.row}>
                  {this.getSocialLinks(group)}
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    }
    return organizers;
  }

  render() {
    const { event, loading, refetch } = this.props;

    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}
        ref={(list) => { this.overview = list }} >
        <Image source={{ uri: event.header_image }} style={styles.image}/>
        <View style={styles.content}>
          <RkText rkType='large'>{event.name}</RkText>
          <View style={styles.line} />
          <View style={styles.infoContainer}>
            <Ionicons name="ios-calendar-outline" size={24} color={RkTheme.current.colors.text.subtitle} style={styles.icon} />
            <RkText rkType='subtitle'>{moment(event.started_at).format("ddd, DD MMM YYYY h:mm a")}</RkText>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="ios-pin-outline" size={24} color={RkTheme.current.colors.text.subtitle} style={styles.icon} />
            <RkText rkType='subtitle'>{event.city}, {event.country}</RkText>
          </View>
          <View style={styles.line} />
          <RkText rkType='large' style={styles.title}>About</RkText>
          <Description content={event.description} />
          <View style={styles.line} />
          <RkText rkType='large' style={styles.title}>Location</RkText>
          <MapView
            region={{
              latitude: event.lat,
              longitude: event.lng,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0051,
            }}
            style={{ flex: 1, height: 180 }}
            scrollEnabled={false}
            zoomEnabled={false}
            onPress={this.handleGetDirections}
          >
            <MapView.Marker
              coordinate={{ latitude: event.lat, longitude: event.lng }}
            />
          </MapView>
          <View style={{ alignItems: 'center' }}>
            <RkText rkType='semibold large' style={{ marginTop: 8, textAlign: 'center' }}>{event.place_name}</RkText>
            <RkText rkType='subtitle' style={{ textAlign: 'center' }}>{event.location}</RkText>
          </View>
          {this.renderOrganizers()}
          <View style={styles.line} />
          <RkText rkType='large' style={styles.title}>Topics</RkText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {
              event.topics.length > 0
              ? event.topics.map(topic => <Tag key={topic.name} data={topic} />)
              : <RkText>No topics</RkText>
            }
          </View>
          <View style={{ maxHeight: 330 }}>
            <Related event={event} />
          </View>
        </View>
      </ScrollView>
    )
  }
}