import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Animated,
  Text,
  Image,
  Button
} from 'react-native'
import { TabNavigator } from 'react-navigation';
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import moment from 'moment';

const HEADER_HEIGHT = 150;

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  tabsContainer: {
    flex: 1,
    transform: [{
      translateY: HEADER_HEIGHT
    }]
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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

const Overview = (props) => (
  <View><Text>overview</Text></View>
)

const Agenda = (props) => (
  <View><Text>agenda</Text></View>
)
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Notifications',
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

const MyApp = TabNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Notifications: {
    screen: MyNotificationsScreen,
  },
}, {
  tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});
export default class Event extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.event.name}`,
  })

  state = {
    headerOffset: new Animated.Value(0),
    tabsOffset: new Animated.Value(150)
  }

  scroll = ({ nativeEvent}) => {
    console.log(nativeEvent)
  }

  overview = (event) => (props) => (
    <ScrollView style={styles.content} onScroll={this.scroll} showsVerticalScrollIndicator={false}>
      <RkText rkType='date subtitle small' style={{ height: 20 }}>
        {moment(event.started_at).format("MMMM Do HH:mm").toUpperCase()}
      </RkText>
      <View style={styles.locationContainer}>
        <Image source={require('../assets/images/location.png')} style={styles.location} />
        <RkText rkType='subtitle'>{event.city}, {event.country}</RkText>
      </View>
      <RkText style={styles.description}>{event.description}</RkText>
    </ScrollView>
  )

  render () {
    let { event } = this.props;
    let headerHeight = this.state;
    
    const Tabs = TabNavigator(
      {
        Overview: {
          screen: this.overview(event),
          path: '',
        },
        Agenda: {
          screen: Agenda,
          path: 'agenda',
        }
      },
      {
        tabBarPosition: 'top',
        tabBarOptions: {
          style: {
            backgroundColor: 'white'
          },
          indicatorStyle: {
            backgroundColor: RkTheme.current.colors.foreground,
          },
          inactiveTintColor: RkTheme.current.colors.text.subtitle,
          activeTintColor: RkTheme.current.colors.foreground,
          pressColor: RkTheme.current.colors.light,
        }
      }
    );

    return (
      <View style={styles.container}>
        <Animated.View style={styles.tabsContainer}>
          <Tabs />
        </Animated.View>
        <Animated.View style={styles.header}>
          <Image source={{ uri: event.header_image }} style={styles.image}/>
        </Animated.View>
      </View>
    );
  }
}