import 'babel-polyfill';

import React, { Component } from 'react';
import {
  AsyncStorage,
} from 'react-native';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { Font } from 'expo';

import './styles'

import Eventil from './Eventil';
import SplashScreen from './components/SplashScreen'

const networkInterface = createNetworkInterface({ uri: 'https://eventil.com/graphql' });
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