import React, { Component, PureComponent } from 'react'
import {
  View,
  SectionList,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import gql from 'graphql-tag';
import { Actions } from 'react-native-router-flux'
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import _ from 'lodash';

import graphql from '../graphql';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 10,
    flexDirection: 'row',
    flex: 1
  },
  day: {
    padding: 16,
    backgroundColor: RkTheme.current.colors.bg,
    borderBottomColor: RkTheme.current.colors.light,
    borderBottomWidth: 1,
  },
  session: {
    flexDirection: 'row',
    borderBottomColor: RkTheme.current.colors.light,
    borderBottomWidth: 1,
  },
  sessionContent: {
    flex: 3,
  },
  sessionTitle: {
    marginVertical: 2,
  },
  favorite: {
    paddingLeft: 12,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 20
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  }
}));

class Session extends PureComponent {
  render() {
    const { session: { id, start_time, end_time, date, presentation, track, name, favorite, inFavorites, switchFavorite } } = this.props;
    const Wrapper = presentation ? TouchableOpacity : View;
    let heart = null;
    if(presentation) {
      heart = (<TouchableOpacity onPress={() => switchFavorite()}>
        <View style={styles.favorite}>
          <Ionicons name={ favorite ? 'md-heart' : 'md-heart-outline'} size={20} color={RkTheme.current.colors.foreground} />
        </View>
      </TouchableOpacity>);
    }
    return (
      <View style={styles.session}>
        { heart }
        <Wrapper key={id} style={styles.section} onPress={() => Actions.session(this.props)}>
          <View style={styles.sessionContent}>
            <RkText rkType='subtitle small'>
              {date}{moment(start_time).format('h:mm a')} - {moment(end_time).format('h:mm a')}
              {presentation && track && ` / ${track}`}
            </RkText>
            <RkText style={styles.sessionTitle}>{presentation ? presentation.draft.title : name}</RkText>
            { presentation && <RkText rkType='subtitle small'>- {presentation.speakers.map(speaker => speaker.name).join(", ")}</RkText> }
          </View>
          { presentation && 
            <View style={styles.avatarContainer}>
              <Image source={{ uri: presentation.speakers[0].profile.avatar }} style={styles.avatar} />
              <Ionicons name="ios-arrow-forward" size={26} color={RkTheme.current.colors.light} style={{ marginLeft: 10 }} />
            </View> 
          }
        </Wrapper>
      </View>
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
        speakers {
          id
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
export default class Agenda extends PureComponent {
  state = {
    loadingFavs: true,
    favorites: null
  }

  async componentDidMount() {
    this.setState({ loadingFavs: false, favorites: await this.getFavorites() });
  }

  async addToFavorites(id) {
    let { favorites } = this.state;
    favorites.push(id);
    await this.saveFavorites(favorites);
  }

  async removeFromFavorites(id) {
    let { favorites } = this.state;
    const index = favorites.indexOf(id);
    favorites.splice(index, 1);
    await this.saveFavorites(favorites);
  }

  async getFavorites() {
    return JSON.parse(await AsyncStorage.getItem(`@Favorites:${this.props.event.id}`)) || [];
  }

  async saveFavorites(favorites) {
    this.setState({ favorites })
    this.forceUpdate();
    await AsyncStorage.setItem(`@Favorites:${this.props.event.id}`, JSON.stringify(favorites));
  }

  render() {
    const { event, loading, refetch } = this.props;
    const { loadingFavs, favorites } = this.state;
    if(loadingFavs) {
      return <View style={styles.container}><ActivityIndicator color={RkTheme.current.colors.foreground} size="large" /></View>;
    }
    let event_date = moment(event.started_at);
    let agenda_sessions = [];
    for(let i = 0; i < event.agenda_sessions.length; ++i) {
      const id = event.agenda_sessions[i].id;
      if(favorites.includes(id)) {
        obj = { switchFavorite: () => this.removeFromFavorites(id), favorite: true };
      } else {
        obj = { switchFavorite: () => this.addToFavorites(id), favorite: false };
      }
      agenda_sessions.push(Object.assign({}, event.agenda_sessions[i], obj));
    }
    let days = [];
    if(favorites.length) {
      days.push({ 
        date: 'Favorites', 
        data: agenda_sessions
          .filter(session => favorites.includes(session.id))
          .map(session => Object.assign({}, session, { date: event_date.add(event.day_number - 1, 'days').format('MMM DD') + ', ' })) 
      })
    }
    let data = _.groupBy(_.sortBy(agenda_sessions, 'start_time'), 'day_number');
    for(day in data) {
      days.push({ date: event_date.add(day - 1, 'days').format('dddd, MMM DD'), data: data[day]})
    }
    if(agenda_sessions.length === 0) {
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