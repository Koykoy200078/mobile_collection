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

const DetailedSummary = ({ navigation }) => {
	const { colors } = useTheme()
	const { width, height } = useWindowDimensions()
	const [search, setSearch] = useState('')
	const [filteredClients, setFilteredClients] = useState([])
	const dispatch = useDispatch()

	const [clientData, setClientData] = useState([])

	//  && clientData.filter((item) => item.isPaid)

	const filterData = clientData

	useEffect(() => {
		showData()
	}, [search])

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
			// console.log(JSON.stringify(Array.from(clients), null, 2))

			// realm.close()
		} catch (error) {
			Alert.alert('Error retrieving data', error)
			console.error(error)
		}
	}, [search])

	const handleSearch = useCallback(
		(query) => {
			const normalizedQuery = query.toLowerCase()
			const data = filterData.filter((client) => {
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
		[filterData, search]
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
					data={clientData}
					keyExtractor={(_item, index) => index.toString()}
					renderItem={({ item }) => {
						const formatNumber = (number) => {
							return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						}

						console.log('item: ', item)

						const handlePress = (item) => {
							// if (item.collections.length === 0) {
							// 	Alert.alert('Info', 'This client has no collection data')
							// } else {
							// 	navigation.navigate(ROUTES.SUMMARY, { item: item })
							// }
						}

						return (
							<View className='p-2 space-y-2'>
								<View className='border rounded-md p-2'>
									<Text>{item.CLIENTID}</Text>
									<Text>{item.CLIENT_NAME}</Text>
									<Text>{item.TRANS_REFNO}</Text>
									<Text>{formatNumber(item.ACTUAL_PAY)}</Text>
								</View>
							</View>
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
