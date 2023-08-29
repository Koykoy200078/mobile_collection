import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
	View,
	Text,
	useWindowDimensions,
	SafeAreaView,
	ScrollView,
	Image,
	Alert,
	Animated,
	TextInput,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { BaseStyle, Images, ROUTES, useTheme } from '../../app/config'
import styles from './styles'
import {
	Button,
	CardReport02,
	Header,
	ProductSpecGrid,
	Search,
} from '../../app/components'
import { Icons } from '../../app/config/icons'
import databaseOptions, { Client } from '../../app/database/allSchemas'
import { FloatingAction } from 'react-native-floating-action'
import { showInfo } from '../../app/components/AlertMessage'

const OtherSLScreen = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	// const [item, setItem] = useState('')
	const [search, setSearch] = useState('')
	const [filteredClients, setFilteredClients] = useState([])

	const [isCollapsed, setIsCollapsed] = useState({})
	const [inputAmounts, setInputAmounts] = useState({})
	const [totalValue, setTotalValue] = useState(0)

	const { clientData } = route.params

	const item = clientData

	useEffect(() => {
		calculateTotalValue()
	}, [isCollapsed, inputAmounts, search])

	useEffect(() => {
		// if (route.params?.item) {
		// 	setItem(route.params.item)
		// }
	}, [route])

	const handleAccordionToggle = (index) => {
		setIsCollapsed((prevState) => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	const handleInputChange = (index, name, value) => {
		const collection = item.collections.find((c) => c.REF_TARGET === index)

		if (collection) {
			const balance = parseFloat(collection.TOTALDUE)
			const inputValue = parseFloat(value)

			const newBal = balance.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
			if (inputValue > balance) {
				Alert.alert(
					'Warning',
					`The input amount should not exceed the total due of ${newBal}`
				)
			} else {
				setInputAmounts((prevState) => ({
					...prevState,
					[index]: {
						...prevState[index],
						[name]: value,
					},
				}))
			}
		}
	}

	const calculateTotalValue = () => {
		let total = 0
		Object.values(inputAmounts).forEach((values) => {
			Object.values(values).forEach((value) => {
				if (value) {
					total += parseFloat(value)
				}
			})
		})
		setTotalValue(total)
	}

	const totalAmount = totalValue.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	// const handleSearch = useCallback(
	// 	(query) => {
	// 		const normalizedQuery = query.toLowerCase()
	// 		const data = dataToShow.filter(
	// 			(client) =>
	// 				client.Fullname.toLowerCase().includes(normalizedQuery) ||
	// 				client.MName.toLowerCase().includes(normalizedQuery) ||
	// 				client.LName.toLowerCase().includes(normalizedQuery)
	// 		)
	// 		setFilteredClients(data)
	// 	},
	// 	[dataToShow]
	// )

	const clearSearch = () => {
		setSearch('')
		setFilteredClients([])
	}

	return (
		<SafeAreaView
			style={[BaseStyle.safeAreaView, { flex: 1 }]}
			edges={['right', 'top', 'left']}>
			{/* <Header
				title='Other SL Account'
				renderLeft={() => (
					<Icons.FontAwesome5
						name='angle-left'
						size={20}
						color={colors.text}
						enableRTL={true}
					/>
				)}
				onPressLeft={() => {
					navigation.goBack()
				}}
				// renderRight={() =>
				// 	item.isPaid ? (
				// 		<Icons.Entypo name='check' size={20} color={'green'} />
				// 	) : null
				// }
				// onPressRight={async () => {
				// 	item.isPaid
				// 		? Alert.alert(
				// 				'This client is already paid',
				// 				'Are you sure you want to unpaid this client?',
				// 				[
				// 					{
				// 						text: 'Cancel',
				// 						onPress: () => console.log('Cancel Pressed'),
				// 						style: 'cancel',
				// 					},
				// 					{
				// 						text: 'Yes',
				// 						onPress: async () => {
				// 							try {
				// 								const realm = await Realm.open(databaseOptions)
				// 								realm.write(() => {
				// 									const existingClient = realm.objectForPrimaryKey(
				// 										Client,
				// 										item.ClientID
				// 									)

				// 									if (!existingClient) {
				// 										Alert.alert('Error', 'Client not found!')
				// 										return
				// 									}

				// 									// Update client properties
				// 									existingClient.isPaid = false
				// 									realm.create(
				// 										Client,
				// 										existingClient,
				// 										Realm.UpdateMode.Modified
				// 									)
				// 								})

				// 								Alert.alert('Success', 'Data updated successfully!')
				// 								navigation.goBack()
				// 							} catch (error) {
				// 								Alert.alert('Error', 'Error updating data!')
				// 								console.error('Error: ', error)
				// 							}
				// 						},
				// 					},
				// 				]
				// 		  )
				// 		: null
				// }}
			/> */}

			<Search
				title={'Other SL Account'}
				// onPress={fetchData}
				// isDownload={true}
				value={search}
				onChangeText={(val) => {
					setSearch(val)
					// handleSearch(val)
				}}
				clearStatus={true ? clearSearch : false}
			/>

			<ScrollView
				contentContainerStyle={styles.container}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}>
				<View key={item.id}>
					{/* <Text
						title3
						body1
						className='text-xl font-bold text-black dark:text-white'>
						{item.isPaid && (
							<Image
								source={Images.complete}
								style={{ width: 20, height: 20 }}
							/>
						)}{' '}
						{item.Fullname}
					</Text> */}

					<View style={styles.specifications}>
						{item &&
							item.collections &&
							item.collections.map((collection, index) => {
								const a = parseFloat(collection.PRINDUE)
								const b = parseFloat(collection.INTDUE)
								const c = parseFloat(collection.PENDUE)

								const total = a + b + c
								const formatNumber = (number) => {
									return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
								}

								return (
									<CardReport02
										key={index}
										style={{ flex: 1, width: width - 30, marginVertical: 10 }}
										title={collection.SLDESCR}
										description={collection.REF_TARGET}
										placeholder='0.00'
										checkedBoxLabel='Input Amount'
										value={inputAmounts[collection.REF_TARGET]?.SLDESCR || ''}
										onChangeText={(val) =>
											handleInputChange(collection.REF_TARGET, 'SLDESCR', val)
										}
										checkBoxEnabled={true}
										checkBox={!!inputAmounts[collection.REF_TARGET]?.SLDESCR}
										isActive={isCollapsed[index] ? 'angle-down' : 'angle-up'}
										enableTooltip={true}
										toggleAccordion={() => handleAccordionToggle(index)}
										isCollapsed={isCollapsed[index]}
										principal={formatNumber(collection.PRINDUE)}
										interest={formatNumber(collection.INTDUE)}
										penalty={formatNumber(collection.PENDUE)}
										total={formatNumber(total.toFixed(2))}
									/>
								)
							})}
					</View>
				</View>
			</ScrollView>

			<View style={styles.container}>
				<View className=' h-9' style={styles.specifications}>
					<ProductSpecGrid
						style={{ flex: 1 }}
						title={totalAmount ? totalAmount : '0.00'}
						description={'Total Amount Due'}
						isEnable={false}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<Button
						full
						onPress={() => {
							if (totalAmount.trim() === '' || totalAmount !== '0.00') {
								navigation.navigate(ROUTES.CHECKOUT, {
									name: getName,
									allData: item,
									inputAmounts: inputAmounts,
									total: parseFloat(totalValue),
								})
							} else {
								showInfo({
									message: 'Input Amount',
									description:
										'Input the amount you want to pay for this collection.',
								})
							}
						}}>
						Checkout
					</Button>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default OtherSLScreen
