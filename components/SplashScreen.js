import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { RkStyleSheet } from 'react-native-ui-kitten';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.foreground
  },
  logo: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  }
}));

class SplashScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>
    );
  }
}

export default SplashScreen;