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
import { useSelector } from 'react-redux'

const PrintOutScreen = ({ navigation, route }) => {
	const { width, height } = useWindowDimensions()
	const auth = useSelector((state) => state.auth.authData)
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

	const { getName, allData, inputAmounts, refNo, total } = route.params

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

	const renderedItem = allData.collections.map((collection) => {
		const matchingInputAmount = inputAmounts[collection.ID]

		if (matchingInputAmount) {
			const { AMOUNT } = matchingInputAmount

			if (AMOUNT) {
				let getAMNT = parseFloat(AMOUNT).toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
				return `${collection.SLDESCR}\n${collection.REF_TARGET}\nAmount Paid          ${getAMNT}\n\n`
			}
		}
	})

	// Join the renderedItems array with line breaks to create a single string
	const renderedText = renderedItem.join('')

	const renderedData = allData.collections.map((collection) => {
		const matchingInputAmount = inputAmounts[collection.ID]

		if (matchingInputAmount) {
			const { AMOUNT } = matchingInputAmount

			let getAMNT = parseFloat(AMOUNT).toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})

			return (
				<View key={collection.ID} className='items-start'>
					<Text
						className='text-center text-base font-bold'
						style={{ color: '#000' }}>
						{collection.SLDESCR}
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
								{collection.REF_TARGET}
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
								{getAMNT}
							</Text>
						</View>
					</View>
				</View>
			)
		} else {
			return null // Don't render if there's no matching inputAmount
		}
	})

	const printME = async () => {
		try {
			currentPrinter &&
				BLEPrinter.printBill(
					'<C> Collection Receipt</C>\n' +
						'<C>Sacred Heart Coop</C>\n' +
						'<C>Cruz na Daan 3008 San Rafael, Philippines</C>\n' +
						'<C>--------------------------------</C>\n' +
						`Client No.: ${allData.client_id}\n` +
						`Client Name: ${getName}\n` +
						'<C>--------------------------------</C>\n' +
						`${renderedText}` +
						`Total Paid Amount    ${totalAmount}\n` +
						'<C>--------------------------------</C>\n' +
						`Ref No.: ${refNo}\n` +
						`Date: ${formattedDate}\n` +
						`Collected By ${
							auth && auth.data ? auth.data.collector_desc : '...'
						}\n` +
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
							<View className='space-y-2'>
								<View className='items-start'>
									<View style={{ flexDirection: 'row', padding: 5 }}>
										<View style={{ width: '38%' }}>
											<Text
												style={{
													flexShrink: 1,
													fontWeight: 'bold',
													color: '#000',
												}}>
												Client ID
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

									<View style={{ flexDirection: 'row', padding: 5 }}>
										<View style={{ width: '38%' }}>
											<Text
												style={{
													flexShrink: 1,
													fontWeight: 'bold',
													color: '#000',
												}}>
												Client Name
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
												{getName}
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

								{renderedData}

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
												Reference No.
											</Text>
										</View>
										<View>
											<Text
												style={{
													flexShrink: 1,
													color: '#000',
												}}>
												{refNo}
											</Text>
										</View>
									</View>

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

									<View style={{ flexDirection: 'row', padding: 5 }}>
										<View style={{ width: '35%' }}>
											<Text
												style={{
													flexShrink: 1,
													fontWeight: 'bold',
													color: '#000',
												}}>
												Collected By
											</Text>
										</View>
										<View>
											<Text
												style={{
													flexShrink: 1,
													color: '#000',
												}}>
												{auth && auth.data ? auth.data.collector_desc : '...'}
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
