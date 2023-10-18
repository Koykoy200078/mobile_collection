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
import { BaseStyle, ROUTES, useTheme } from '../../../app/config'
import { Header, Project02, Search, TabTag } from '../../../app/components'
import { Icons } from '../../../app/config/icons'
import styles from './styles'
import { Realm } from '@realm/react'
import databaseOptions, {
	Client,
	UploadData as clientUploadData,
} from '../../../app/database/allSchemas'
import { getDetails, resetGetDetails } from '../../../app/reducers/batchDetails'
import { useDispatch, useSelector } from 'react-redux'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect } from '@react-navigation/native'

const PaymentSummary = ({ navigation }) => {
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

			const clients = realm.objects(clientUploadData)
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
					title={"Payment's Summary"}
					value={search}
					// isUpload={true}
					// onPressUpload={() => {
					// 	Alert.alert('Upload', 'Are you sure you want to upload data?')
					// }}
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
					data={filteredClients.length > 0 ? filteredClients : filterData}
					keyExtractor={(_item, index) => index.toString()}
					renderItem={({ item }) => {
						const {
							branch_id,
							client_id,
							FName,
							LName,
							MName,
							SName,
							isPaid,
							TOP,
							STATUS,
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
							(acc, data) => acc + parseFloat(data.ACTUAL_PAY),
							0
						)

						const formatNumber = (number) => {
							return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						}

						const handlePress = (item) => {
							if (item.collections.length === 0) {
								Alert.alert('Info', 'This client has no collection data')
							} else {
								navigation.navigate(ROUTES.VIEW_UPLOAD_DATA, { item: item })
							}
						}

						let aa =
							item &&
							item.collections.map((item) => item.TOP.map((data) => data.TYPE))

						console.log('TOP: ', aa)

						return (
							<Project02
								title={Fullname}
								description={
									aa[0].toString() === 'CHECK'
										? 'COCI (Check and Other Cash Items)'
										: 'CASH'
								}
								// isPaid={item.isPaid}
								total_loans={totalDue ? formatNumber(totalDue.toFixed(2)) : ''}
								// isCancelled={}
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

export default PaymentSummary
