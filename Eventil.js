import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native';
import { Scene, Stack, Router, Actions, Tabs } from 'react-native-router-flux';
import { RkStyleSheet, RkText, RkTheme } from 'react-native-ui-kitten';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import EventsList from './components/EventsList';
import Event from './components/Event';
import SearchBy from './components/SearchBy';
import SearchEvents from './components/SearchEvents';
import Session from './components/Session';
import SplashScreen from './components/SplashScreen';
import Location from './components/Location';
import Topics from './components/Topics';
import * as actions from './actions';
import { GoogleAnalyticsTracker } from './analytics';
import { GA_TRACKING_ID } from './constants';

const tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);

function trackView(getData) {
  return props => tracker.trackScreenView(props.routeName, getData(props));
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: RkTheme.current.colors.light,
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: theme.colors.foreground,
  },
  label: {
    fontFamily: 'OpenSans',
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
    height: 40,
    width: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    height: 40,
    width: 40,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
}));

const tabIcons = {
  events: 'ios-calendar',
  groups: 'ios-people',
  people: 'ios-microphone',
  myeventil: 'ios-heart',
  settings: 'ios-settings',
};

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const Icon = ({ focused, navigation, tintColor }) => (
  <Ionicons
    name={tabIcons[navigation.state.key] + (focused ? '' : '-outline')}
    size={30}
    color={tintColor}
  />
);

let nav = {};

const Header = ({ getScreenDetails, scene }) => {
  const { options, navigation } = getScreenDetails(scene);
  const { title, headerRight, headerCenter } = options;
  nav = { navigation, scene };
  const left = (
    <View style={styles.headerLeft}>
      {scene.index == 0 ? (
        <Image source={require('./assets/images/logo.png')} style={styles.logo} />
      ) : (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back-outline" size={40} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
  let center;
  if (headerCenter) {
    center = headerCenter(...scene.route.params);
  } else {
    center = (
      <RkText rkType="xlarge inverse bold" numberOfLines={1} style={{ textAlign: 'center' }}>
        {title}
      </RkText>
    );
  }
  const right = <View style={styles.headerRight}>{headerRight}</View>;
  return (
    <View style={styles.header}>
      {left}
      <View style={{ flex: 1 }}>{center}</View>
      {right}
    </View>
  );
};

class Eventil extends Component {

  render() {
    const { location, topics } = this.props;
    const boarded = location.length && topics.length;
    console.log(location, topics);

    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <Router
          backAndroidHandler={() => {
            nav.navigation.goBack();
            return nav.scene.index !== 0;
          }}>
          <Stack key="root" hideNavBar={true}>
            <Stack key="Location" title="Location" hideNavBar={true} initial={!boarded}>
              <Scene 
                key="topics"
                component={Topics}
                initial={true}
                title="Topics"
                onEnter={trackView(props => null)}
              />
              <Scene 
                key="location"
                component={Location}
                title="Location"
                onEnter={trackView(props => null)}
              />
            </Stack>
            <Stack key="events" title="Events" tabBarIcon={Icon} header={Header} initial={boarded}>
              <Scene
                key="events"
                component={props => <EventsList {...props} location={location} interests={topics} />}
                initial={true}
                title="Events"
                leftButtonImage={require('./assets/images/logo.png')}
                onEnter={trackView(props => null)}
              />
              <Scene key="event" component={Event} onEnter={trackView(props => props.name)} />
              <Scene
                key="searchBy"
                component={SearchBy}
                onEnter={trackView(props => props[props.by])}
              />
              <Scene
                key="searchEvents"
                component={SearchEvents}
                onEnter={trackView(props => props.query)}
              />
              <Scene
                key="session"
                component={Session}
                onEnter={trackView(props => props.session.id)}
              />
            </Stack>
          </Stack>
          {/* <Tabs key="root" tabBarPosition="bottom" labelStyle={styles.label} 
            activeBackgroundColor={RkTheme.current.colors.foreground} 
            inactiveBackgroundColor={RkTheme.current.colors.foreground}
            activeTintColor={RkTheme.current.colors.text.inverse}
            inactiveTintColor={RkTheme.current.colors.text.subtitle}
          >
            <Stack key="events" title="Events" tabBarIcon={Icon} header={Header}>
              <Scene key="events" component={EventsList} initial={true} title="Events" leftButtonImage={require('./assets/images/logo.png')} />
              <Scene key="event" component={Event} />
              <Scene key="searchBy" component={SearchBy} />
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
          </Tabs> */}
        </Router>
      </View>
    );
  }
}

export default Eventil;
