import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	useWindowDimensions,
} from 'react-native'
import { BaseStyle, ROUTES, useTheme } from '../../app/config'
import { Project02, Search } from '../../app/components'
import { Icons } from '../../app/config/icons'
import styles from './styles'
import { Realm } from '@realm/react'
import databaseOptions, {
	Client,
	Device,
	Header,
	Software,
} from '../../app/database/allSchemas'
import { getDetails, resetGetDetails } from '../../app/reducers/batchDetails'
import { useDispatch, useSelector } from 'react-redux'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect } from '@react-navigation/native'

import { FloatingAction } from 'react-native-floating-action'
import { showError, showInfo } from '../../app/components/AlertMessage'

const ClientCollection = ({ navigation }) => {
	const auth = useSelector((state) => state.auth.authData)
	const realm = new Realm(databaseOptions)
	const { colors } = useTheme()
	const [search, setSearch] = useState('')
	const [filteredClients, setFilteredClients] = useState([])

	const [showAll, setShowAll] = useState(false)

	const [floatingActionVisible, setFloatingActionVisible] = useState(true)

	const batchData = useSelector((state) => state.batchDetails.data)
	const { isLoading, isSuccess } = useSelector((state) => state.batchDetails)
	const dispatch = useDispatch()

	const [clientData, setClientData] = useState([])

	useFocusEffect(
		useCallback(() => {
			showData()
		}, [])
	)

	useEffect(() => {
		showData()
	}, [batchData, search, filteredClients, showAll, isLoading])

	useEffect(() => {
		if (isSuccess) {
			saveData()
		}
	}, [isSuccess, search])

	const filterData = clientData.filter((client) => {
		const totalDue = client.collections.reduce(
			(acc, data) => acc + parseFloat(data.TOTALDUE),
			0
		)
		return totalDue !== 0
	})

	const memoizedFilterData = useMemo(() => {
		return clientData.filter((client) => {
			const totalDue = client.collections.reduce(
				(acc, data) => acc + parseFloat(data.TOTALDUE),
				0
			)
			return totalDue !== 0
		})
	}, [clientData])

	const toggleShowAll = () => {
		setShowAll(!showAll)
	}

	const dataToShow = useMemo(
		() => (showAll ? clientData : memoizedFilterData),
		[showAll, memoizedFilterData]
	)

	const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

	const isDataOld = (dataDate) => {
		const currentDate = new Date()
		const tomorrow = new Date(currentDate.getTime() + ONE_DAY_IN_MILLISECONDS)

		return new Date(dataDate) < tomorrow
	}

	const checkDataAgeAndShowAlert = (dataToShow, showInfo) => {
		const currentDate = new Date()
		const currentDateString = currentDate.toISOString().split('T')[0] // Get only the date part

		for (const data of dataToShow) {
			for (const item of data.collections) {
				const itemDate = item.trans_datetime.split(' ')[0]

				if (isDataOld(itemDate)) {
					if (itemDate !== currentDateString) {
						// Check if the data date is not the same as today
						// Show an alert if the data is old
						showInfo({
							message: 'Data is old!',
							description: `Data downloaded is from ${itemDate}. Download today's data.`,
						})
						return
					}
				}
			}
		}
	}

	useEffect(() => {
		checkDataAgeAndShowAlert(dataToShow, showInfo)
	}, [dataToShow])

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
									collectorid: auth.data.collectorid,
								})
							)
						}
					},
				},
			]
		)
	}, [dispatch])

	const saveData = useCallback(async () => {
		const handleSave = async () => {
			try {
				const writeData = (Model, data) => {
					realm.write(() => {
						realm.create(Model, data, Realm.UpdateMode.Modified)
					})
				}

				batchData.data.forEach((client) => {
					const collections = client.collections.map((collection) => ({
						...collection,
						id: `${client.client_id}-${collection.ID}`,
					}))

					const clientData = {
						branch_id: client.branch_id,
						client_id: client.client_id,
						FName: client.FName,
						LName: client.LName,
						MName: client.MName,
						SName: client.SName,
						collector: client.collector,
						collections,
					}

					writeData(Client, clientData)
				})

				writeData(Header, batchData.header)
				writeData(Device, batchData.device)
				writeData(Software, batchData.software)

				showInfo({
					message: 'Operation Successful',
					description: 'Your data has been saved successfully.',
				})
				dispatch(resetGetDetails())

				showData()
			} catch (error) {
				showError({
					message: 'Error: Data Save Failed',
					description:
						'There was an issue while attempting to save the data. An error occurred in the API.',
				})
				console.error(error)
			}
		}

		Alert.alert('Saving Data', 'Are you sure you want to save the data?', [
			{
				text: 'NO',
				onPress: () => Alert.alert('Cancelled', 'Data not saved'),
				style: 'cancel',
			},
			{
				text: 'YES',
				onPress: handleSave,
			},
		])
	}, [batchData, showData])

	// const showData = useCallback(async () => {
	// 	try {
	// 		const clients = realm.objects(Client)
	// 		setClientData(Array.from(clients))
	// 	} catch (error) {
	// 		Alert.alert('Error retrieving data', error)
	// 		console.error(error)
	// 	}
	// }, [search])

	const showData = useCallback(async () => {
		try {
			const clients = realm.objects(Client)
			if (clients.length) {
				setClientData(Array.from(clients))
			}
		} catch (error) {
			Alert.alert('Error retrieving data', error.message)
			console.error(error)
		}
	}, [search])

	const handleSearch = useCallback(
		(query) => {
			const normalizedQuery = query.toLowerCase()
			const data = dataToShow.filter((client) => {
				const lnameMatch =
					client.LName && client.LName.toLowerCase().includes(normalizedQuery)
				const fnameMatch =
					client.FName && client.FName.toLowerCase().includes(normalizedQuery)
				const mnameMatch =
					client.MName && client.MName.toLowerCase().includes(normalizedQuery)
				const snameMatch =
					client.SName && client.SName.toLowerCase().includes(normalizedQuery)

				// Return true if any of the properties match the query
				return lnameMatch || fnameMatch || mnameMatch || snameMatch
			})

			setFilteredClients(data)
		},
		[filterData, dataToShow, search]
	)

	const clearSearch = () => {
		setSearch('')
		setFilteredClients([])
	}

	const handleScrollBeginDrag = () => {
		setFloatingActionVisible(false)
	}

	const handleScrollEndDrag = () => {
		setFloatingActionVisible(true)
	}

	const renderContent = useCallback(() => {
		return (
			<View style={{ flex: 1 }}>
				<Search
					title={'Client Collection'}
					// onPress={fetchData}
					// isDownload={true}
					value={search}
					onChangeText={(val) => {
						setSearch(val)
						handleSearch(val)
					}}
					clearStatus={true ? clearSearch : false}
				/>

				<View className='mt-1' />

				<FlashList
					contentContainerStyle={styles.paddingFlatList}
					estimatedItemSize={360}
					data={filteredClients.length > 0 ? filteredClients : dataToShow}
					keyExtractor={(_, index) => index.toString()}
					onScrollBeginDrag={handleScrollBeginDrag}
					onScrollEndDrag={handleScrollEndDrag}
					renderItem={({ item }) => {
						const {
							branch_id,
							client_id,
							FName,
							LName,
							MName,
							SName,
							isPaid,
							collections,
						} = item

						const Fullname = [
							LName.trim() ? `${LName},` : '',
							FName.trim() ? FName : '',
							MName,
							SName,
						]
							.filter(Boolean)
							.join(' ')

						const totalDue = collections.reduce(
							(acc, data) => acc + parseFloat(data.TOTALDUE),
							0
						)

						const formatNumber = (number) => {
							return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						}

						const handlePress = (item) => {
							if (item.collections.length === 0) {
								Alert.alert('Info', 'This client has no collection data')
							} else {
								navigation.navigate(ROUTES.VIEW, { item: item })
							}
						}

						return (
							<Project02
								title={Fullname}
								description={client_id.toString()}
								isPaid={isPaid}
								total_loans={formatNumber(totalDue.toFixed(2))}
								onPress={() => handlePress(item)}
								style={{
									marginBottom: 10,
								}}
							/>
						)
					}}
					ListEmptyComponent={
						<View className='flex-1 items-center justify-center'>
							{isLoading ? (
								<View className='flex-1 items-center justify-center space-y-2'>
									<ActivityIndicator size='large' color={colors.primary} />
									<Text className='text-black dark:text-white font-bold'>
										Downloading data...
									</Text>
								</View>
							) : (
								<View className='items-center justify-center space-y-2'>
									<Text className='text-black dark:text-white font-bold'>
										No data found.
									</Text>

									<TouchableOpacity onPress={fetchData}>
										<View className='p-2 rounded-md border'>
											<Text className='text-black dark:text-white font-bold'>
												Download data
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							)}
						</View>
					}
				/>
			</View>
		)
	}, [clientData])

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView
				style={BaseStyle.safeAreaView}
				edges={['right', 'top', 'left']}>
				{renderContent()}

				{floatingActionVisible && clientData.length > 0 && (
					<TouchableOpacity onPress={toggleShowAll}>
						<FloatingAction
							showBackground={false}
							floatingIcon={
								showAll ? (
									<Icons.Octicons name='eye' size={20} color='#FFFFFF' />
								) : (
									<Icons.Octicons name='eye-closed' size={20} color='#FFFFFF' />
								)
							}
							onPressMain={() => toggleShowAll()}
						/>
					</TouchableOpacity>
				)}
			</SafeAreaView>
		</View>
	)
}

export default ClientCollection
