import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

// Import your reducers
import auth from './auth'
import batchDetails from './batchDetails'
import upload from './upload'

// Import your ApplicationReducer (assuming it's correctly exported)
import ApplicationReducer from './application'

// Create a Saga middleware
const sagaMiddleware = createSagaMiddleware()

// Redux Persist Configuration for the root reducer
const rootPersistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['auth'], // Exclude 'auth' from persisting
}

// Redux Persist Configuration for the 'auth' reducer
const authPersistConfig = {
	key: 'auth',
	storage: AsyncStorage,
	blacklist: [], // No blacklist for 'auth'
}

// Combine all your reducers
const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, auth),
	application: ApplicationReducer,
	batchDetails,
	upload,
})

// Create a persisted reducer with the rootPersistConfig
const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

// Create and configure the Redux store
export default () => {
	// Create the Redux store with middleware (saga and thunk)
	let store = createStore(
		persistedReducer,
		applyMiddleware(sagaMiddleware, thunk)
	)

	// Create the Redux Persist store
	let persistor = persistStore(store)

	// Expose a function to run your Sagas outside of components
	const runSaga = sagaMiddleware.run

	// Return the store, persistor, and runSaga function
	return { store, persistor, runSaga }
}
