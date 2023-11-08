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
import AsyncStorage from '@react-native-async-storage/async-storage'

const PrintOutScreen = ({ navigation, route }) => {
	const { width, height } = useWindowDimensions()
	const auth = useSelector((state) => state.auth.authData)
	const [printers, setPrinters] = useState([])
	const [currentPrinter, setCurrentPrinter] = useState(null) // Initialize as null
	const [isPrinterConnected, setIsPrinterConnected] = useState(false) // Add state for connection status

	const isDarkMode = useColorScheme() === 'dark'

	const [data, setData] = useState(null)
	const [selectedPrinter, setSelectedPrinter] = useState(null)

	const [count, setCount] = useState(1)

	const [configData, setConfigData] = useState(null)

	const logoUri = 'data:image/png;base64,' + imageUri.data

	const currentDate = new Date()

	const day = currentDate.getDate()
	const monthIndex = currentDate.getMonth()
	const year = currentDate.getFullYear()
	const hour = currentDate.getHours()
	const minute = currentDate.getMinutes()
	const ampm = hour >= 12 ? 'PM' : 'AM'

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]

	const formattedHour = hour % 12 === 0 ? 12 : hour % 12 // Convert hour to 12-hour format
	const formattedMinute = minute.toString().padStart(2, '0') // Ensure minute has two digits

	const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`

	const { getName, allData, inputAmounts, refNo, total, dataToPrint } =
		route.params

	useEffect(() => {
		retrieveData()

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

	// console.log('configData: ', configData)
	const paymentType = dataToPrint.COCI.map((item) => item.TYPE)
	console.log('paymentType: ', paymentType)

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

	const retrieveData = async () => {
		try {
			const value = await AsyncStorage.getItem('print_config')
			if (value !== null) {
				// We have data!!
				setConfigData(JSON.parse(value))
			}
		} catch (error) {
			// Error retrieving data
			console.log(error)
		}
	}

	const totalAmount = total.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	let rowIndex = 0
	const renderedItem = allData.collections.map((collection, index) => {
		const matchingInputAmount = inputAmounts[collection.ID]

		if (matchingInputAmount) {
			const { AMOUNT } = matchingInputAmount

			if (AMOUNT) {
				let getAMNT = parseFloat(AMOUNT).toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})

				rowIndex = index + 1

				let aa = ''
				// if (collection.SLDESCR.length === 7) {
				// 	name = `${collection.SLDESCR}      ${collection.REF_TARGET}`
				// } else if (collection.SLDESCR.length === 10) {
				// 	name = `${collection.SLDESCR}   ${collection.REF_TARGET}`
				// } else if (collection.SLDESCR.length === 12) {
				// 	name = `${collection.SLDESCR} ${collection.REF_TARGET}`
				// } else if (collection.SLDESCR.length === 14) {
				// 	name = `${collection.SLDESCR}${collection.REF_TARGET}`
				// } else if (collection.SLDESCR.length === 15) {
				// 	name = `${collection.SLDESCR}${collection.REF_TARGET}`
				// } else {
				// 	name = `${collection.SLDESCR}    ${collection.REF_TARGET}`
				// }

				if (getAMNT.length === 4) {
					aa = `${collection.REF_TARGET}           ${getAMNT}`
				} else if (getAMNT.length === 5) {
					aa = `${collection.REF_TARGET}          ${getAMNT}`
				} else if (getAMNT.length === 6) {
					aa = `${collection.REF_TARGET}         ${getAMNT}`
				} else if (getAMNT.length === 7) {
					aa = `${collection.REF_TARGET}        ${getAMNT}`
				} else if (getAMNT.length === 8) {
					aa = `${collection.REF_TARGET}       ${getAMNT}`
				} else if (getAMNT.length === 9) {
					aa = `${collection.REF_TARGET}      ${getAMNT}`
				} else if (getAMNT.length === 10) {
					aa = `${collection.REF_TARGET}     ${getAMNT}`
				} else if (getAMNT.length === 11) {
					aa = `${collection.REF_TARGET}    ${getAMNT}`
				} else if (getAMNT.length === 12) {
					aa = `${collection.REF_TARGET}   ${getAMNT}`
				} else if (getAMNT.length === 13) {
					aa = `${collection.REF_TARGET}  ${getAMNT}`
				}

				// let amount = ''
				// if (getAMNT.length === 3) {
				// 	amount = `                             ${getAMNT}`
				// } else if (getAMNT.length === 4) {
				// 	amount = `                            ${getAMNT}`
				// } else if (getAMNT.length === 5) {
				// 	amount = `                           ${getAMNT}`
				// } else if (getAMNT.length === 6) {
				// 	amount = `                         ${getAMNT}`
				// } else if (getAMNT.length === 7) {
				// 	amount = `                        ${getAMNT}`
				// } else if (getAMNT.length === 8) {
				// 	amount = `                       ${getAMNT}`
				// } else if (getAMNT.length === 9) {
				// 	amount = `                      ${getAMNT}`
				// } else if (getAMNT.length === 10) {
				// 	amount = `                     ${getAMNT}`
				// } else if (getAMNT.length === 11) {
				// 	amount = `                    ${getAMNT}`
				// } else if (getAMNT.length === 12) {
				// 	amount = `                   ${getAMNT}`
				// } else if (getAMNT.length === 13) {
				// 	amount = `                  ${getAMNT}`
				// }

				return `${aa}\n${collection.SLDESCR}\n\n`
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
		let finalAmount = ''
		if (totalAmount.length === 4) {
			finalAmount = `           ${totalAmount}`
		} else if (totalAmount.length === 5) {
			finalAmount = `          ${totalAmount}`
		} else if (totalAmount.length === 6) {
			finalAmount = `         ${totalAmount}`
		} else if (totalAmount.length === 8) {
			finalAmount = `       ${totalAmount}`
		} else if (totalAmount.length === 9) {
			finalAmount = `      ${totalAmount}`
		} else if (totalAmount.length === 10) {
			finalAmount = `     ${totalAmount}`
		} else if (totalAmount.length === 12) {
			finalAmount = `   ${totalAmount}`
		} else if (totalAmount.length === 13) {
			finalAmount = `  ${totalAmount}`
		} else if (totalAmount.length === 14) {
			finalAmount = ` ${totalAmount}`
		} else if (totalAmount.length === 15) {
			finalAmount = `${totalAmount}`
		}

		let reprentCount = ''
		let space = ''
		if (count > 1) {
			space = '\n\n'
			reprentCount = 'PRINT COPY #' + count
		}

		// Payment Type
		let payment_type = ''
		if (paymentType.length > 1) {
			payment_type = `      ${paymentType.join(', ')}`
		} else {
			payment_type = `            ${paymentType[0]}`
		}

		// Date
		let date = ''
		if (formattedDate.length === 20) {
			date = `        ${formattedDate}`
		} else {
			date = `       ${formattedDate}`
		}

		try {
			currentPrinter &&
				BLEPrinter.printBill(
					`<C>${configData && configData.Print_Header}</C>\n` +
						`<C>${configData && configData.COOP_Name}</C>\n` +
						`<C>${configData && configData.COOP_Address}</C>\n` +
						`<C>${configData && configData.COOP_TIN}</C>\n` +
						'<C>--------------------------------</C>\n' +
						`Client No.: ${allData.client_id}\n` +
						`Client Name: ${getName}\n` +
						'<C>--------------------------------</C>\n' +
						'Particulars          Amount Paid\n' +
						'<C>--------------------------------</C>\n' +
						`${renderedText}` +
						`Total Items: ${rowIndex}\n` +
						'<C>--------------------------------</C>\n' +
						`Type of Payment${payment_type}\n` +
						`Total Paid Amount${finalAmount}\n` +
						'<C>--------------------------------</C>\n' +
						`Reciept No.: ${refNo}\n` +
						`Date:${date}\n` +
						`Collected by ${
							auth && auth.data ? auth.data.collector_desc : '...'
						}\n` +
						'<C>--------------------------------</C>\n' +
						`<C>${configData && configData.Print_Footer}</C>${space}` +
						`<C>${reprentCount}</C>`
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
									{configData && configData.COOP_Name}
								</Text>
								<Text
									className='text-center text-xs font-bold'
									style={{ color: '#000' }}>
									{configData && configData.COOP_Address}
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
												Payment Type
											</Text>
										</View>
										<View>
											<Text
												className='text-sm'
												style={{
													flexShrink: 1,
													color: '#000',
												}}>
												{paymentType}
											</Text>
										</View>
									</View>
									<View
										style={{
											flexDirection: 'row',
											padding: 5,
											marginTop: -10,
										}}>
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
					onPressMain={() => {
						setCount(count + 1)
						printME()
					}}
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
