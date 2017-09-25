import React, { Component } from 'react'
import {
  Animated,
  TouchableOpacity,
} from 'react-native'

class Touchable extends Component {
  state = {
    scale: new Animated.Value(1),
  }

  scaleTo(value) {
    Animated.timing(
      this.state.scale,
      {
        toValue: value,
        duration: 80,
      }
    ).start();
  }

  render() {
    let { scale } = this.state;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => this.scaleTo(0.96)}
        onPressOut={() => this.scaleTo(1)}
        delayPressIn={20}
        {...this.props}
      >
        <Animated.View
          style={{ transform: [{ scale }] }}
        >
          {this.props.children}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
export default Touchable
