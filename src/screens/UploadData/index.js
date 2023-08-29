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

const UploadData = ({ navigation }) => {
	const { colors } = useTheme()
	const { width, height } = useWindowDimensions()
	const [search, setSearch] = useState('')
	const [filteredClients, setFilteredClients] = useState([])
	const dispatch = useDispatch()

	const [clientData, setClientData] = useState([])

	const filterData = clientData && clientData.filter((item) => item.isPaid)

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
			const data = filterData.filter((client) =>
				client.Fullname.toLowerCase().includes(normalizedQuery)
			)
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
					title={'Paid Client'}
					value={search}
					isUpload={true}
					onPressUpload={() => {
						Alert.alert('Upload', 'Are you sure you want to upload data?')
					}}
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
					data={filteredClients.length > 0 ? filteredClients : filterData}
					keyExtractor={(_item, index) => index.toString()}
					renderItem={({ item }) => {
						const { Fullname, collections, SLDESCR } = item

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
								description={item.ClientID.toString()}
								isPaid={item.isPaid}
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

export default UploadData
