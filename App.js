import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './src/app/reducers'
import rootSaga from './src/app/sagas'
const { store, persistor, runSaga } = configureStore()

runSaga(rootSaga)
import * as Utils from './src/app/utils'

import AppNavigation from './src/navigations/AppNavigation'

import Toast, { ErrorToast } from 'react-native-toast-message'
import { alertMsgConfig } from './src/app/components'

Utils.setupLayoutAnimation()

const App = () => {
	return (
		<>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<SafeAreaProvider>
						<AppNavigation />
					</SafeAreaProvider>
				</PersistGate>
			</Provider>

			<Toast position={'top'} visibilityTime={3000} config={alertMsgConfig} />
		</>
	)
}

export default App
