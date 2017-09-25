import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Scene, Stack, Router, Actions, Tabs } from 'react-native-router-flux';
import { RkStyleSheet, RkText, RkTheme } from 'react-native-ui-kitten';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import EventsList from './components/EventsList'
import Event from './components/Event'
import SplashScreen from './components/SplashScreen'
import * as actions from './actions'

const styles = RkStyleSheet.create(theme => ({
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: theme.colors.foreground
  },
  label: {
    fontFamily: 'OpenSans'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.foreground,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.text.subtitle,
    paddingHorizontal: 10,
  },
  headerLeft: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  }
}));

const tabIcons = {
  events: 'ios-calendar',
  groups: 'ios-people',
  people: 'ios-microphone',
  myeventil: 'ios-heart',
  settings: 'ios-settings'
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

const Icon = ({ focused, navigation, tintColor }) => (
  <Ionicons name={tabIcons[navigation.state.key] + (focused ? '' : '-outline')} size={30} color={tintColor} />
)

const Header = ({ getScreenDetails, scene }) => {
  const { options, navigation } = getScreenDetails(scene);
  const { title, headerRight } = options;
  const left = (
    <View style={styles.headerLeft}>
      {scene.index == 0 
      ? <Image source={require('./assets/images/logo.png')} style={styles.logo} /> 
      : <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='ios-arrow-back-outline' size={30} color='white' />
        </TouchableOpacity>
      }
    </View>
  );
  const right = <View style={styles.headerRight}>{headerRight}</View>;
  return (
    <View style={styles.header}>
      {left}
      <RkText rkType='xlarge inverse bold' numberOfLines={1} style={styles.headerTitle}>{title}</RkText>
      {right}
    </View>
  )
}

class Eventil extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.statusBar} />
        <Router>
          <Tabs key="root" tabBarPosition="bottom" labelStyle={styles.label} 
            activeBackgroundColor={RkTheme.current.colors.foreground} 
            inactiveBackgroundColor={RkTheme.current.colors.foreground}
            activeTintColor={RkTheme.current.colors.text.inverse}
            inactiveTintColor={RkTheme.current.colors.text.subtitle}
          >
            <Stack key="events" title="Events" tabBarIcon={Icon} header={Header}>
              <Scene key="events" component={EventsList} initial={true} title="Events" leftButtonImage={require('./assets/images/logo.png')} />
              <Scene key="event" component={Event} />
            </Stack>
            <Stack key="groups" title="Groups" tabBarIcon={Icon} header={Header}>
              <Scene key="root"component={SplashScreen} title="Groups"  leftButtonImage={require('./assets/images/logo.png')} onLeft={() => {}} />
            </Stack>
            <Stack key="people" title="People" tabBarIcon={Icon} header={Header}>
              <Scene key="people" component={SplashScreen} title="People" leftButtonImage={require('./assets/images/logo.png')} onLeft={() => {}} />
            </Stack>
            <Stack key="myeventil" title="My Eventil" tabBarIcon={Icon} header={Header}>
              <Scene key="myeventil" component={SplashScreen} title="My Eventil" leftButtonImage={require('./assets/images/logo.png')} onLeft={() => {}} />
            </Stack>
            <Stack key="settings" title="Settings" tabBarIcon={Icon} header={Header}>
              <Scene key="settings" component={SplashScreen} title="Settings" leftButtonImage={require('./assets/images/logo.png')} onLeft={() => {}} />
            </Stack>
          </Tabs>
        </Router>
      </View>
    );
  }
}

export default Eventil;