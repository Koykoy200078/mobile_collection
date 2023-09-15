import React, { useEffect, useState, useCallback } from 'react'
import { View, useWindowDimensions, Alert, useColorScheme } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { ROUTES } from '../../app/config'
import { Project02, Text } from '../../app/components'
import databaseOptions, {
	Client,
	UploadData,
} from '../../app/database/allSchemas'
import { Icons } from '../../app/config/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { getDetails } from '../../app/reducers/batchDetails'
import { uploadData } from '../../app/reducers/upload'
import { showInfo } from '../../app/components/AlertMessage'

const Account = ({ navigation }) => {
	const isDarkMode = useColorScheme() === 'dark'
	const auth = useSelector((state) => state.auth.authData)

	const { width, height } = useWindowDimensions()
	const [clientData, setClientData] = useState([])
	const countPaidItems = clientData.filter((item) => item.isPaid).length

	const [getUpload, setGetUpload] = useState([])

	const dispatch = useDispatch()

	function formatDateToYYYYMMDD(date) {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0') // Ensure two digits for month
		const day = String(date.getDate()).padStart(2, '0') // Ensure two digits for day
		return `${year}-${month}-${day}`
	}

	const currentDate = new Date()
	const formattedDate = formatDateToYYYYMMDD(currentDate)

	useEffect(() => {
		checkAndShowData()
	}, [])

	useFocusEffect(
		useCallback(() => {
			checkAndShowData()
			return () => {}
		}, [])
	)

	const checkAndShowData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const clients = realm.objects(Client)
			const uploadData = realm.objects(UploadData)

			const uploadDataArray = Array.from(uploadData)

			if (uploadDataArray.length > 0 || clients.length > 0) {
				if (uploadDataArray.length > 0) {
					setGetUpload(uploadDataArray)
				}

				if (clients.length > 0) {
					setClientData(Array.from(clients))
				}
			}
		} catch (error) {
			Alert.alert('Error retrieving data: ', error)
			console.error(error)
		}
	}, [])

	const fetchData = useCallback(async () => {
		Alert.alert(
			'Downloading Data',
			'Are you sure you want to download the data?',
			[
				{
					text: 'NO',
					onPress: () => Alert.alert('Cancelled', 'Data not downloaded'),
					style: 'cancel',
				},
				{
					text: 'YES',
					onPress: async () => {
						dispatch(
							getDetails({
								branchid: 0,
								collectorid: 1,
							})
						)
					},
				},
			]
		)
	}, [dispatch])

	const uploadME = () => {
		dispatch(
			uploadData({
				service: 'collection',
				collectorid: auth && auth.data.collector,
				branchid: auth && auth.data.branchid,
				trans_date: formattedDate,
				data: getUpload,
			})
		)
	}

	return (
		<View style={{ flex: 1, width, height }}>
			<View
				style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
				<Text title1>Account</Text>

				<View className='flex-row items-center justify-center space-x-12 my-4'>
					<TouchableOpacity onPress={fetchData}>
						<View className='items-center justify-center'>
							<Icons.Feather
								name='download-cloud'
								size={25}
								color={isDarkMode ? '#f1f1f1' : '#161924'}
							/>
							<Text className='text-sm font-bold'>Download Data</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						disabled={getUpload.length === 0}
						onPress={() => {
							Alert.alert('Upload', 'Are you sure you want to upload data?', [
								{
									text: 'NO',
									onPress: () => Alert.alert('Cancelled', 'Data not uploaded'),
									style: 'cancel',
								},
								{
									text: 'YES',
									onPress: () => uploadME(),
								},
							])
						}}>
						<View className='items-center justify-center'>
							<Icons.SimpleLineIcons
								name='cloud-upload'
								size={27}
								color={isDarkMode ? '#f1f1f1' : '#161924'}
							/>
							<Text className='text-sm font-bold'>Upload Data</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>

			<View style={{ padding: 32, marginLeft: 8, marginRight: 8 }}>
				<Project02
					title='Payments'
					description='Payment type summary'
					total_loans={countPaidItems}
					onPress={() => navigation.navigate(ROUTES.PAYMENT_SUMMARY)}
					style={{ marginBottom: 10 }}
				/>

				<Project02
					title="Client's Report"
					description='Detailed Collection Report'
					total_loans={countPaidItems}
					onPress={() => navigation.navigate(ROUTES.DETAILED_SUMMARY)}
					style={{ marginBottom: 10 }}
				/>
			</View>
		</View>
	)
}

export default Account
