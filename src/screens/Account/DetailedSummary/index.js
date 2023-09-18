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
	useColorScheme,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { BaseStyle, ROUTES, useTheme } from '../../../app/config'
import { Project02, Search } from '../../../app/components'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect } from '@react-navigation/native'
import styles from './styles'
import databaseOptions, {
	CollectionReport,
	UploadData,
} from '../../../app/database/allSchemas'
import { Shadow } from 'react-native-shadow-2'
import { ScrollView } from 'react-native-gesture-handler'

const DetailedSummary = ({ navigation }) => {
	const { colors } = useTheme()
	const isDarkMode = useColorScheme() === 'dark'
	const { width, height } = useWindowDimensions()
	const [search, setSearch] = useState('')

	const dispatch = useDispatch()

	const [clientData, setClientData] = useState([])
	const [filteredClients, setFilteredClients] = useState([])

	useEffect(() => {
		showData()
	}, [search, filteredClients])

	useFocusEffect(
		useCallback(() => {
			showData()
			return () => {}
		}, [])
	)

	const showData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)

			const clients = realm.objects(CollectionReport)
			setClientData(Array.from(clients))
		} catch (error) {
			Alert.alert('Error retrieving data', error)
			console.error(error)
		}
	}, [search])

	const handleSearch = useCallback(
		(query) => {
			const normalizedQuery = query.toLowerCase()
			const data = clientData.filter((client) => {
				const transID = client.TRANSID && client.TRANSID.toString()
				const transRefNo =
					client.TRANS_REFNO &&
					client.TRANS_REFNO.toLowerCase().includes(normalizedQuery)
				const clientID = client.CLIENTID && client.CLIENTID.toString()
				const clientName =
					client.CLIENT_NAME &&
					client.CLIENT_NAME.toLowerCase().includes(normalizedQuery)

				// Return true if any of the properties match the query
				return (
					transID === normalizedQuery ||
					transRefNo ||
					clientID === normalizedQuery ||
					clientName
				)
			})
			setFilteredClients(data)
		},
		[clientData]
	)

	const clearSearch = () => {
		setSearch('')
		setFilteredClients([])
	}

	const renderContent = useCallback(() => {
		return (
			<View style={{ flex: 1 }}>
				<Search
					title={"Client's Report"}
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
					estimatedItemSize={360}
					data={filteredClients.length > 0 ? filteredClients : clientData}
					keyExtractor={(_item, index) => index.toString()}
					renderItem={({ item }) => {
						const formatNumber = (number) => {
							return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						}

						return (
							<ScrollView contentContainerStyle={{ width: width, padding: 10 }}>
								<Shadow
									distance={2}
									startColor={isDarkMode ? '#f1f1f1' : '#00000020'}
									style={{
										width: width - 60,
										borderRadius: 10,
									}}>
									<View className='rounded-md p-2 w-full'>
										<View className='flex-row items-center justify-between'>
											<View>
												<Text className='text-black text-sm font-bold'>
													Client ID
												</Text>
											</View>
											<View>
												<Text className='text-black text-sm'>
													{item.CLIENTID}
												</Text>
											</View>
										</View>

										<View className='flex-row items-center justify-between'>
											<Text className='text-black text-sm font-bold'>
												Client Name
											</Text>
											<Text className='text-black text-sm'>
												{item.CLIENT_NAME}
											</Text>
										</View>

										<View className='flex-row items-center justify-between'>
											<Text className='text-black text-sm font-bold'>
												Amount Pay
											</Text>
											<Text className='text-black text-sm'>
												{formatNumber(item.ACTUAL_PAY)}
											</Text>
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

										<View className='flex-row items-center justify-between'>
											<View>
												<Text className='text-black text-sm font-bold'>
													Transaction ID
												</Text>
											</View>
											<View>
												<Text className='text-black text-sm'>
													{item.TRANSID}
												</Text>
											</View>
										</View>
										<View className='flex-row items-center justify-between'>
											<View>
												<Text className='text-black text-sm font-bold'>
													Reference No.
												</Text>
											</View>
											<View>
												<Text className='text-black text-sm'>
													{item.TRANS_REFNO}
												</Text>
											</View>
										</View>
									</View>
								</Shadow>
							</ScrollView>
						)
					}}
					ListEmptyComponent={
						<View className='flex-1 items-center justify-center'>
							<Text className='text-black dark:text-white font-bold'>
								No data found.
							</Text>
						</View>
					}
				/>
			</View>
		)
	}, [colors.primary, colors.primaryLight, clientData, navigation])

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView
				style={BaseStyle.safeAreaView}
				edges={['right', 'top', 'left']}>
				{renderContent()}
			</SafeAreaView>
		</View>
	)
}

export default DetailedSummary
