import React, { PureComponent } from 'react'
import {
  View,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import Touchable from './Touchable'

const styles = RkStyleSheet.create(theme => ({
  header: {
    padding: 10,
  },
  tagContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    marginRight: 5,
    marginBottom: 5,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderColor: RkTheme.current.colors.light,
    borderWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  eventCard: { 
    width: 300, 
    paddingRight: 10
  },
  eventsContainer: {
    paddingLeft: 10
  }
}));

export default class Tag extends PureComponent {
  render() {
    let { __typename, name, count } = this.props.data;
    let by = __typename.toLowerCase();
    return (
      <Touchable onPress={() => Actions.searchBy({[by]: name, by})}>
        <View style={styles.tag}>
          <RkText rkType="subtitle">{name}</RkText>
          {
            count && 
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 5 }} />
              <RkText rkType="light">{count}</RkText>
            </View>
          }
        </View>
      </Touchable>
    )
  }
}