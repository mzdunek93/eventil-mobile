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

export default (query, config = {}) => (WrappedComponent) => {
  config.props = ({ data: { loading, error, fetchMore, variables, ...data }}) => {
    let props = { loading, error };
    for(const key of Object.keys(data)) {
      if(data[key].edges) {
        let capitalized = key.charAt(0).toUpperCase() + key.slice(1)
        props[key] = data[key].edges.map(edge => edge.node);
        props[`hasMore${capitalized}`] = data[key].pageInfo.hasNextPage;
        props[`fetchMore${capitalized}`] = () => data[key].pageInfo.hasNextPage ? fetchMore({
          variables: {
            ...variables,
            [`${key}Cursor`]: data[key].pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
            ...previousResult,
            [key]: {
              ...fetchMoreResult[key],
              edges: [...previousResult[key].edges, ...fetchMoreResult[key].edges]
            }
          }},
        }) : null;
      } else {
        props[key] = data[key];
      }
    }
    return props;
  }
  @graphql(query, config)
  class Wrapper extends Component {
    static navigationOptions = WrappedComponent.navigationOptions
    
    render() {
      const { loading, error } = this.props;
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