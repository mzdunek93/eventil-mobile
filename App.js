import 'babel-polyfill';

import React, { Component } from 'react';
import { AsyncStorage, View, StatusBar } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink, concat } from 'apollo-client-preset';
import { RkTheme } from 'react-native-ui-kitten';
import Sentry from 'sentry-expo';
import { SecureStore } from 'expo';
import { API_URL, GRAPHQL_TOKEN } from './constants';

import { Font } from 'expo';

import './styles';

import Eventil from './Eventil';
import SplashScreen from './components/SplashScreen';

Sentry.config('https://84156d4400ad4b0e9b88227d41c709cb@sentry.io/233128').install();

const httpLink = new HttpLink({ uri: API_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `Bearer ${GRAPHQL_TOKEN}`,
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

export default class App extends Component {
  state = {
    loaded: false,
    topics: [],
    location: ''
  };

  async componentDidMount() {
    await Font.loadAsync({
      OpenSansLight: require('./assets/fonts/OpenSans-Light.ttf'),
      OpenSans: require('./assets/fonts/OpenSans-Regular.ttf'),
      OpenSansSemibold: require('./assets/fonts/OpenSans-Semibold.ttf'),
      OpenSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
    });

    const location = await SecureStore.getItemAsync('location');
    const topics = (await SecureStore.getItemAsync('topics')).split(',');

    this.setState({ loaded: true, location, topics });
  }

  renderApollo() {
    const { location, topics } = this.state;
    return (
      <ApolloProvider client={client}>
        <Eventil location={location} topics={topics} />
      </ApolloProvider>
    );
  }

  render() {
    let { loaded } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={RkTheme.current.colors.foreground}
          barStyle="light-content"
        />
        {loaded ? this.renderApollo() : <SplashScreen />}
      </View>
    );
  }
}
