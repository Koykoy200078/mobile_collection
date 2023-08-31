import React, { useState, useEffect, useCallback } from 'react'
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
	Alert,
	ActivityIndicator,
	useWindowDimensions,
	Animated,
} from 'react-native'
import { BaseStyle, ROUTES, useTheme } from '../../app/config'
import { Header, Project02, Search, TabTag } from '../../app/components'
import { Icons } from '../../app/config/icons'
import styles from './styles'
import { Realm } from '@realm/react'
import databaseOptions, { Client } from '../../app/database/allSchemas'
import { getDetails, resetGetDetails } from '../../app/reducers/batchDetails'
import { useDispatch, useSelector } from 'react-redux'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect } from '@react-navigation/native'

import { FloatingAction } from 'react-native-floating-action'

const ClientCollection = ({ navigation }) => {
	const { colors } = useTheme()
	const { width, height } = useWindowDimensions()
	const [search, setSearch] = useState('')
	const [filteredClients, setFilteredClients] = useState([])

	const batchData = useSelector((state) => state.batchDetails.data)
	const { isLoading, error, isSuccess } = useSelector(
		(state) => state.batchDetails
	)
	const dispatch = useDispatch()

	const [clientData, setClientData] = useState([])

	const filterData =
		clientData && clientData.filter((item) => item.collections.length > 0) //item.collections.length > 0

	const [showAll, setShowAll] = useState(false)

	const scrollY = new Animated.Value(0) // Animated value to track scroll position
	const [visible, setVisible] = useState(true) // State to track FloatingAction visibility
	const [animation, setAnimation] = useState(new Animated.Value(1))

	const toggleShowAll = () => {
		setShowAll(!showAll)
	}

	const dataToShow = showAll ? clientData : filterData

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
								// clientid: 1974,
								// slclass: [12, 13],
							})
						)
					},
				},
			]
		)
	}, [dispatch])

	useEffect(() => {
		showData()
	}, [
		batchData,
		search,
		filteredClients,
		showAll,
		animation,
		visible,
		isLoading,
	])

	useEffect(() => {
		if (isSuccess) {
			saveData()
		}
	}, [isSuccess, search])

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: scrollY } } }],
		{ useNativeDriver: false }
	)

	scrollY.addListener((value) => {
		if (value.value > 0 && visible) {
			setVisible(false)
			Animated.timing(animation, {
				toValue: 0,
				duration: 300, // Adjust the duration as needed
				useNativeDriver: false,
			}).start()
		} else if (value.value <= 0 && !visible) {
			setVisible(true)
			Animated.timing(animation, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false,
			}).start()
		}
	})

	const floatingActionStyle = {
		opacity: animation,
		transform: [{ scale: animation }],
	}

	const saveData = useCallback(async () => {
		Alert.alert('Saving Data', 'Are you sure you want to save the data?', [
			{
				text: 'NO',
				onPress: () => Alert.alert('Cancelled', 'Data not saved'),
				style: 'cancel',
			},
			{
				text: 'YES',
				onPress: async () => {
					try {
						const realm = await Realm.open(databaseOptions)
						realm.write(() => {
							batchData.data.forEach((client) => {
								const collections = client.collections.map((collection) => ({
									...collection,
									id: `${client.ClientID}-${collection.ID}`,
								}))

								const clientData = {
									ClientIDBrCode: client.ClientIDBrCode,
									ClientID: client.ClientID,
									Fullname: client.Fullname,
									collections,
								}

								realm.create(Client, clientData, Realm.UpdateMode.Modified)
							})
						})
						Alert.alert('Success', 'Data saved successfully!')
						dispatch(resetGetDetails())
						realm.close()
						showData()
					} catch (error) {
						Alert.alert('Error', 'Error saving data!')
						console.error(error)
					}
				},
			},
		])
	}, [batchData, showData])

	const showData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const clients = realm.objects(Client)
			setClientData(Array.from(clients))

			// realm.close()
		} catch (error) {
			Alert.alert('Error retrieving data', error)
			console.error(error)
		}
	}, [search])

	const handleSearch = useCallback(
		(query) => {
			const normalizedQuery = query.toLowerCase()
			const data = dataToShow.filter((client) =>
				client.Fullname.toLowerCase().includes(normalizedQuery)
			)

			setFilteredClients(data)
		},
		[filterData, dataToShow, search]
	)

	const clearSearch = () => {
		setSearch('')
		setFilteredClients([])
	}

	const renderContent = useCallback(() => {
		return (
			<View style={{ flex: 1 }}>
				<Search
					title={'Client Collection'}
					onPress={fetchData}
					isDownload={true}
					value={search}
					onChangeText={(val) => {
						setSearch(val)
						handleSearch(val)
					}}
					clearStatus={true ? clearSearch : false}
				/>

				<View className='mt-2' />

				<FlashList
					contentContainerStyle={styles.paddingFlatList}
					estimatedItemSize={200}
					scrollEventThrottle={16}
					onScroll={handleScroll}
					data={filteredClients.length > 0 ? filteredClients : dataToShow}
					keyExtractor={(_item, index) => index.toString()}
					renderItem={({ item }) => {
						const { ClientID, Fullname, isPaid, collections } = item

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
								description={ClientID.toString()}
								isPaid={isPaid}
								total_loans={totalDue ? formatNumber(totalDue.toFixed(2)) : ''}
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
								<>
									<Text className='text-black dark:text-white font-bold'>
										No data found.
									</Text>
								</>
							)}
						</View>
					}
				/>
			</View>
		)
	}, [
		colors.primary,
		colors.primaryLight,
		fetchData,
		saveData,
		clientData,
		navigation,
	])

	// Fetch data when the component mounts
	useEffect(() => {
		showData()
	}, [])

	// Fetch data when the component gains focus
	useFocusEffect(
		useCallback(() => {
			showData()
			return () => {
				// Cleanup function (if needed)
			}
		}, [])
	)

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView
				style={BaseStyle.safeAreaView}
				edges={['right', 'top', 'left']}>
				{renderContent()}
				{/* <FloatingAction
					// actions={actions}
					// onPressItem={(name) => {
					// 	if (name === 'bt_showAll') {
					// 		toggleShowAll()
					// 	}
					// }}
					showBackground={false}
					floatingIcon={
						showAll ? (
							<Icons.Octicons name='eye' size={20} color='#FFFFFF' />
						) : (
							<Icons.Octicons name='eye-closed' size={20} color='#FFFFFF' />
						)
					}
					onPressMain={() => toggleShowAll()}
				/> */}
				{visible && (
					<Animated.View style={floatingActionStyle}>
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
					</Animated.View>
				)}
			</SafeAreaView>
		</View>
	)
}

export default ClientCollection