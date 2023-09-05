import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
	View,
	useWindowDimensions,
	Platform,
	SafeAreaView,
	Alert,
	useColorScheme,
	NativeModules,
} from 'react-native'
import { Show, Text } from '../../app/components'
import { Icons } from '../../app/config/icons'
import { Shadow } from 'react-native-shadow-2'
import databaseOptions, {
	Client,
	UploadData,
} from '../../app/database/allSchemas'
import DeviceInfo from 'react-native-device-info'
import { showError, showInfo } from '../../app/components/AlertMessage'
import { isDeviceSupported } from '../../app/config/DeviceSupport'
import { BleManager } from 'react-native-ble-plx'

const isWithinTimeRangeGoodMorning = (hour, minute) => {
	return hour >= 5 && hour < 12 // 5:00 AM to 11:59 AM
}

const isWithinTimeRangeGoodAfternoon = (hour, minute) => {
	return hour >= 12 && hour < 17 // 12:00 PM to 4:59 PM
}

const isWithinTimeRangeGoodEvening = (hour, minute) => {
	return hour >= 17 && hour < 22 // 5:00 PM to 9:59 PM
}

const Dashboard = ({ navigation }) => {
	const isDarkMode = useColorScheme() === 'dark'
	const { width, height } = useWindowDimensions()
	const ios = Platform.OS === 'ios'
	const [localHour, setLocalHour] = useState(null)
	const [localMinute, setLocalMinute] = useState(null)
	const [isCollapsed, setIsCollapsed] = useState(false)

	const [totalCashOnHand, setTotalCashOnHand] = useState(0.0)

	const [totalCollectedAmount, setTotalCollectedAmount] = useState(0.0)
	const [greetings, setGreetings] = useState('Hello')

	const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false)
	const [manager, setManager] = useState(null)

	const intervalRef = useRef(null)

	const updateLocalTime = () => {
		const now = new Date()
		const hours = now.getHours()
		const minutes = now.getMinutes()

		setLocalHour(hours < 10 ? `0${hours}` : hours)
		setLocalMinute(minutes < 10 ? `0${minutes}` : minutes)
	}

	useEffect(() => {
		const initBluetoothManager = async () => {
			const bleManager = new BleManager()
			setManager(bleManager)

			try {
				const state = await bleManager.state()
				setIsBluetoothEnabled(state === 'PoweredOn')
			} catch (error) {
				console.error('Error checking Bluetooth status: ', error)
			}
		}

		initBluetoothManager()

		return () => {
			// Clean up the BleManager instance when the component unmounts
			if (manager) {
				manager.destroy()
				setManager(null)
			}
		}
	}, [])

	useEffect(() => {
		if (isBluetoothEnabled === false) {
			showInfo({
				message: 'Bluetooth',
				description: 'Turn on Bluetooth for Receipt Printing',
			})
		}
	}, [])

	useEffect(() => {
		if (isWithinTimeRangeGoodMorning(localHour, localMinute)) {
			setGreetings('Good Morning ☀️')
		} else if (isWithinTimeRangeGoodAfternoon(localHour, localMinute)) {
			setGreetings('Good Afternoon 🌤️')
		} else if (isWithinTimeRangeGoodEvening(localHour, localMinute)) {
			setGreetings('Good Evening 🌙')
		} else {
			setGreetings('Hello 👋') // Default greeting if none of the above conditions match
		}

		intervalRef.current = setInterval(() => {
			updateLocalTime()
			checkAndShowData()
		}, 1000)

		return () => {
			clearInterval(intervalRef.current)
		}
	}, [localHour, localMinute, greetings, totalCashOnHand, totalCollectedAmount])

	const checkAndShowData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const clients = realm.objects(Client)
			const uploadData = realm.objects(UploadData)
			const clientsArray = Array.from(clients)
			const uploadDataArray = Array.from(uploadData)

			if (clientsArray.length > 0 || uploadDataArray.length > 0) {
				showCollectedAmount(uploadDataArray)
				showCashOnHandData(clientsArray)
			} else {
				// No data, do nothing
			}
			// realm.close()
		} catch (error) {
			Alert.alert('Error retrieving data: ', error)
			console.error(error)
		}
	}, [])

	const newBalTotalCashOnHand = totalCashOnHand.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const newBalCollected = totalCollectedAmount.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const totalAmount = parseFloat(totalCashOnHand)
	const newBalTotal = totalAmount.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const showCollectedAmount = (data) => {
		const filteredData = data.filter((item) => item.collections.length > 0)
		const totalDueArray = filteredData.map((item) =>
			item.collections.map((collection) => parseFloat(collection.AMT))
		)

		const flatTotalDueArray = totalDueArray.flat()
		const totalDueSum = flatTotalDueArray.reduce(
			(acc, currentValue) => acc + currentValue,
			0
		)

		setTotalCollectedAmount(totalDueSum)

		return null
	}

	const showCashOnHandData = (data) => {
		const filteredData = data.filter((item) => item.collections.length > 0)
		const totalDueArray = filteredData.map((item) =>
			item.collections.map((collection) => parseFloat(collection.TOTALDUE))
		)

		const flatTotalDueArray = totalDueArray.flat()
		const totalDueSum = flatTotalDueArray.reduce(
			(acc, currentValue) => acc + currentValue,
			0
		)

		setTotalCashOnHand(totalDueSum)

		return null
	}

	return (
		<View
			className='flex-1'
			style={{
				width: width,
				height: height,
			}}>
			<SafeAreaView className='mb-3'>
				<View className='flex-row mx-2 justify-between'>
					<View>
						<Text title3>{greetings}</Text>
						<Text title2>...</Text>
					</View>

					<View />

					<View className='items-center'>
						<Icons.Entypo name='notification' size={24} color='black' />
					</View>
				</View>
			</SafeAreaView>

			<View className='mx-2 p-2'>
				<Shadow
					distance={2}
					startColor={isDarkMode ? '#f1f1f1' : '#00000020'}
					style={{
						padding: 10,
						width: width - 35,
						marginHorizontal: 10,
						borderRadius: 10,
					}}>
					<View className='mr-2'>
						<Show
							title={'Total Summary'}
							enableTooltip={false}
							toggleAccordion={() => setIsCollapsed(!isCollapsed)}
							isCollapsed={isCollapsed}
							isActive={!isCollapsed ? 'angle-down' : 'angle-up'}
							totalCollectedAmount={newBalCollected}
							totalRemittedAmount={parseFloat(0).toFixed(2)}
							total={newBalTotalCashOnHand}
						/>
					</View>
					<Text title1>₱ {newBalTotalCashOnHand}</Text>
				</Shadow>
			</View>
		</View>
	)
}

export default Dashboard
