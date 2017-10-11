import React, { Component, PureComponent } from 'react'
import {
  View,
  ScrollView,
  SectionList,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import gql from 'graphql-tag';
import { Actions } from 'react-native-router-flux'
import { TabNavigator, TabBarTop } from 'react-navigation';
import { RkText, RkStyleSheet, RkTheme, RkCard } from 'react-native-ui-kitten';
import { MapView } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import _ from 'lodash';

import graphql from '../graphql';

import Tag from './Tag';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white'
  },
  tabsContainer: {
    flex: 1,
  },
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
    height: 150,
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
  section: {
    padding: 10,
    borderBottomColor: RkTheme.current.colors.light,
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  day: {
    padding: 16,
    backgroundColor: RkTheme.current.colors.bg,
  },
  sessionContent: {
    flex: 4,
  },
  sessionTitle: {
    marginVertical: 2,
  },
  avatarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  }
}));

class Description extends PureComponent {
  state = {
    showAll: false,
  }

  render() {
    let { content } = this.props;
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
  }
}
`, {
  options: ({ screenProps }) => ({ variables: screenProps })
})
class Overview extends PureComponent {
  render() {
    let { event, loading, refetch } = this.props;
    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}
        ref={(list) => { this.overview = list }} >
        <Image source={{ uri: event.header_image }} style={styles.image}/>
        <View style={styles.content}>
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
          >
            <MapView.Marker
              coordinate={{ latitude: event.lat, longitude: event.lng }}
            />
          </MapView>
          <View style={{ alignItems: 'center' }}>
            <RkText rkType='semibold large' style={{ marginTop: 8, textAlign: 'center' }}>{event.place_name}</RkText>
            <RkText rkType='subtitle' style={{ textAlign: 'center' }}>{event.location}</RkText>
          </View>
          <View style={styles.line} />
          <RkText rkType='large' style={styles.title}>Topics</RkText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {
              event.topics.length > 0
              ? event.topics.map(topic => <Tag key={topic.name} data={topic} />)
              : <RkText>No topics</RkText>
            }
          </View>
        </View>
      </ScrollView>
    )
  }
}

class Session extends PureComponent {
  render() {
    let { session } = this.props;
    const Wrapper = session.presentation ? TouchableOpacity : View;
    return (
      <Wrapper key={session.id} style={styles.section} onPress={() => Actions.session(this.props)}>
        <View style={styles.sessionContent}>
          <RkText rkType='subtitle small'>
            {moment(session.start_time).format('h:mm a')} - {moment(session.end_time).format('h:mm a')}
            {session.presentation && session.track && ` / ${session.track}`}
          </RkText>
          <RkText style={styles.sessionTitle}>{session.presentation ? session.presentation.draft.title : session.name}</RkText>
          { session.presentation && <RkText rkType='subtitle small'>- {session.presentation.user.name}</RkText> }
        </View>
        { session.presentation && 
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: session.presentation.user.profile.avatar }} style={styles.avatar} />
            <Ionicons name="ios-arrow-forward" size={26} color={RkTheme.current.colors.light} style={{ marginLeft: 10 }} />
          </View> 
        }
      </Wrapper>
    )
  }
}

@graphql(gql`
query Query($id: ID!) {
  event(id: $id) @connection(key: "agenda", filter: ["id"]) {
    name
    agenda_sessions {
      id
      day_number
      start_time
      end_time
      track
      name
      presentation {
        draft {
          title
          abstract
        }
        user {
          name
          profile {
            avatar
            twitter
            github
          }
        }
      }
    }
  }
}
`, {
  options: ({ screenProps }) => ({ variables: screenProps })
})
class Agenda extends PureComponent {
  render() {
    let { event, loading, refetch } = this.props;
    let days = [];
    let data = _.groupBy(_.sortBy(event.agenda_sessions, 'start_time'), 'day_number');
    let event_date = moment(event.started_at);
    for(day in data) {
      days.push({ date: event_date.add(day - 1, 'days').format('dddd, MMM DD'), data: data[day]})
    }
    if(event.agenda_sessions.length === 0) {
      return <RkText style={{ padding: 16 }}>No items</RkText>
    }
    return (
      <SectionList
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ref={(list) => { this.agenda = list }}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Session session={item} event={event.name} />}
        renderSectionHeader={({section}) => <RkText rkType='subtitle semibold' style={[styles.section, styles.day]}>{section.date.toUpperCase()}</RkText>}
        sections={days}
      />
    )
  }
}

export default class Event extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
  })

  render () {
    let { id } = this.props;
    
    const Tabs = TabNavigator(
      {
        Overview: {
          screen: Overview,
          path: '',
        },
        Agenda: {
          screen: Agenda,
          path: 'agenda',
        }
      },
      {
        lazy: true,
        tabBarPosition: 'bottom',
        tabBarComponent: TabBarTop,
        tabBarOptions: {
          style: {
            backgroundColor: RkTheme.current.colors.foreground,
          },
          indicatorStyle: {
            backgroundColor: 'white'
          },
          inactiveTintColor: RkTheme.current.colors.text.subtitle,
          activeTintColor: 'white',
        }
      }
    );

    return (
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <Tabs screenProps={{ id }} />
        </View>
      </View>
    );
  }
}