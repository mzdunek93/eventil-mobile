import 'babel-polyfill';

import React, { Component } from 'react';
import {
  AsyncStorage,
} from 'react-native';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import Sentry from 'sentry-expo';
import { API_URL, GRAPHQL_TOKEN } from './constants'

import { Font } from 'expo';

import './styles'

import Eventil from './Eventil';
import SplashScreen from './components/SplashScreen'

Sentry.config('https://84156d4400ad4b0e9b88227d41c709cb@sentry.io/233128').install();

const networkInterface = createNetworkInterface({ uri: API_URL });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    // Send the login token in the Authorization header
    req.options.headers.authorization = `Bearer ${GRAPHQL_TOKEN}`;
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: r => r.id,
});

export default class App extends Component {
  state = {
    loaded: false
  }

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSansSemibold': require('./assets/fonts/OpenSans-Semibold.ttf'),
      'OpenSansBold': require('./assets/fonts/OpenSans-Bold.ttf'),
    });

    this.setState({ loaded: true });
  }

  render() {
    let { loaded } = this.state;
    return loaded ? (
      <ApolloProvider client={client}>
        <Eventil />
      </ApolloProvider>
    ) : <SplashScreen />;
  }
}