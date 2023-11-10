import React, { useState, useEffect } from 'react'
import {
	Platform,
	View,
	useColorScheme,
	useWindowDimensions,
} from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { Text, TextInput } from '../../../app/components'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { showError, showInfo } from '../../../app/components/AlertMessage'
import DeviceInfo from 'react-native-device-info'
import { isDeviceSupported } from '../../../app/config/DeviceSupport'
import { BLEPrinter } from 'react-native-thermal-receipt-printer'
import { useSelector } from 'react-redux'

const PrintConfiguration = () => {
	const { width, height } = useWindowDimensions()
	const isDarkMode = useColorScheme() === 'dark'

	const auth = useSelector((state) => state.auth.authData)

	const [getCOOPName, setCOOPName] = useState('')
	const [getAddress, setAddress] = useState('')
	const [getTIN, setTIN] = useState('')
	const [getHeader, setHeader] = useState('')
	const [getFooter, setFooter] = useState('')

	const [configData, setConfigData] = useState(null)

	const [currentPrinter, setCurrentPrinter] = useState(null) // Initialize as null
	const [isPrinterConnected, setIsPrinterConnected] = useState(false) // Add state for connection status

	useEffect(() => {
		retrieveData()

		const checkDevice = () => {
			if (Platform.OS === 'android') {
				let model = DeviceInfo.getModel()

				if (isDeviceSupported(model)) {
					BLEPrinter.init().then(() => {
						BLEPrinter.getDeviceList().then((deviceList) => {
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
		}

		const updateInterval = setInterval(() => {
			checkDevice()
		}, 1000)

		return () => {
			clearInterval(updateInterval) // Clean up the interval when the component unmounts
		}
	}, [getCOOPName, getAddress, getTIN, getHeader, getFooter])

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

	const printME = async () => {
		try {
			currentPrinter &&
				BLEPrinter.printBill(
					`<C>${configData && configData.Print_Header}</C>\n` +
						`<C>${configData && configData.COOP_Name}</C>\n` +
						`<C>${configData && configData.COOP_Address}</C>\n` +
						`<C>${configData && configData.COOP_TIN}</C>\n` +
						'<C>--------------------------------</C>\n' +
						`Client No.: ...\n` +
						`Client Name: ...\n` +
						'<C>--------------------------------</C>\n' +
						`...\n` +
						'<C>--------------------------------</C>\n' +
						`Type of Payment       CASH,CHECK\n` +
						`Total Paid Amount         100.00\n` +
						'<C>--------------------------------</C>\n' +
						`Reciept No.:   00000000000000000\n` +
						`Date:       Jan 1, 2000 07:23 PM\n` +
						`Collected by ${
							auth && auth.data ? auth.data.collector_desc : '...'
						}\n` +
						'<C>--------------------------------</C>\n' +
						`<C>${configData && configData.Print_Footer}</C>\n`
				)
		} catch (error) {
			console.error(error)
		}
	}

	const saveData = async () => {
		try {
			const data = {
				COOP_Name: getCOOPName,
				COOP_Address: getAddress,
				COOP_TIN: getTIN,
				Print_Header: getHeader,
				Print_Footer: getFooter,
			}

			await AsyncStorage.setItem('print_config', JSON.stringify(data))
			showInfo({
				message: 'Configuration Saved',
				description: 'Your print configuration has been successfully saved.',
			})
		} catch (error) {
			// Error saving data
			console.log(error)
		}
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

	return (
		<View
			className='flex-1 items-center justify-center'
			style={{ width: width }}>
			<Shadow
				distance={2}
				startColor={isDarkMode ? '#f1f1f1' : '#00000020'}
				style={{
					width: width - 45,
					height: height - 250,
					// marginHorizontal: 10,
					padding: 10,
					borderRadius: 10,
				}}>
				<View className='mb-2 items-center justify-center'>
					<Text title2>PRINT CONFIGURATION</Text>
				</View>

				<View
					style={{
						width: '100%',
						marginTop: 10,
						marginBottom: 5,
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

				<ScrollView showsVerticalScrollIndicator={false}>
					<View className='mb-2 space-y-2'>
						<View className='mb-2'>
							<Text body2 bold>
								Company Details
							</Text>
						</View>
						<TextInput
							placeholder={
								configData ? configData.COOP_Name : 'Enter COOP Name'
							}
							value={getCOOPName}
							onChangeText={(val) => setCOOPName(val)}
						/>
						<TextInput
							placeholder={
								configData ? configData.COOP_Address : 'Enter COOP Address'
							}
							value={getAddress}
							onChangeText={(val) => setAddress(val)}
						/>
						<TextInput
							placeholder={configData ? configData.COOP_TIN : 'Enter COOP TIN'}
							value={getTIN}
							onChangeText={(val) => setTIN(val)}
						/>
					</View>

					<View className='my-2 space-y-2'>
						<View>
							<Text body2 bold>
								Print Header
							</Text>
						</View>
						<TextInput
							placeholder={
								configData ? configData.Print_Header : 'Enter Header'
							}
							value={getHeader}
							onChangeText={(val) => setHeader(val)}
						/>
					</View>
					<View className='my-2 space-y-2'>
						<View>
							<Text body2 bold>
								Print Footer
							</Text>
						</View>
						<TextInput
							placeholder={
								configData ? configData.Print_Footer : 'Enter Footer'
							}
							value={getFooter}
							onChangeText={(val) => setFooter(val)}
						/>
					</View>
				</ScrollView>
			</Shadow>

			<View
				className='p-2 space-y-1'
				style={{
					width: width,
				}}>
				<TouchableOpacity onPress={() => saveData()}>
					<View className='border rounded-md p-2 items-center justify-center'>
						<Text title3 bold>
							Save
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => printME()}>
					<View className='border rounded-md p-2 items-center justify-center'>
						<Text title3 bold>
							Test Print
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default PrintConfiguration
