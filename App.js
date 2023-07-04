import React from 'react';
import {View, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import configureStore from './src/app/reducers';
import rootSaga from './src/app/sagas';
const {store, persistor, runSaga} = configureStore();

runSaga(rootSaga);
import * as Utils from './src/app/utils';

import AppNavigation from './src/navigations/AppNavigation';

Utils.setupLayoutAnimation();
export default function () {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigation />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
