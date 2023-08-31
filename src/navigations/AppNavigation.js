import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
	CardStyleInterpolators,
	createStackNavigator,
} from '@react-navigation/stack'

import {
	Dimensions,
	Easing,
	useColorScheme,
	Platform,
	StatusBar,
	View,
	Image,
} from 'react-native'
import { useSelector } from 'react-redux'
import { BaseColor, BaseStyle, Images, ROUTES, useTheme } from '../app/config'

import Login from '../screens/Auth/Login'
import Dashboard from '../screens/Dashboard'
import CashIn from '../screens/ClientCollection'
import { Icons } from '../app/config/icons'
import ViewScreen from '../screens/ViewScreen'
import CheckOutScreen from '../screens/CheckOutScreen'
import Account from '../screens/Account'
import PrintOutScreen from '../screens/PrintOutScreen'
import UploadData from '../screens/UploadData'
import OtherSLScreen from '../screens/OtherSLScreen'

const width = Dimensions.get('window').width

const options = {
	headerShown: false,
	// gestureEnabled: true,
	gestureDirections: 'horizontal',
	transitionSpec: {
		open: { animation: 'timing', duration: 300, easing: Easing },
		close: { animation: 'timing', duration: 300, easing: Easing },
	},
	// cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
}

const AuthStack = createStackNavigator()
const Auth = () => {
	return (
		<AuthStack.Navigator
			initialRouteName={ROUTES.LOGIN}
			screenOptions={options}>
			<AuthStack.Screen name={ROUTES.LOGIN} component={Login} />
		</AuthStack.Navigator>
	)
}

const MainStack = createStackNavigator()
const Main = () => {
	return (
		<MainStack.Navigator
			initialRouteName={ROUTES.TAB}
			screenOptions={options}>
			<MainStack.Screen name={ROUTES.TAB} component={TabBar} />
			<MainStack.Screen name={ROUTES.VIEW} component={ViewScreen} />
			<MainStack.Screen name={ROUTES.CHECKOUT} component={CheckOutScreen} />
			<MainStack.Screen name={ROUTES.PRINTOUT} component={PrintOutScreen} />
			<MainStack.Screen name={ROUTES.UPLOAD_DATA} component={UploadData} />
			<MainStack.Screen name={ROUTES.OTHERSLSCREEN} component={OtherSLScreen} />
		</MainStack.Navigator>
	)
}

const Tab = createBottomTabNavigator()
const TabBar = () => {
	const { colors } = useTheme()
	return (
		<Tab.Navigator
			initialRouteName={ROUTES.DASHBOARD}
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarIcon: ({ focused, color, size }) => {
					let iconName
					if (route.name === ROUTES.DASHBOARD) {
						iconName = focused ? 'view-dashboard-outline' : 'view-dashboard'
						return (
							<Icons.MaterialCommunityIcons
								name={iconName}
								size={size}
								color={color}
							/>
						)
					} else if (route.name === ROUTES.CLIENT_COLLECTION) {
						iconName = focused ? 'collections-bookmark' : 'collections-bookmark'
						return (
							<Icons.MaterialIcons name={iconName} size={size} color={color} />
						)
					} else if (route.name === ROUTES.ACCOUNT) {
						iconName = focused ? 'person-outline' : 'person-sharp'
						return <Icons.Ionicons name={iconName} size={size} color={color} />
					}
				},
				activeTintColor: '#000',
				inactiveTintColor: 'gray',
				showLabel: false,
				style: {
					backgroundColor: '#fff',
					height: 60,
					fontSize: 12,
				},
			})}>
			<Tab.Screen name={ROUTES.DASHBOARD} component={Dashboard} />
			<Tab.Screen name={ROUTES.CLIENT_COLLECTION} component={CashIn} />
			<Tab.Screen name={ROUTES.ACCOUNT} component={Account} />
		</Tab.Navigator>
	)
}

export default () => {
	const { authData, error } = useSelector((state) => state.auth)

	const { theme } = useTheme()
	const isDarkMode = useColorScheme() === 'dark'

	useEffect(() => {
		// Config status bar
		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor(isDarkMode ? 'black' : 'white', true)
		}
		StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true)
	}, [isDarkMode])

	return (
		<View style={{ flex: 1, position: 'relative' }}>
			<NavigationContainer theme={theme}>
				{authData !== null &&
				authData !== undefined &&
				authData.token !== null &&
				error === false ? (
					<Main />
				) : (
					<Auth />
				)}
			</NavigationContainer>
		</View>
	)
}
