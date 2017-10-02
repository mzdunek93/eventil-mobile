import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { RkStyleSheet, RkTheme, RkText } from 'react-native-ui-kitten';
import { graphql } from 'react-apollo';
import { Ionicons } from '@expo/vector-icons';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default (...args) => (WrappedComponent) => {
  @graphql(...args)
  class Wrapper extends Component {
    render() {
      const { data: { loading, error }} = this.props;
      if (loading) {
        return <View style={styles.container}><ActivityIndicator color={RkTheme.current.colors.foreground} size="large" /></View>
      } else if(error) {
        console.log(error)
        return (
          <View style={styles.container}>
            <Ionicons name='ios-sad-outline' size={160} color={RkTheme.current.colors.text.subtitle} />
            <RkText rkType='subtitle small'>Something has gone wrong.</RkText>
            <RkText rkType='subtitle small'>Hopefully Stack Overflow is up so we can fix it.</RkText>
          </View>
        )
      } else {
        return <WrappedComponent {...this.props} />
      }
    }
  };

  return Wrapper;
}