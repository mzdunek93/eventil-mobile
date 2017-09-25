import { call, fork,  put } from 'redux-saga/effects'

import Api from '../api';
import * as actions from '../actions';

const startup = function* startup() {
  const data = yield call(Api.getEvents);
  yield put({ type: actions.EVENTS_FETCHED, data });
}

const root = function* root() {
  yield fork(startup)
}

export default root;