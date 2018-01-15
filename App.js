import 'babel-polyfill';

import React, { Component } from 'react';
import { AsyncStorage, View, StatusBar } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink, concat } from 'apollo-client-preset';
import { RkTheme } from 'react-native-ui-kitten';
import Sentry from 'sentry-expo';
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
  };

  async componentDidMount() {
    await Font.loadAsync({
      OpenSans: require('./assets/fonts/OpenSans-Regular.ttf'),
      OpenSansSemibold: require('./assets/fonts/OpenSans-Semibold.ttf'),
      OpenSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
    });

    this.setState({ loaded: true });
  }

  renderApollo() {
    return (
      <ApolloProvider client={client}>
        <Eventil />
      </ApolloProvider>
    );
  }

  render() {
    let { loaded } = this.state;
    console.log(loaded)
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
