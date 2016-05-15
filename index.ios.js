import {
  AppRegistry,
  StatusBar,
} from 'react-native';

import Navigator from './src/Navigator';

StatusBar.setHidden(true, false);

AppRegistry.registerComponent('app', () => Navigator);