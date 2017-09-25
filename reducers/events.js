import * as actions from '../actions.js'

export default function events(state=[], action) {
  switch (action.type) {

    case actions.EVENTS_FETCHED:
      return action.data;

    default:
      return state
  }
}
