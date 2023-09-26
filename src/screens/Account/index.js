import React, { useEffect, useState, useCallback } from 'react'
import {
	View,
	useWindowDimensions,
	Alert,
	useColorScheme,
	ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { ROUTES } from '../../app/config'
import { Project02, Text } from '../../app/components'
import databaseOptions, {
	Client,
	Collection,
	CollectionReport,
	UploadData,
	UploadDataCollection,
	totalAmountUpload,
} from '../../app/database/allSchemas'
import { Icons } from '../../app/config/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { getDetails, resetGetDetails } from '../../app/reducers/batchDetails'
import { resetUploadData, uploadData } from '../../app/reducers/upload'
import { showInfo } from '../../app/components/AlertMessage'
import { Realm } from '@realm/react'
import { resetLogin } from '../../app/reducers/auth'

const Account = ({ navigation }) => {
	const realm = new Realm(databaseOptions)
	const isDarkMode = useColorScheme() === 'dark'
	const auth = useSelector((state) => state.auth.authData)
	const loading = useSelector((state) => state.auth.isLoading)
	const { isSuccess, isLoading } = useSelector((state) => state.upload)
	const dispatch = useDispatch()

	const { width, height } = useWindowDimensions()
	const [clientData, setClientData] = useState([])

	const [getUpload, setGetUpload] = useState([])
	const [getAmountDB, setAmountDB] = useState([])
	const [getHistory, setHistory] = useState([])

	const countPaidItems = getUpload && getUpload.filter((item) => item).length
	const countHistoryItems =
		getHistory && getHistory.filter((item) => item).length
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
	}, [isSuccess, isLoading, loading])

	useEffect(() => {
		const fetchDataAndScheduleUpdate = async () => {
			try {
				await checkAndShowData()
			} catch (error) {
				console.error('Error fetching and updating data: ', error)
			}
		}

		fetchDataAndScheduleUpdate() // Initial fetch

		const updateInterval = setInterval(() => {
			fetchDataAndScheduleUpdate() // Fetch and update every 60 seconds (adjust as needed)
		}, 1000)

		return () => {
			clearInterval(updateInterval) // Clean up the interval when the component unmounts
		}
	}, [])

	useFocusEffect(
		useCallback(() => {
			checkAndShowData()
			return () => {}
		}, [])
	)

	const calculateCollectedSum = () => {
		if (getUpload && getUpload.length > 0) {
			return getUpload.reduce((acc, item) => {
				return (
					acc +
					item.collections.reduce((collectedAcc, collection) => {
						return collectedAcc + parseFloat(collection.ACTUAL_PAY)
					}, 0)
				)
			}, 0)
		}
		return 0 // Default to 0 if there is no data
	}

	const deleteData = useCallback(async () => {
		try {
			const schemaNamesToDelete = [
				Client,
				Collection,
				UploadData,
				UploadDataCollection,
				CollectionReport,
				totalAmountUpload,
			]

			const realm = await Realm.open(databaseOptions) // Open the Realm database

			realm.write(() => {
				for (const schemaName of schemaNamesToDelete) {
					const schema = realm.schema.find((s) => s.name === schemaName)
					if (schema) {
						realm.delete(realm.objects(schemaName))
					}
				}
			})

			// realm.close() // Close the Realm database

			dispatch(resetLogin())
			dispatch(resetGetDetails())
			dispatch(resetUploadData())
			setAmountDB([])

			console.log('Data deleted successfully')
		} catch (error) {
			console.error(error)
		}
	}, [])

	const deleteUpload = useCallback(async () => {
		try {
			if (realm.schema.find((s) => s.name === UploadData)) {
				realm.write(() => {
					const collectionSchema = realm.objects(UploadData)
					const collections = realm.objects(UploadDataCollection)
					realm.delete(collectionSchema)
					realm.delete(collections)
				})
				dispatch(resetUploadData())
				setAmountDB([])
			}
		} catch (error) {
			console.error(error)
		}
	}, [])

	const saveAmount = useCallback(async (newTotal) => {
		try {
			if (realm.schema.find((s) => s.name === totalAmountUpload)) {
				realm.write(() => {
					const existingTotal = realm.objects(totalAmountUpload)[0]
					if (existingTotal) {
						existingTotal.amount = newTotal.toString()
					} else {
						realm.create(totalAmountUpload, { amount: newTotal })
					}
				})

				deleteUpload()
			}
		} catch (error) {
			console.error(error)
		}
	}, [])

	const checkAndShowData = useCallback(async () => {
		try {
			const clients = realm.objects(Client)
			const uploadData = realm.objects(UploadData)
			const historyData = realm.objects(CollectionReport)
			let saveAmountArray = Array.from(realm.objects(totalAmountUpload))

			// Check if any data is available in any of the tables
			if (clients.length > 0) {
				setClientData(Array.from(clients))
			}

			if (uploadData.length > 0) {
				setGetUpload(Array.from(uploadData))
			} else {
				setGetUpload(0)
			}

			if (historyData.length > 0) {
				setHistory(Array.from(historyData))
			} else {
				setHistory(0)
			}

			// Check if totalAmountUpload is empty and add a default value if it is
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
	}, [getAmountDB])

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
						if (auth && auth.data) {
							dispatch(
								getDetails({
									branchid: auth.data.branchid,
									collectorid: auth.data.collector,
								})
							)
						}
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

	// Calculate the collected sum and update the database sum when the component mounts
	useEffect(() => {
		try {
			if (isSuccess) {
				const collectedSum = calculateCollectedSum()
				let AMNT = getAmountDB && getAmountDB[0] && getAmountDB[0].amount
				const totalSum = parseFloat(collectedSum) + parseFloat(AMNT)
				saveAmount(totalSum)
			}
		} catch (error) {
			console.error(error)
		}
	}, [getUpload])

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
			{isLoading ? (
				<View className='items-center justify-center space-y-2'>
					<Text className='font-bold'>Data uploading to the server</Text>
					<ActivityIndicator animating={true} size='large' color='#0000ff' />
				</View>
			) : null}

			{loading ? (
				<View className='items-center justify-center space-y-2'>
					<Text className='font-bold'>Downloading data</Text>
					<ActivityIndicator animating={true} size='large' color='#0000ff' />
				</View>
			) : null}

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
					total_loans={countHistoryItems}
					onPress={() => navigation.navigate(ROUTES.DETAILED_SUMMARY)}
					style={{ marginBottom: 10 }}
				/>
			</View>

			<View style={{ width: width }}>
				<TouchableOpacity
					onPress={() => {
						deleteData()
					}}>
					<View className='items-center justify-center'>
						<Text className='text-sm font-bold'>LOGOUT</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Account
