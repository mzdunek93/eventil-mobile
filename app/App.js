import React, { Component } from 'react';
import {
  Navigator,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';

import EventList from './EventList';
import EventDetails from './EventDetails';

export default class App extends Component {
  renderScene(route, navigator) {
    switch (route.name) {
      case 'event-list':
        return <EventList navigator={navigator} />;
      case 'event-details':
        return <EventDetails navigator={navigator} data={route.data} />;
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ name: 'event-list', title: 'Events' }}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) => {
                if (route.name === 'event-list') {
                  return null;
                } else {
                  return (
                    <TouchableOpacity onPress={() => navigator.pop()}>
                      <Image
                        source={require('./assets/back.png')}
                        style={styles.backButton}
                      />
                    </TouchableOpacity>
                  );
                }
              },
              RightButton: (route, navigator, index, navState) => {
                return null;
              },
              Title: (route, navigator, index, navState) => {
                return <Text style={styles.title}>{route.title}</Text>;
              }
            }}
            style={styles.navBar}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#FAFAFF',
    height: 60
  },
  backButton: {
    marginTop: 8,
    marginLeft: 12,
    height: 24,
    width: 24
  },
  title: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
