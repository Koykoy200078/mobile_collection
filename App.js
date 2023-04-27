import React from 'react';
import {View, Text, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {persistor, store} from './src/app/store';

import App from './src/navigation';

import * as Utils from './src/app/utils';

LogBox.ignoreAllLogs();
Utils.setupLayoutAnimation();

export default function () {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
