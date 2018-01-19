import { RkTheme } from 'react-native-ui-kitten';

RkTheme.setTheme({
  colors: {
    text: {
      subtitle: '#8C96A9',
      light: '#adadad',
      lightPurple: '#a7abb1'
    },
    foreground: '#222C3C',
    light: '#d6d6d6',
    bg: '#f9f9fb',
  },
});

RkTheme.setType('RkCard', 'shadowed', {
  img: {
    height: 100,
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    height: 100,
  },
  footer: {
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingBottom: 14,
    marginRight: 14,
  },
  content: {
    paddingBottom: 7.5
  }
});

RkTheme.setType('RkText', 'thin', {
  fontFamily: 'OpenSansLight',
});

RkTheme.setType('RkText', 'basic', {
  fontFamily: 'OpenSans',
});

RkTheme.setType('RkText', 'semibold', {
  fontFamily: 'OpenSansSemibold',
});

RkTheme.setType('RkText', 'bold', {
  fontFamily: 'OpenSansBold',
});

RkTheme.setType('RkText', 'inverse', {
  color: RkTheme.current.colors.background,
});

RkTheme.setType('RkText', 'light', {
  color: RkTheme.current.colors.text.light,
});

RkTheme.setType('RkText', 'light-purple', {
  color: RkTheme.current.colors.text.lightPurple,
});

RkTheme.setType('RkText', 'xxlarge', {
  fontSize: 30,
});