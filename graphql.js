import React, { Component } from 'react';
import { View, Image, ActivityIndicator, RefreshControl, ScrollView, Dimensions } from 'react-native';
import { RkStyleSheet, RkTheme, RkText } from 'react-native-ui-kitten';
import { graphql } from 'react-apollo';
import { Ionicons } from '@expo/vector-icons';
import Sentry from 'sentry-expo';

const { height } = Dimensions.get('window');

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    height: height - 100,
    padding: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
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
        props[`fetchMore${capitalized}`] = async () => {
          try {
            data[key].pageInfo.hasNextPage ? await fetchMore({
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
          } catch(e) {
            
          }
        }
      } else {
        props[key] = data[key];
      }
    }
    return props;
  }
  @graphql(query, config)
  class Wrapper extends Component {
    static navigationOptions = WrappedComponent.navigationOptions

    state = {
      refetching: false,
      refetchingError: null
    }

    refresh = async () => {
      this.setState({ refetching: true });
      try {
        await this.props.refetch()
      } catch(e) {
        this.setState({ refetchingError: e });
      } finally {
        this.setState({ refetching: false });
      }
    }
    
    render() {
      let { loading, error, refetch } = this.props;
      let { refetching, refetchingError } = this.state;
      error = error || refetchingError;
      if (loading) {
        return <View style={styles.container}><ActivityIndicator color={RkTheme.current.colors.foreground} size="large" /></View>
      } else if(error) {
        let message;
        if(error.message === "Network error: Network request failed") {
          message = "There's been an error connecting to the server";
        } else {
          message = "An unknown error has occurred";
          Sentry.captureException(error);
        }
        return (
          <ScrollView refreshControl={<RefreshControl refreshing={refetching} onRefresh={this.refresh} />} style={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <Ionicons name='ios-close-circle-outline' size={100} color={RkTheme.current.colors.text.subtitle} style={{ marginBottom: 14 }} />
              <RkText rkType='subtitle' style={{ textAlign: 'center' }}>{ message }</RkText>
            </View>
          </ScrollView>
        )
      } else {
        return <WrappedComponent {...this.props} refresh={this.refresh} refetching={refetching} />
      }
    }
  };

  return Wrapper;
}