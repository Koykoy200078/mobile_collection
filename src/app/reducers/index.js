import ApplicationReducer from './application';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {createStore, applyMiddleware, combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['auth'],
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: [],
};

import auth from './auth';
import batchDetails from './batchDetails';
import upload from './upload';

const rootReducer = combineReducers({
  // authLogin: persistReducer(authPersistConfig, authLogin),
  // auth: AuthReducer,
  auth: persistReducer(authPersistConfig, auth),
  application: ApplicationReducer,
  batchDetails,
  upload,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export default () => {
  let store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware, thunk),
  );
  let persistor = persistStore(store);

  return {store, persistor, runSaga: sagaMiddleware.run};
};
