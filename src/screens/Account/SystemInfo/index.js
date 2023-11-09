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
import { showInfo } from '../../../app/components/AlertMessage'
import DeviceInfo, {
	getBuildId,
	getInstallerPackageName,
	getModel,
	getSerialNumber,
	getSystemVersion,
	getUniqueId,
	getVersion,
} from 'react-native-device-info'
import { isDeviceSupported } from '../../../app/config/DeviceSupport'
import { BLEPrinter } from 'react-native-thermal-receipt-printer'
import { useSelector } from 'react-redux'

const SystemInfo = () => {
	const { width, height } = useWindowDimensions()
	const isDarkMode = useColorScheme() === 'dark'

	const auth = useSelector((state) => state.auth.authData)

	const [getMachineID, setMachineID] = useState(null)
	const [getSN, setSN] = useState(null)
	const [getDatePTU, setDatePTU] = useState(null)

	const [configData, setConfigData] = useState(null)

	let deviceId = getUniqueId()
	let deviceSerialNum = getSerialNumber()
	let appVersion = getVersion()
	let model = getModel()
	let modelVersion = getSystemVersion()
	let modelBuildId = getBuildId()

	useEffect(() => {
		retrieveData()

		const updateInterval = setInterval(() => {
			retrieveData()
		}, 1000)

		return () => {
			clearInterval(updateInterval) // Clean up the interval when the component unmounts
		}
	}, [getMachineID, getSN, getDatePTU])

	const saveData = async () => {
		try {
			const data = {
				MachineID: getMachineID ? getMachineID : deviceId._j,
				SN: getSN ? getSN : deviceSerialNum._j,
				DatePTU: getDatePTU,
				AppVersion: appVersion,
				ModelName: model,
				ModelBuildID: modelBuildId._j,
			}

			await AsyncStorage.setItem('device_config', JSON.stringify(data))
			showInfo({
				message: 'Configuration Saved',
				description: 'Your machine configuration has been successfully saved.',
			})
		} catch (error) {
			// Error saving data
			console.log(error)
		}
	}

	const retrieveData = async () => {
		try {
			const value = await AsyncStorage.getItem('device_config')
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
					height: height - 160,
					// marginHorizontal: 10,
					padding: 10,
					borderRadius: 10,
				}}>
				<View className='mb-2 items-center justify-center'>
					<Text title2>MACHINE CONFIGURATION</Text>
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
						<Text>Device ID</Text>
						<TextInput
							placeholder={deviceId ? deviceId._j : 'Enter Device ID'}
							value={getMachineID}
							onChangeText={(val) => setMachineID(val)}
						/>
						<Text>Serial Number</Text>
						<TextInput
							placeholder={
								deviceSerialNum ? deviceSerialNum._j : 'Enter Device S/N'
							}
							value={getSN}
							onChangeText={(val) => setSN(val)}
						/>
						<Text>Date issue PTU (Permit To Use)</Text>
						<TextInput
							placeholder={getDatePTU ? getDatePTU : 'Enter date issue'}
							value={getDatePTU}
							onChangeText={(val) => setDatePTU(val)}
						/>

						<View className='mb-2'>
							<Text body2 bold>
								Software Details
							</Text>
							<View className='ml-2'>
								<View className='flex-row items-start justify-between'>
									<Text className='font-bold'>• App Version</Text>
									<Text className='font-bold'>v{appVersion}</Text>
								</View>
								<View className='flex-row items-start justify-between'>
									<Text className='font-bold'>• Model Name</Text>
									<Text className='font-bold'>{model}</Text>
								</View>
								<View className='flex-row items-start justify-between'>
									<Text className='font-bold'>• Android Version</Text>
									<Text className='font-bold'>{modelVersion}</Text>
								</View>
								<View className='flex-row items-start justify-between'>
									<Text className='font-bold'>• Android Build ID</Text>
									<Text className='font-bold'>{modelBuildId._j}</Text>
								</View>
								<View className='flex-row items-start justify-between'>
									<Text className='font-bold'>• Device ID</Text>
									<Text className='font-bold'>{deviceId._j}</Text>
								</View>
							</View>
						</View>
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
			</View>
		</View>
	)
}

export default SystemInfo
