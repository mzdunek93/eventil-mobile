import React, { Component } from 'react'
import {
  View,
} from 'react-native'
import { TabNavigator, TabBarTop } from 'react-navigation';
import { RkStyleSheet, RkTheme } from 'react-native-ui-kitten';

import Overview from './Overview';
import Agenda from './Agenda';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white'
  },
  tabsContainer: {
    flex: 1,
  },
}));

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