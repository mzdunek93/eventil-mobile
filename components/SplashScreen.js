import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { RkStyleSheet } from 'react-native-ui-kitten';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.foreground
  }
}));

class SplashScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color='white' size="large" />
      </View>
    );
  }
}

export default SplashScreen;