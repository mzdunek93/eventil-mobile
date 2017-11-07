
import { Constants } from 'expo'
import { Platform } from 'react-native'

export class GoogleAnalyticsTracker {
  constructor(trackingId) {
    this.trackingId = trackingId
  }

  toQueryString = (obj) => {
    var str = []

    for(var p in obj) {
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    }

    return str.join('&')
  }

  deviceModel() {
    if (Platform.OS === 'ios') {
      return Constants.platform.ios.model
    } else {
      return null
    }
  }

  trackScreenView = (screenName, screenArgs) => {
    let hit = {
      v: 1,
      tid: this.trackingId,             // Tracking ID
      cid: Constants.deviceId,          // Anonymous Client ID.
      sid: Constants.sessionId,         // Anonymous Session ID.
      t: 'screenview',                  // Screenview hit type.
      an: 'Your App Name',              // App name.
      av: '1.0.0',                      // App version.
      cd: screenName,                   // Screen name / content description
      arg: screenArgs,                  // Screen arguments
      dn: Constants.deviceName,         // Device name.
      dm: this.deviceModel(),           // Device model.
      on: Platform.OS,                  // Operating system.
      ov: Platform.Version,             // Operating system version.
      ds: !Constants.isDevice,          // If app is running on a device.
      ao: Constants.appOwnership,       // Returns expo, standalone, or guest.
      ev: Constants.expoVersion         // Expo version.
    }

    let options = {
      method: 'get'
    }

    url = `https://www.google-analytics.com/collect?` +
          `${this.toQueryString(hit)}` +
          `&z=${Math.round(Math.random() * 1e8)}`

    return fetch(url, options)
  }
}
