import {
	View,
	Text,
	useColorScheme,
	Platform,
	TouchableOpacity,
	useWindowDimensions,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import { imageUri } from './imageUri'
import { ROUTES } from '../../app/config'

import { ScrollView } from 'react-native-gesture-handler'

import ZigzagView from 'react-native-zigzag-view'
import { FloatingAction } from 'react-native-floating-action'
import { Icons } from '../../app/config/icons'

import { BLEPrinter } from 'react-native-thermal-receipt-printer'
import { Shadow } from 'react-native-shadow-2'
import { isDeviceSupported } from '../../app/config/DeviceSupport'
import DeviceInfo from 'react-native-device-info'
import { showError } from '../../app/components/AlertMessage'

const PrintOutScreen = ({ navigation, route }) => {
	const { width, height } = useWindowDimensions()

	const [printers, setPrinters] = useState([])
	const [currentPrinter, setCurrentPrinter] = useState(null) // Initialize as null
	const [isPrinterConnected, setIsPrinterConnected] = useState(false) // Add state for connection status

	const isDarkMode = useColorScheme() === 'dark'

	const [data, setData] = useState(null)
	const [selectedPrinter, setSelectedPrinter] = useState(null)

	const logoUri = 'data:image/png;base64,' + imageUri.data

	const currentDate = new Date()

	const day = currentDate.getDate()
	const monthIndex = currentDate.getMonth()
	const year = currentDate.getFullYear()
	const hour = currentDate.getHours()
	const minute = currentDate.getMinutes()
	const ampm = hour >= 12 ? 'PM' : 'AM'

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const formattedHour = hour % 12 === 0 ? 12 : hour % 12 // Convert hour to 12-hour format
	const formattedMinute = minute.toString().padStart(2, '0') // Ensure minute has two digits

	const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`

	// Function to generate a random number within a range
	const getRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	// Generate random Receipt No.
	const receiptNo = getRandomNumber(1000, 9999)

	// Generate random Reference ID
	const referenceID = getRandomNumber(100000000000, 999999999999)

	const { name, allData, inputAmounts, ID, total } = route.params

	const Fullname = [
		allData.LName.trim() ? `${allData.LName},` : '',
		allData.FName.trim() ? allData.FName : '',
		allData.MName,
		allData.SName,
	]
		.filter(Boolean)
		.join(' ')

	useEffect(() => {
		if (Platform.OS === 'android') {
			let model = DeviceInfo.getModel()

			if (isDeviceSupported(model)) {
				BLEPrinter.init().then(() => {
					BLEPrinter.getDeviceList().then((deviceList) => {
						setPrinters(deviceList)

						// Check if there are printers and automatically connect to the first one
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
				setCurrentPrinter(printer)
				setIsPrinterConnected(true) // Set connection status to true
			})
			.catch((error) => {
				setIsPrinterConnected(false)
				console.warn(error)
			})
	}

	const totalAmount = total.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const filteredData =
		allData && allData.collections.find((item) => item.ID === item.ID)

	const renderedItem = Object.keys(inputAmounts)
		.map((refNo) => {
			const { REF_TARGET, AMOUNT } = inputAmounts[refNo]
			const matchingItem = allData.collections.find(
				(item) => item.REF_TARGET === refNo
			)

			const matchingItemID = allData.collections.find((item) => item.ID === ID)

			// if (!matchingItem) {
			// 	return null // Skip if there is no matching item in the API data
			// }

			// if (!matchingItemID) {
			// 	return null // Skip if there is no matching item in the API data
			// }

			if (!AMOUNT) {
				return null // Skip if name is missing or both deposit and share capital are empty
			}

			// Generate the HTML markup for each item
			let itemHTML = ''
			let name = matchingItemID ? matchingItemID.SLDESCR : matchingItem.SLDESCR
			let ref_target = matchingItemID
				? matchingItemID.REF_TARGET
				: matchingItem.REF_TARGET

			if (AMOUNT) {
				let sldescr = parseFloat(AMOUNT).toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
				itemHTML += `${name}\n${ref_target}\nAmount Paid          ${sldescr}\n\n`
			}

			return itemHTML
		})
		.filter(Boolean)
		.join('')

	// RenderData
	const renderData = Object.keys(inputAmounts)
		.map((refNo) => {
			const { AMOUNT } = inputAmounts[refNo]
			const matchingItem = allData.collections.find(
				(item) => item.REF_TARGET.toString() === refNo.toString()
			)

			const matchingItemID = allData.collections.find((item) => item.ID === ID)

			if (!AMOUNT) {
				return null
			}

			let name = matchingItemID ? matchingItemID.SLDESCR : matchingItem.SLDESCR
			let ref_target = matchingItemID
				? matchingItemID.REF_TARGET
				: matchingItem.REF_TARGET

			const ref_targetAmount = parseFloat(AMOUNT).toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})

			return (
				<View key={refNo} className='items-start'>
					<Text
						className='text-center text-base font-bold'
						style={{ color: '#000' }}>
						{name}
					</Text>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ width: '50%' }}>
							<Text className='flex-shrink text-black font-semibold text-sm'>
								• Reference No.
							</Text>
						</View>
						<View>
							<Text
								className='text-center text-sm'
								style={{
									flexShrink: 1,
									color: '#000',
								}}>
								{ref_target}
							</Text>
						</View>
					</View>

					<View style={{ flexDirection: 'row' }}>
						<View style={{ width: '50%' }}>
							<Text className='flex-shrink text-black font-semibold text-sm'>
								• Amount Paid
							</Text>
						</View>
						<View>
							<Text
								className='text-sm'
								style={{
									flexShrink: 1,
									color: '#000',
								}}>
								{ref_targetAmount}
							</Text>
						</View>
					</View>
				</View>
			)
		})
		.filter(Boolean)

	const printME = async () => {
		try {
			currentPrinter &&
				BLEPrinter.printText(
					'<C>Statement of Account</C>\n' +
						'<C>Sacred Heart Coop</C>\n' +
						'<C>Cruz na Daan 3008 San Rafael, Philippines</C>\n' +
						'<C>--------------------------------</C>\n' +
						`Account Number: ${allData.client_id}\n` +
						`Biller Name: ${Fullname}\n` +
						'<C>--------------------------------</C>\n' +
						`${renderedItem}\n` +
						`Total Paid Amount    ${totalAmount}\n` +
						'<C>--------------------------------</C>\n' +
						`<C>${formattedDate}</C>\n` +
						'<C>--------------------------------</C>\n' +
						'<C>Thank you for using our service!<C>'
				)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			{!isPrinterConnected && (
				<View className='items-center'>
					<View style={styles.specifications}>
						<Text className='text-black dark:text-white font-bold'>
							STATUS: Printer Not Connected
						</Text>
					</View>
				</View>
			)}
			<SafeAreaView
				className='p-5'
				style={{
					height: height / 1.15,
				}}>
				<ZigzagView
					backgroundColor='#CCC'
					surfaceColor='#FFF'
					style={{
						borderWidth: 1,
						borderColor: isDarkMode ? '#FFF' : '#CCC',
					}}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							padding: 10,
						}}>
						<View className='space-y-5'>
							<View className=''>
								<Text
									className='text-center text-2xl font-bold'
									style={{ color: '#000' }}>
									Sacred Heart Coop
								</Text>
								<Text
									className='text-center text-xs font-bold'
									style={{ color: '#000' }}>
									Cruz na Daan 3008 San Rafael, Philippines
								</Text>
							</View>
							<View className='space-y-4'>
								<View className='items-start'>
									<Text
										className='text-center text-base font-bold'
										style={{ color: '#000' }}>
										BILLER
									</Text>
									<View style={{ flexDirection: 'row', padding: 5 }}>
										<View style={{ width: '38%' }}>
											<Text
												style={{
													flexShrink: 1,
													fontWeight: 'bold',
													color: '#000',
												}}>
												Account Name
											</Text>
										</View>
										<View
											style={{ width: '70%' }}
											numberOfLines={1}
											ellipsizeMode='tail'>
											<Text
												style={{
													flexShrink: 1,
													color: '#000',
												}}>
												{Fullname}
											</Text>
										</View>
									</View>
									<View style={{ flexDirection: 'row', padding: 5 }}>
										<View style={{ width: '38%' }}>
											<Text
												style={{
													flexShrink: 1,
													fontWeight: 'bold',
													color: '#000',
												}}>
												Account ID
											</Text>
										</View>
										<View style={{ width: '70%' }}>
											<Text
												numberOfLines={1}
												ellipsizeMode='tail'
												style={{
													flexShrink: 1,
													color: '#000',
												}}>
												{allData.client_id || 'N/A'}
											</Text>
										</View>
									</View>
								</View>

								<View
									style={{
										width: '100%',
										marginVertical: 10,
									}}>
									<View
										style={{
											width: '100%',
											borderWidth: 1,
											borderColor: '#E5E5E5',
											borderStyle: 'dashed',
											marginTop: -2,
										}}
									/>
								</View>

								{renderData}

								<View className='items-start'>
									<Text
										className='text-center text-base font-bold'
										style={{ color: '#000' }}>
										TOTAL PAID
									</Text>
									<View style={{ flexDirection: 'row', padding: 5 }}>
										<View style={{ width: '50%' }}>
											<Text
												style={{
													flexShrink: 1,
													fontWeight: 'bold',
													color: '#000',
												}}>
												Amount
											</Text>
										</View>
										<View>
											<Text
												style={{
													flexShrink: 1,
													color: '#000',
												}}>
												{totalAmount}
											</Text>
										</View>
									</View>
								</View>

								<View
									style={{
										width: '100%',
										marginVertical: 10,
									}}>
									<View
										style={{
											width: '100%',
											borderWidth: 1,
											borderColor: '#E5E5E5',
											borderStyle: 'dashed',
											marginTop: -2,
										}}
									/>
								</View>

								<View className='items-start'>
									<Text
										className='text-center text-base font-bold'
										style={{ color: '#000' }}>
										TRANSACTIONS DETAILS
									</Text>

									<View style={{ flexDirection: 'row', padding: 5 }}>
										<View style={{ width: '35%' }}>
											<Text
												style={{
													flexShrink: 1,
													fontWeight: 'bold',
													color: '#000',
												}}>
												Date
											</Text>
										</View>
										<View>
											<Text
												style={{
													flexShrink: 1,
													color: '#000',
												}}>
												{formattedDate}
											</Text>
										</View>
									</View>
								</View>
							</View>
						</View>
					</ScrollView>
				</ZigzagView>
			</SafeAreaView>
			{isPrinterConnected && (
				<FloatingAction
					showBackground={false}
					floatingIcon={
						<Icons.AntDesign name='printer' size={20} color='#FFFFFF' />
					}
					onPressMain={() => printME()}
				/>
			)}

			<View className='items-center'>
				<View style={styles.specifications}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate(ROUTES.DASHBOARD)
						}}>
						<View
							className='border rounded-md p-2'
							style={{ borderColor: isDarkMode ? '#FFF' : '#000' }}>
							<Text className='text-black dark:text-white'>GO BACK MAIN</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</>
	)
}

export default PrintOutScreen
