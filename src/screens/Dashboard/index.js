import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
	View,
	useWindowDimensions,
	Platform,
	SafeAreaView,
	Alert,
} from 'react-native'
import { Show, Text } from '../../app/components'
import { Icons } from '../../app/config/icons'
import { Shadow } from 'react-native-shadow-2'
import databaseOptions, {
	Client,
	UploadData,
} from '../../app/database/allSchemas'


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
	const { width, height } = useWindowDimensions()
	const ios = Platform.OS === 'ios'
	const [localHour, setLocalHour] = useState(null)
	const [localMinute, setLocalMinute] = useState(null)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [totalCashIn, setTotalCashIn] = useState(0.0)
	const [totalCashOut, setTotalCashOut] = useState(0.0)
	const [greetings, setGreetings] = useState('Hello')

	const intervalRef = useRef(null)

	const updateLocalTime = () => {
		const now = new Date()
		const hours = now.getHours()
		const minutes = now.getMinutes()

		setLocalHour(hours < 10 ? `0${hours}` : hours)
		setLocalMinute(minutes < 10 ? `0${minutes}` : minutes)
	}

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
	}, [totalCashIn, totalCashOut, localHour, localMinute, greetings])

	const checkAndShowData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const clients = realm.objects(Client)
			const uploadData = realm.objects(UploadData)
			const clientsArray = Array.from(clients)
			const uploadDataArray = Array.from(uploadData)

			if (clientsArray.length > 0 || uploadDataArray.length > 0) {
				showData(clientsArray)
				showDataUpload(uploadDataArray)
			} else {
				// No data, do nothing
			}
			// realm.close()
		} catch (error) {
			Alert.alert('Error retrieving data: ', error)
			console.error(error)
		}
	}, [])

	const cashIn = totalCashIn
	const cashOut = totalCashOut
	const newBalCashIn = totalCashIn.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const newBalCashOut = totalCashOut.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const totalAmount = parseFloat(cashIn) - parseFloat(cashOut)
	const newBalTotal = totalAmount.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const showData = (data) => {
		const filteredData = data.filter((item) => item.collections.length > 0)
		const totalDueArray = filteredData.map((item) =>
			item.collections.map((collection) => parseFloat(collection.TOTALDUE))
		)

		const flatTotalDueArray = totalDueArray.flat()
		const totalDueSum = flatTotalDueArray.reduce(
			(acc, currentValue) => acc + currentValue,
			0
		)

		setTotalCashIn(totalDueSum)

		return null
	}

	const showDataUpload = (data) => {
		const filteredData = data.filter((item) => item.collections.length > 0)
		const totalDueArray = filteredData.map((item) =>
			item.collections.map((collection) => parseFloat(collection.AMT))
		)

		const flatTotalDueArray = totalDueArray.flat()
		const totalDueSum = flatTotalDueArray.reduce(
			(acc, currentValue) => acc + currentValue,
			0
		)

		setTotalCashOut(totalDueSum)

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
					distance={5}
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
							totalCashIn={newBalCashIn}
							totalCashout={newBalCashOut}
							total={newBalTotal}
						/>
					</View>
					<Text title1>₱ {newBalTotal}</Text>
				</Shadow>
			</View>

			{/* <FlatList
				data={data}
				columnWrapperStyle={{
					flex: 1,
					justifyContent: 'space-evenly',
					marginVertical: 10,
				}}
				numColumns={2}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => {
					console.log('item: ', item)
					return (
						<TouchableOpacity
							onPress={() => {
								if (item.id === 1) {
									navigation.navigate(ROUTES.CLIENT_COLLECTION)
								}
							}}>
							<View className='border rounded-md p-2 items-center justify-center'>
								<Image
									source={item.image}
									style={{ width: width * 0.4, height: height * 0.1 }}
									resizeMode='contain'
								/>

								<Text title3>{item.title}</Text>
							</View>

							<Shadow
								distance={5}
								style={{
									padding: 10,
									borderRadius: 10,
									justifyContent: 'center',
									alignItems: 'center',
									width: 140,
									height: 120,
								}}>
								{item.icon ? (
									<Icons.MaterialIcons
										name={item.icon}
										size={70}
										color={colors.text}
									/>
								) : (
									<Image
										source={item.image}
										style={{ width: width * 0.35, height: height * 0.1 }}
										resizeMode='contain'
									/>
								)}

								<Text title3 className='text-sm mt-1'>
									{item.title}
								</Text>
							</Shadow>
						</TouchableOpacity>
					)
				}}
			/> */}
		</View>
	)
}

export default Dashboard
