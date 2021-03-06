import React, { PureComponent } from 'react'
import {
  View,
  ScrollView,
  Animated,
  Text,
  Image,
  Button,
  Linking,
  FlatList
} from 'react-native'
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

import Touchable from './Touchable';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
    padding: 16
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  speaker: {
    marginHorizontal: 5,
    marginVertical: 10,
    width: 140
  },
  speakersContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 6
  },
  social: {
    flexDirection: 'row'
  },
  socialIcon: {
    marginRight: 6
  },
  title: {
    marginTop: 20,
    textAlign: 'center'
  },
  line: {
    backgroundColor: RkTheme.current.colors.light,
    height: 1,
    marginTop: 20,
    marginBottom: 20
  },
  infoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start',
    marginTop: 2,
    marginBottom: 2,
    alignItems: 'center',
  },
  icon: {
    width: 22,
    textAlign: 'center',
    marginRight: 10,
  },
}));

class Speaker extends PureComponent {
  render() {
    const { name, profile: { avatar, twitter, github } } = this.props
    
    const twitterIcon = twitter
      ? <Ionicons name='logo-twitter' size={20} color='#00aced' style={styles.socialIcon} onPress={() => Linking.openURL(`https://twitter.com/${twitter}`)} />
      : null;
    const githubIcon = github
      ? <Ionicons name='logo-github' size={20} style={styles.socialIcon} onPress={() => Linking.openURL(`https://github.com/${github}`)} />
      : null;

    return (
      <View style={[styles.header, styles.speaker]}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <RkText rkType='semibold' style={{ textAlign: 'center' }}>{name}</RkText>
        <View style={styles.social}>
          { twitterIcon }
          { githubIcon }
        </View>
      </View>
    )
  }
}

export default class Session extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.event}`,
  })

  render () {
    const { session: { start_time, end_time, day_number, track, presentation } } = this.props;
    const { draft: { title, abstract }, speakers } = presentation;
    const localization = track
      ? (
        <View style={styles.infoContainer}>
          <Ionicons name="ios-pin-outline" size={24} color={RkTheme.current.colors.text.subtitle} style={styles.icon} />
          <RkText rkType='subtitle'>{track}</RkText>
        </View>
      ) : null;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.speakersContainer}>
            { speakers.map(speaker => <Speaker key={speaker.id} {...speaker} />) }
          </View>
          <RkText rkType='xlarge' style={styles.title}>{title}</RkText>
        </View>
        <View style={styles.line} />
        <View style={styles.infoContainer}>
          <Ionicons name="ios-calendar-outline" size={24} color={RkTheme.current.colors.text.subtitle} style={styles.icon} />
          <RkText rkType='subtitle'>Day {day_number}, {moment(start_time).format('h:mm a')} - {moment(end_time).format('h:mm a')}</RkText>
        </View>
        { localization }
        <View style={styles.line} />
        <RkText>{abstract}</RkText>
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }
}