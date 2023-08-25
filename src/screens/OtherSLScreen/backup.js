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
	ScrollView,
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

const OtherSLScreen = ({ navigation }) => {
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
		clientData && clientData.filter((item) => item.is_default === false) //item.collections.length > 0

	const [showAll, setShowAll] = useState(false)

	const scrollY = new Animated.Value(0) // Animated value to track scroll position
	const [visible, setVisible] = useState(true) // State to track FloatingAction visibility
	const [animation, setAnimation] = useState(new Animated.Value(1))

	const tabs = [
		{
			id: 12,
			title: 'Loans Receivable',
		},
		{
			id: 13,
			title: 'Accts Receivable',
		},
		{
			id: 22,
			title: 'Savings Deposit',
		},
		{
			id: 31,
			title: 'Share Capital',
		},
		{
			id: 41,
			title: 'Income Acct',
		},
		{
			id: 51,
			title: 'Expense Acct',
		},
		{
			id: 99,
			title: 'Other SL',
		},
	]

	const [tab, setTab] = useState(tabs[0].id)

	const toggleShowAll = () => {
		setShowAll(!showAll)
	}

	const dataToShow = showAll ? clientData : filterData

	useEffect(() => {
		showData()
	}, [batchData, search, filteredClients, showAll, animation, visible, tab])

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
			const data = dataToShow.filter(
				(client) =>
					client.FName.toLowerCase().includes(normalizedQuery) ||
					client.MName.toLowerCase().includes(normalizedQuery) ||
					client.LName.toLowerCase().includes(normalizedQuery)
			)
			setFilteredClients(data)
		},
		[filterData, dataToShow]
	)

	const clearSearch = () => {
		setSearch('')
		setFilteredClients([])
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity onPress={() => setTab(item.id)}>
			<View
				style={{
					paddingHorizontal: 8,
					paddingVertical: 4,
					borderColor: tab === item.id ? '#0f0285' : 'transparent',
					borderRadius: 10,
					borderWidth: 1,
					width: 130,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: tab === item.id ? '#0f0285' : 'transparent',
				}}>
				<Text
					style={{
						color: tab === item.id ? '#FFFFFF' : '#121212',
						fontWeight: tab === item.id ? 'bold' : 'normal',
					}}>
					{item.title}
				</Text>
			</View>
		</TouchableOpacity>
	)

	const renderContent = useCallback(() => {
		return (
			<View style={{ flex: 1 }}>
				<Search
					title={'SL Accounts'}
					// onPress={fetchData}

					value={search}
					onChangeText={(val) => {
						setSearch(val)
						handleSearch(val)
					}}
					clearStatus={true ? clearSearch : false}
				/>

				<FlatList
					horizontal
					data={tabs}
					contentContainerStyle={{
						paddingHorizontal: 10,
						height: 30,
					}}
					renderItem={renderItem}
					keyExtractor={(item) => item.id.toString()}
				/>

				{/* <FlashList
					contentContainerStyle={styles.paddingFlatList}
					estimatedItemSize={200}
					scrollEventThrottle={16}
					onScroll={handleScroll}
					data={filteredClients.length > 0 ? filteredClients : dataToShow}
					keyExtractor={(_item, index) => index.toString()}
					renderItem={({ item }) => {
						const { FName, MName, LName, SName, collections, SLDESCR } = item

						const fName = FName || ''
						const mName = MName || ''
						const lName = LName ? LName + ', ' : ''
						const sName = SName || ''

						const totalDue = collections.reduce(
							(acc, data) => acc + parseFloat(data.TOTALDUE),
							0
						)

						const formatNumber = (number) => {
							return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						}

						const clientName = lName + fName + ' ' + mName + ' ' + sName

						const handlePress = (item) => {
							if (item.collections.length === 0) {
								Alert.alert('Info', 'This client has no collection data')
							} else {
								navigation.navigate(ROUTES.VIEW, { item: item })
							}
						}

						return (
							<Project02
								title={clientName}
								description={'TEST'}
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
				/> */}
			</View>
		)
	}, [colors.primary, colors.primaryLight, clientData, navigation])

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
				{/* {visible && (
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
				)} */}
			</SafeAreaView>
		</View>
	)
}

export default OtherSLScreen
