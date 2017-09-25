import { RkTheme } from 'react-native-ui-kitten';

RkTheme.setType('RkCard', 'shadowed', {
  img: {
    height: 100,
    flex: 1,
    resizeMode: 'cover'
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
  }
});

RkTheme.setType('RkText', 'basic', {
  fontFamily: 'OpenSans'
});

RkTheme.setType('RkText', 'bold', {
  fontFamily: 'OpenSansBold'
});

RkTheme.setType('RkText', 'inverse', {
  color: RkTheme.current.colors.background,
});

RkTheme.setTheme({
  colors: {
    text: {
      subtitle: '#8C96A9'
    },
    foreground: '#222C3C' 
  }
});
