import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
	View,
	useWindowDimensions,
	Platform,
	SafeAreaView,
	Alert,
	useColorScheme,
	ScrollView,
} from 'react-native'
import { Show, Text } from '../../app/components'
import { Icons } from '../../app/config/icons'
import { Shadow } from 'react-native-shadow-2'
import databaseOptions, {
	Client,
	UploadData,
	totalAmountUpload,
} from '../../app/database/allSchemas'
import { useSelector } from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import { BLEPrinter } from 'react-native-thermal-receipt-printer'
import { isDeviceSupported } from '../../app/config/DeviceSupport'
import { showError, showInfo } from '../../app/components/AlertMessage'

const isWithinTimeRangeGoodMorning = (hour, minute) => {
	return hour >= 5 && hour < 12 // 5:00 AM to 11:59 AM
}

const isWithinTimeRangeGoodAfternoon = (hour, minute) => {
	return hour >= 12 && hour < 17 // 12:00 PM to 4:59 PM
}

const isWithinTimeRangeGoodEvening = (hour, minute) => {
	return hour >= 17 && hour < 22 // 5:00 PM to 9:59 PM
}

const Dashboard = () => {
	const auth = useSelector((state) => state.auth.authData)
	const { isSuccess, isLoading } = useSelector((state) => state.upload)
	const isDarkMode = useColorScheme() === 'dark'
	const { width, height } = useWindowDimensions()
	const [localHour, setLocalHour] = useState(null)
	const [localMinute, setLocalMinute] = useState(null)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [getGreetings, setGreetings] = useState('Hello 👋')

	const [uploadAMNT, setUploadAMNT] = useState(null)
	const [amountDB, setAmountDB] = useState(null)

	// Payment Type //
	const [getCash, setCash] = useState(null)
	const [getCheck, setCheck] = useState(null)
	const [getOther, setOther] = useState(null)
	// End Payment Type //

	const intervalRef = useRef(null)

	const updateLocalTime = () => {
		const now = new Date()
		const hours = now.getHours()
		const minutes = now.getMinutes()

		setLocalHour(hours < 10 ? `0${hours}` : hours)
		setLocalMinute(minutes < 10 ? `0${minutes}` : minutes)
	}

	const checkAndShowData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const uploadData = realm.objects(UploadData)
			let saveAmountArray = Array.from(realm.objects(totalAmountUpload))
			const uploadDataArray = Array.from(uploadData)

			if (uploadData.length > 0) {
				showCollectedAmount(uploadDataArray)
			} else {
				setUploadAMNT(0)
			}

			if (saveAmountArray.length === 0) {
				realm.write(() => {
					realm.create(totalAmountUpload, { amount: '0.00' })
					saveAmountArray = [{ amount: '0.00' }]
				})
			}
			setAmountDB(saveAmountArray)
		} catch (error) {
			Alert.alert('Error retrieving data: ', error)
			console.error(error)
		}
	}, [])

	const showCollectedAmount = (data) => {
		const calculateTotal = (type) => {
			return data
				.filter((item) => item.collections.length > 0)
				.map((item) => {
					return item.COCI.filter((collected) => collected.TYPE === type).map(
						(collected) => {
							const amount = collected.AMOUNT ? parseFloat(collected.AMOUNT) : 0
							return isNaN(amount) ? 0 : amount
						}
					)
				})
				.flat()
				.reduce((acc, currentValue) => acc + currentValue, 0)
		}

		const totalCash = calculateTotal('CASH')
		const totalCheck = calculateTotal('CHECK')
		const totalDueSum = totalCash + totalCheck

		setCash(totalCash)
		setCheck(totalCheck)
		setUploadAMNT(totalDueSum)

		return null
	}

	useEffect(() => {
		if (isWithinTimeRangeGoodMorning(localHour, localMinute)) {
			setGreetings('Good Morning ☀️')
		} else if (isWithinTimeRangeGoodAfternoon(localHour, localMinute)) {
			setGreetings('Good Afternoon 🌤️')
		} else if (isWithinTimeRangeGoodEvening(localHour, localMinute)) {
			setGreetings('Good Evening 🌙')
		} else {
			setGreetings('Hello 👋')
		}

		const fetchDataAndUpdate = async () => {
			await checkAndShowData()
			updateLocalTime()
		}

		intervalRef.current = setInterval(fetchDataAndUpdate, 1000)

		return () => {
			clearInterval(intervalRef.current)
		}
	}, [
		localHour,
		localMinute,
		getGreetings,
		uploadAMNT,
		amountDB,
		getCash,
		getCheck,
		getOther,
	])

	useEffect(() => {
		if (isSuccess) {
			setCash(0)
			setCheck(0)
		}
	}, [isSuccess])

	useEffect(() => {
		if (Platform.OS === 'android') {
			let model = DeviceInfo.getModel()

			if (isDeviceSupported(model)) {
				BLEPrinter.init().then(() => {
					BLEPrinter.getDeviceList().then((deviceList) => {
						if (deviceList.length > 0) {
							_connectPrinter(deviceList[0])
						}
					})
				})
			} else {
				showError({
					message: 'Device not supported',
					description:
						model + ' is not supported. Please contact your administrator.',
				})
			}
		}
	}, [])

	const _connectPrinter = (printer) => {
		BLEPrinter.connectPrinter(printer.inner_mac_address)
			.then(() => {
				showInfo({
					message: 'Printer Connected',
					description: 'Device linked with printer. Ready for direct printing.',
				})
			})
			.catch((error) => {
				console.warn(error)
			})
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
						<Text title3>{getGreetings}</Text>
						<Text body2>
							{auth && auth.data ? auth.data.collector_desc : '...'}
						</Text>
					</View>

					<View />

					<View className='items-center'>
						<Icons.Entypo name='notification' size={24} color='black' />
					</View>
				</View>
			</SafeAreaView>

			<ScrollView showsVerticalScrollIndicator={false}>
				<View className='mx-2 p-2'>
					<Shadow
						distance={2}
						startColor={isDarkMode ? '#f1f1f1' : '#00000020'}
						style={{
							padding: 5,
							width: width - 35,
							marginHorizontal: 10,
							borderRadius: 10,
						}}>
						<View className='mb-2'>
							<Show
								title={'Total Summary'}
								enableTooltip={true}
								toggleAccordion={() => setIsCollapsed(!isCollapsed)}
								isCollapsed={isCollapsed}
								isActive={!isCollapsed ? 'angle-down' : 'angle-up'}
								totalCollectedAmount={
									uploadAMNT
										? parseFloat(uploadAMNT).toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
										  })
										: '0.00'
								}
								totalCash={
									getCash
										? parseFloat(getCash).toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
										  })
										: '0.00'
								}
								totalCheck={
									getCheck
										? parseFloat(getCheck).toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
										  })
										: '0.00'
								}
								totalOthers={'0.00'}
								totalRemittedAmount={
									amountDB &&
									parseFloat(amountDB[0]?.amount).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})
								}
								total={
									uploadAMNT
										? parseFloat(uploadAMNT).toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
										  })
										: '0.00'
								}
							/>
						</View>

						<View>
							<Text title1>
								₱{' '}
								{uploadAMNT
									? parseFloat(uploadAMNT).toLocaleString('en-US', {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })
									: '0.00'}
							</Text>
						</View>
					</Shadow>
				</View>
			</ScrollView>
		</View>
	)
}

export default Dashboard
