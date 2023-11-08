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
import { showError, showInfo } from '../../app/components/AlertMessage'
import { Realm } from '@realm/react'
import { resetLogin } from '../../app/reducers/auth'
import NetInfo from '@react-native-community/netinfo'
import DeviceInfo, {
	getSystemVersion,
	getUniqueId,
	getVersion,
} from 'react-native-device-info'

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

	const [isConnected, setIsConnected] = useState(false)
	const [ConnectionType, setConnectionType] = useState(null)

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

	const allPaid = clientData.every((item) => item.isPaid === true)

	useEffect(() => {
		checkAndShowData()
	}, [isSuccess, isLoading, loading, isConnected, ConnectionType])

	useEffect(() => {
		const fetchDataAndScheduleUpdate = async () => {
			try {
				await checkAndShowData()
			} catch (error) {
				console.error('Error fetching and updating data: ', error)
			}
		}

		const checkConnection = async () => {
			const state = await NetInfo.fetch()
			setIsConnected(state.isConnected)
			setConnectionType(state.type)
		}

		fetchDataAndScheduleUpdate()
		checkConnection()

		const updateInterval = setInterval(() => {
			fetchDataAndScheduleUpdate()
			checkConnection()
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
		let trans_date =
			clientData &&
			clientData.flatMap((item) =>
				item.collections.map((data) => data.trans_datetime.split(' ')[0])
			)

		if (trans_date) {
			if (getUpload.length > 0) {
				dispatch(
					uploadData({
						service: 'collection',
						collectorid: auth && auth.data.collector,
						branchid: auth && auth.data.branchid,
						trans_date: trans_date[0],
						data: getUpload,
					})
				)
			} else {
				showInfo({
					message: 'No data',
					description: 'No data to be uploaded',
				})
			}
		} else {
			showError({
				message: 'Error Uploading',
				description: 'Transaction date not found.',
			})
		}
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

	const deviceId = getUniqueId()
	const appVersion = getVersion()

	return (
		<View style={{ flex: 1, width: width, height: height }}>
			<View
				style={{ padding: 5, alignItems: 'center', justifyContent: 'center' }}>
				<Text title1>Account</Text>

				<View className='flex-row items-center justify-center space-x-12 mt-4'>
					<TouchableOpacity
						onPress={() => {
							if (allPaid === false) {
								showError({
									message: 'Download Unsuccessful',
									description:
										'Unable to download new data as there are pending collections yet to be gathered.',
								})
							} else {
								fetchData()
							}
						}}>
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
							if (
								(isConnected && ConnectionType === 'wifi') ||
								ConnectionType === 'cellular'
							) {
								Alert.alert('Upload', 'Are you sure you want to upload data?', [
									{
										text: 'NO',
										onPress: () =>
											Alert.alert('Cancelled', 'Data not uploaded'),
										style: 'cancel',
									},
									{
										text: 'YES',
										onPress: () => uploadME(),
									},
								])
							} else {
								showError({
									message: 'Data Upload Failed',
									description:
										'Network connection is unavailable. Please check your internet settings and try again.',
								})
							}
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

			<View
				style={{ padding: 15, marginLeft: 8, marginRight: 8, marginTop: -10 }}>
				<Project02
					title='Payment Overview'
					description='Summary of various payment methods available.'
					isTotal={true}
					total_loans={countPaidItems}
					onPress={() => navigation.navigate(ROUTES.PAYMENT_SUMMARY)}
					style={{ marginBottom: 10 }}
				/>

				<Project02
					title="Client's Detailed Report"
					description='Comprehensive collection report for each client.'
					isTotal={true}
					total_loans={countHistoryItems}
					onPress={() => navigation.navigate(ROUTES.DETAILED_SUMMARY)}
				/>

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

				<Project02
					title='Print Configuration'
					description='Manage and customize your printing preferences and settings.'
					// total_loans={countHistoryItems}
					onPress={() => navigation.navigate(ROUTES.PRINTCONFIG)}
					style={{ marginBottom: 10 }}
				/>

				<Project02
					title={`App Version - v${appVersion}`}
					description={`Machine ID Number: ${deviceId._j}`}
					description2={`Serial Number: `}
					des2={true}
					// total_loans={countHistoryItems}
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
