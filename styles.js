import { RkTheme } from 'react-native-ui-kitten';

RkTheme.setTheme({
  colors: {
    text: {
      subtitle: '#8C96A9',
      light: '#adadad',
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
