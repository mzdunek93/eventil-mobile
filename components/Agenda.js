import React, { Component, PureComponent } from 'react'
import {
  View,
  SectionList,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import gql from 'graphql-tag';
import { Actions } from 'react-native-router-flux'
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import _ from 'lodash';

import graphql from '../graphql';

const styles = RkStyleSheet.create(theme => ({
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
    flex: 3,
  },
  sessionTitle: {
    marginVertical: 2,
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    const { session: { id, start_time, end_time, presentation, track, name } } = this.props;
    const Wrapper = presentation ? TouchableOpacity : View;
    return (
      <Wrapper key={id} style={styles.section} onPress={() => Actions.session(this.props)}>
        <View style={styles.sessionContent}>
          <RkText rkType='subtitle small'>
            {moment(start_time).format('h:mm a')} - {moment(end_time).format('h:mm a')}
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
  render() {
    const { event, loading, refetch } = this.props;
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