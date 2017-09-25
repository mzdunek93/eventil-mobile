import 'babel-polyfill';

import React from 'react';
import {
  AsyncStorage,
} from 'react-native';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'

import { Font } from 'expo';

import reducer from './reducers'
import rootSaga from './sagas'
import './styles'

import Eventil from './Eventil';
import SplashScreen from './components/SplashScreen'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  undefined,
  compose(
    applyMiddleware(sagaMiddleware),
    autoRehydrate()
  )
)

persistStore(store, {
  storage: AsyncStorage,
})
sagaMiddleware.run(rootSaga)

export default class App extends React.Component {
  state = {
    loaded: false
  }

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSansBold': require('./assets/fonts/OpenSans-Bold.ttf'),
    });

    this.setState({ loaded: true });
  }

  render() {
    let { loaded } = this.state;
    return loaded ? (
      <Provider store={store}>
        <Eventil />
      </Provider>
    ) : <SplashScreen />;
  }
}