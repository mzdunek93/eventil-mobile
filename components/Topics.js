import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { RkText, RkStyleSheet, RkTheme, RkButton } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';
import { SecureStore } from 'expo';
import { GOOGLE_PLACES_KEY } from '../constants';

const { width } = Dimensions.get('window');

const TOPICS_PADDING = 8;
const TOPICS_MARGIN = 2;
const topicSize = (width - TOPICS_PADDING * 2) / 3 - TOPICS_MARGIN * 2;

const styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: RkTheme.current.colors.foreground,
    paddingTop: 20
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
  title: {
    marginBottom: 10,
    marginHorizontal: 20,
    textAlign: 'center'
  },
  subtitle: {
    marginBottom: 10,
    marginHorizontal: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    height: 60,
    backgroundColor: RkTheme.current.colors.foreground,
    padding: 10,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 40
  },
  topic: {
    margin: TOPICS_MARGIN,
    width: topicSize,
    height: topicSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#384157'
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: TOPICS_PADDING
  },
  topicImage: {
    resizeMode: 'contain',
    height: '50%',
    width: '50%'
  },
  activeTopic: {
    backgroundColor: 'white'
  }
}));

const icons = {
  'android': require('../assets/images/onboarding/android.png'),
  'go': require('../assets/images/onboarding/go.png'),
  'html': require('../assets/images/onboarding/html.png'),
  'java': require('../assets/images/onboarding/java.png'),
  'javascript': require('../assets/images/onboarding/javascript.png'),
  'python': require('../assets/images/onboarding/python.png'),
  'rails': require('../assets/images/onboarding/rails.png'),
  'scala': require('../assets/images/onboarding/scala.png'),
  'swift': require('../assets/images/onboarding/swift.png'),
}

class Topic extends Component {
  state = {
    selected: true
  }

  render() {
    const { name, toggle, selected } = this.props;

    return (
      <TouchableOpacity activeOpacity={1} onPress={toggle}>
        <View style={[styles.topic, (selected ? styles.activeTopic : {})]}>
          <Image style={styles.topicImage} source={icons[name]} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default class Overview extends Component {
  state = {
    topics: [],
  }

  toggle = (name) => () => {
    const { topics } = this.state;
    if(topics.includes(name)) {
      this.setState({ topics: topics.filter(topic => topic != name) });
    } else {
      this.setState({ topics: topics.concat(name) })
    }
  }

  continue = async () => {
    await SecureStore.setItemAsync('topics', this.state.topics.join(','));
    Actions.location();
  }

  render() {
    const { event, loading, refetch } = this.props;
    const { topics } = this.state;
    const available = ["android", "go", "html", "java", "javascript", "python", "rails", "scala", "swift"];
    
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <Image style={styles.background} source={require('../assets/images/onboarding/background.png')} />
          <RkText rkType='inverse thin xxlarge' style={styles.title}>What kind of events are you interested in?</RkText>
          <RkText rkType='large light-purple' style={styles.subtitle}>You'll see more events from the categories you choose.</RkText>
          <View style={styles.topics}>
            { available.map(topic => (
                <Topic key={topic} name={topic} toggle={this.toggle(topic)} selected={topics.includes(topic)} />
              )
            )}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          { topics.length > 0 &&
            <RkButton style={styles.button} onPress={this.continue}>Continue</RkButton>
          }
        </View>
      </View>
    )
  }
}