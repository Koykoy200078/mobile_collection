import {
	View,
	Text,
	useColorScheme,
	Platform,
	TouchableOpacity,
	useWindowDimensions,
} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
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
import databaseOptions, {
	Device,
	Header,
	Software,
} from '../../app/database/allSchemas'

const PrintOutScreen = ({ navigation, route }) => {
	const { width, height } = useWindowDimensions()
	const auth = useSelector((state) => state.auth.authData)
	const [printers, setPrinters] = useState([])
	const [currentPrinter, setCurrentPrinter] = useState(null) // Initialize as null
	const [isPrinterConnected, setIsPrinterConnected] = useState(false) // Add state for connection status

	const isDarkMode = useColorScheme() === 'dark'

	const [count, setCount] = useState(1)

	const [headerData, setHeaderData] = useState([])
	const [deviceData, setDeviceData] = useState([])
	const [softwareData, setSoftwareData] = useState([])

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

	const paymentType = dataToPrint.COCI.map((item) => item.TYPE)

	useEffect(() => {
		checkAndShowData()

		if (Platform.OS === 'android') {
			let model = DeviceInfo.getModel()

			if (isDeviceSupported(model)) {
				BLEPrinter.init().then(() => {
					BLEPrinter.getDeviceList().then((deviceList) => {
						setPrinters(deviceList)
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

	const checkAndShowData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const header = realm.objects(Header)
			const device = realm.objects(Device)
			const software = realm.objects(Software)

			if (header.length > 0) {
				setHeaderData(Array.from(header))
			}

			if (device.length > 0) {
				setDeviceData(Array.from(device))
			}

			if (software.length > 0) {
				setSoftwareData(Array.from(software))
			}
		} catch (error) {
			showError({
				message: 'Error',
				description: 'Something went wrong in retrieving data',
			})
			console.error(error)
		}
	}, [headerData, deviceData, softwareData])

	const _connectPrinter = (printer) => {
		BLEPrinter.connectPrinter(printer.inner_mac_address)
			.then(() => {
				setCurrentPrinter(printer)
				setIsPrinterConnected(true)
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
				const spaces = ' '.repeat(15 - getAMNT.length)

				const aa = `${collection.REF_TARGET}${spaces}${getAMNT}`

				return `${aa}\n${collection.SLDESCR}\n\n`
			}
		}
	})

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
			return null
		}
	})

	const maxWidth = 32
	const formatString = (label, value) => {
		const totalLength = label.length + value.length
		const spaces = ' '.repeat(maxWidth - totalLength)
		return `${label}${spaces}${value}`
	}

	const printME = async () => {
		const maxWidth = 32
		const formatString = (label, value) => {
			const totalLength = label.length + value.length
			// const spaces = ' '.repeat(maxWidth - totalLength)

			const spacesLength = maxWidth - totalLength
			const spaces = ' '.repeat(spacesLength > 0 ? spacesLength : 0)
			return `${label}${spaces}${value}`
		}

		let finalAmount = formatString('Total Paid Amount', totalAmount)
		let reprentCount = count > 1 ? `PRINT COPY #${count}` : ''
		let space = count > 1 ? '\n\n' : ''
		let payment_type = formatString('Type of Payment', paymentType.join(', '))
		let refNoFormatted = formatString('Reciept No.', refNo)
		let date = formatString('Date', formattedDate)
		let collectedBy = formatString(
			'Collected by',
			auth && auth.data ? auth.data.collector_username : '...'
		)

		const getSoftware =
			softwareData && softwareData.map((data) => data.Software)
		const getVersion = softwareData && softwareData.map((data) => data.Version)
		const getProvider =
			softwareData && softwareData.map((data) => data.Provider)
		const getAddress = softwareData && softwareData.map((data) => data.Address)
		const getTIN = softwareData && softwareData.map((data) => data.TIN)
		const getAccNo = softwareData && softwareData.map((data) => data.Acc_No)

		// Software
		let softwareName = formatString('Software', `${getSoftware.join(',')}`)
		let softwareVersion = formatString('Version', `${getVersion.join(',')}`)
		let softwareProvider = formatString('Provider', `${getProvider.join(',')}`)
		let softwareAddress = formatString('Address', `${getAddress.join(',')}`)
		let softwareTIN = formatString('TIN#', `${getTIN.join(',')}`)
		let softwareAcc_No = formatString('Acc_No', `${getAccNo.join(',')}`)

		const devID = deviceData && deviceData.map((data) => data.Machine_ID_No)
		const sn = deviceData && deviceData.map((data) => data.Serial_No)
		const date_issued =
			deviceData && deviceData.map((data) => data.Permit_to_Use_Date_Issued)
		// Device
		let deviceID = formatString('Machine ID', `${devID.join(',')}`)
		let serialNo = formatString('S/N', `${sn.join(',')}`)
		let dateIssued = formatString('Date Issued', `${date_issued.join(',')}`)

		try {
			currentPrinter &&
				BLEPrinter.printBill(
					`<C>Collection Reciept</C>\n\n` +
						`<C>${
							headerData && headerData.map((data) => data.ClientName)
						}</C>\n` +
						`<C>${headerData && headerData.map((data) => data.Address)}</C>\n` +
						`<C>CDA_REG_NO.# ${
							headerData && headerData.map((data) => data['CDA_REG_NO.'])
						}</C>\n` +
						`<C>TIN# ${
							headerData && headerData.map((data) => data.TIN)
						}</C>\n` +
						'<C>--------------------------------</C>\n' +
						`Client No.: ${allData.client_id}\n` +
						`Client Name: ${getName}\n` +
						'<C>--------------------------------</C>\n' +
						'Particulars          Amount Paid\n' +
						'<C>--------------------------------</C>\n' +
						`${renderedText}` +
						`Total Items: ${rowIndex}\n` +
						'<C>--------------------------------</C>\n' +
						`${payment_type}\n` +
						`${finalAmount}\n` +
						'<C>--------------------------------</C>\n' +
						`${refNoFormatted}\n` +
						`${date}\n` +
						`${collectedBy}\n` +
						'<C>--------------------------------</C>\n' +
						'<C>Software Information</C>\n' +
						'<C>--------------------------------</C>\n' +
						`${softwareName}\n` +
						`${softwareVersion}\n` +
						`${softwareProvider}\n` +
						`${softwareAddress}\n` +
						`${softwareTIN}\n` +
						`${softwareAcc_No}\n` +
						'<C>--------------------------------</C>\n' +
						'<C>Device Information</C>\n' +
						'<C>--------------------------------</C>\n' +
						`${deviceID}\n` +
						`${serialNo}\n` +
						`${dateIssued}\n` +
						'<C>--------------------------------</C>\n' +
						`<C>Thank you for using our service!</C>${space}` +
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
						<View className='space-y-2'>
							<View className='items-center justify-center'>
								<Text
									className='text-center text-2xl font-extrabold'
									style={{ color: '#000' }}>
									{headerData && headerData.map((data) => data.ClientName)}
								</Text>
								<Text
									className='text-center text-base font-light'
									style={{ color: '#000' }}>
									{headerData && headerData.map((data) => data.Address)}
								</Text>
								<Text className='text-xs font-light' style={{ color: '#000' }}>
									CDA_REG_NO.#{' '}
									{headerData && headerData.map((data) => data['CDA_REG_NO.'])}
								</Text>
								<Text className='text-xs font-light' style={{ color: '#000' }}>
									TIN# {headerData && headerData.map((data) => data.TIN)}
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
												{auth && auth.data
													? auth.data.collector_username
													: '...'}
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
