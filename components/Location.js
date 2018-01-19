import React, { Component } from 'react'
import {
  View,
  Image
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { RkText, RkStyleSheet, RkTheme, RkButton } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';
import { SecureStore } from 'expo';
import { GOOGLE_PLACES_KEY } from '../constants';

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RkTheme.current.colors.foreground,
  },
  background: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 20
  },
  title: {
    marginBottom: 10
  },
  subtitle: {
    marginBottom: 10
  },
  buttonContainer: {
    height: 60,
    backgroundColor: RkTheme.current.colors.foreground,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    height: 40
  }
}));

export default class Overview extends Component {
  state = {
    focused: false,
    selected: false
  }

  continue = async () => {
    await SecureStore.setItemAsync('location', this.state.location);
    Actions.events();
  }

  render() {
    const { event, loading, refetch } = this.props;
    const { focused, selected } = this.state;
    const containerStyle = focused ? { justifyContent: 'flex-start' } : {};
    const inputContainerStyle = focused ? { paddingHorizontal: 10 } : { flex: 0 };
    
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.container, containerStyle]}>
          <Image style={styles.background} source={require('../assets/images/onboarding/background.png')} />
          {!focused &&
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image style={styles.image} source={require('../assets/images/onboarding/location.png')} />
              <RkText rkType='inverse thin xxlarge' style={styles.title}>Set location</RkText>
              <RkText rkType='large light-purple' style={styles.subtitle}>You'll see events in this area.</RkText>
            </View>
          }
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed={false}    // true/false/undefined
            fetchDetails={false}
            renderDescription={row => row.description.split(',')[0]}
            enablePoweredByContainer={false}
            onPress={(data) => this.setState({ focused: false, selected: true, location: data.terms[0].value })}
            textInputProps={{
              onFocus: () => this.setState({ focused: true }),
            }}
            
            getDefaultValue={() => ''}
            
            query={{
              key: GOOGLE_PLACES_KEY,
              language: 'en', // language of the results
              types: '(cities)' // default: 'geocode'
            }}
            
            styles={{
              textInputContainer: {
                backgroundColor: 'white',
                height: 40,
                borderRadius: 5,
                width: focused ? '100%' : '90%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingHorizontal: 8,
                marginTop: 10
              },
              textInput: {
                fontFamily: 'OpenSans',
                marginTop: 0,
                marginRight: 0,
                marginLeft: 0
              },
              container: inputContainerStyle,
              listView: {
                backgroundColor: 'white',
                marginTop: 10,
                borderRadius: 5
              },
              description: {
                fontFamily: 'OpenSans'
              },
              row: {
                paddingVertical: 8,
                height: 34
              }
            }}
            
            currentLocation={false}
            nearbyPlacesAPI='GooglePlacesSearch'
            renderLeftButton={()  => <FontAwesome name='search' size={20} color={RkTheme.current.colors.light} />}
            debounce={200}
          />
        </View>
        <View style={styles.buttonContainer}>
          { selected &&
            <RkButton style={styles.button} onPress={this.continue}>Continue</RkButton>
          }
        </View>
      </View>
    )
  }
}