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
import { BaseStyle, Images, ROUTES, useTheme } from '../../../../../app/config'
import styles from './styles'
import {
	Button,
	CardReport02,
	Header,
	ProductSpecGrid,
	Search,
} from '../../../../../app/components'
import { Icons } from '../../../../../app/config/icons'
import databaseOptions, { Client } from '../../../../../app/database/allSchemas'
import { FloatingAction } from 'react-native-floating-action'
import { showInfo } from '../../../../../app/components/AlertMessage'
import { FlashList } from '@shopify/flash-list'

const OtherSL = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	// const [item, setItem] = useState('')
	const [search, setSearch] = useState('')
	const [filteredClients, setFilteredClients] = useState([])

	const [isCollapsed, setIsCollapsed] = useState({})
	const [inputAmounts, setInputAmounts] = useState({})
	const [checkboxChecked, setCheckboxChecked] = useState({})

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

	useEffect(() => {
		// Assuming apiData is an array of items
		const initialIsCollapsed = {}
		if (item && item.collections && item.collections.length > 0) {
			item.collections.forEach((_, index) => {
				initialIsCollapsed[index] = true // Set each item to be initially collapsed
			})
		}
		setIsCollapsed(initialIsCollapsed)
	}, [item])

	const handleAccordionToggle = (index) => {
		setIsCollapsed((prevState) => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	const handleInputChange = (refTarget, id, name, value) => {
		const collection = item.collections.find((c) => c.REF_TARGET === refTarget)

		if (collection) {
			const balance = parseFloat(collection.TOTALDUE)
			const inputValue = parseFloat(value)

			if (inputValue) {
				setInputAmounts((prevState) => ({
					...prevState,
					[refTarget]: {
						...prevState[refTarget],
						ID: id,
						[name]: value,
					},
				}))

				// Update the checkboxChecked state
				setCheckboxChecked((prevState) => ({
					...prevState,
					[refTarget]: !!value, // Set to true if there is a value, otherwise false
				}))
			}
		}
	}

	const calculateTotalValue = () => {
		let total = 0
		for (const refTarget in inputAmounts) {
			const value = inputAmounts[refTarget].AMOUNT
			if (value) {
				total += parseFloat(value)
			}
		}

		setTotalValue(total)
	}

	const totalAmount = totalValue.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const clearSearch = () => {
		setSearch('')
		setFilteredClients([])
	}

	const totalDue =
		item &&
		item.collections
			.filter((col) => col.is_default === 0)
			.reduce((acc, data) => acc + parseFloat(data.ACTUAL_PAY), 0)

	function mapStatusToResult(status) {
		switch (status) {
			case 1:
				return 'ACTIVE'
			case 4:
				return 'CANCELLED'
			case 5:
				return 'DISAPPROVED'
			default:
				return 'UNKNOWN' // Handle other cases if needed
		}
	}

	const formatNumber = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	const renderItem = ({ item, index }) => {
		const a = parseFloat(item.PRINDUE)
		const b = parseFloat(item.INTDUE)
		const c = parseFloat(item.PENDUE)

		const total = a + b + c

		return (
			<CardReport02
				key={index}
				index={index}
				style={{ flex: 1, width: width, marginVertical: 10, padding: 5 }}
				isStatus={true}
				status={mapStatusToResult(item.STATUS)}
				textStatusColor={
					item.STATUS === 1 ? 'green' : item.STATUS === 4 ? 'red' : 'gray'
				}
				statusOnPress={() => {
					if (item.STATUS === 4) {
						Alert.alert('Active Account', 'Are you sure?', [
							{
								text: 'Cancel',
								onPress: () => console.log('Cancel Pressed'),
								style: 'cancel',
							},
							{
								text: 'Yes',
								onPress: async () => {
									try {
										const realm = await Realm.open(databaseOptions)
										realm.write(() => {
											const existingClient = realm.objectForPrimaryKey(
												UploadData,
												myData.client_id
											)

											if (!existingClient) {
												Alert.alert('Error', 'Client not found!')
												return
											}

											const collection = myData.collections.find(
												(col) => col.REF_TARGET === item.REF_TARGET
											)

											if (collection) {
												collection.STATUS = 1
											} else {
												Alert.alert('Error', 'Collection not found!')
											}
										})

										Alert.alert('Success', 'Data updated successfully!')
										navigation.goBack()
									} catch (error) {
										Alert.alert('Error', 'Error updating data!')
										console.error('Error: ', error)
									}
								},
							},
						])
					} else if (item.STATUS === 1) {
						Alert.alert('Cancel Account', 'Are you sure?', [
							{
								text: 'Cancel',
								onPress: () => console.log('Cancel Pressed'),
								style: 'cancel',
							},
							{
								text: 'Yes',
								onPress: async () => {
									try {
										const realm = await Realm.open(databaseOptions)
										realm.write(() => {
											const existingClient = realm.objectForPrimaryKey(
												UploadData,
												myData.client_id
											)

											if (!existingClient) {
												Alert.alert('Error', 'Client not found!')
												return
											}

											const collection = myData.collections.find(
												(col) => col.REF_TARGET === item.REF_TARGET
											)

											if (collection) {
												collection.STATUS = 4
											} else {
												Alert.alert('Error', 'Collection not found!')
											}
										})

										Alert.alert('Success', 'Data updated successfully!')
										navigation.goBack()
									} catch (error) {
										Alert.alert('Error', 'Error updating data!')
										console.error('Error: ', error)
									}
								},
							},
						])
					}
				}}
				title={item.SLDESCR}
				description={item.REF_TARGET}
				placeholder='0.00'
				checkedBoxLabel='Amount'
				value={item.ACTUAL_PAY}
				onChangeText={(val) =>
					handleInputChange(item.REF_TARGET, item.ID, 'AMOUNT', val)
				}
				checkBoxEnabled={true}
				checkBox={true}
				editable={false}
				setCheckboxChecked={setCheckboxChecked}
				isActive={isCollapsed[index] ? 'angle-down' : 'angle-up'}
				enableTooltip={true}
				toggleAccordion={() => handleAccordionToggle(index)}
				isCollapsed={isCollapsed[index]}
				principal={formatNumber(item.PRINDUE)}
				interest={formatNumber(item.INTDUE)}
				penalty={formatNumber(item.PENDUE)}
				total={formatNumber(total.toFixed(2))}
			/>
		)
	}

	let aa = item && item.COCI.map((item) => item.TYPE)

	return (
		<SafeAreaView
			style={[BaseStyle.safeAreaView, { flex: 1 }]}
			edges={['right', 'top', 'left']}>
			<Search
				title={'Other SL Account'}
				value={search}
				onChangeText={(val) => {
					setSearch(val)
					// handleSearch(val)
				}}
				clearStatus={true ? clearSearch : false}
			/>

			<FlashList
				data={
					item &&
					item.collections &&
					item.collections.filter((collection) => collection.is_default === 0)
				}
				renderItem={renderItem}
				initialScrollIndex={0}
				keyExtractor={(item, index) => index.toString()}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				estimatedItemSize={360}
			/>

			<View style={styles.container}>
				<View className='h-11' style={styles.specifications}>
					<ProductSpecGrid
						title={aa.toString()}
						description={'Payment Type'}
						isEnable={false}
					/>
					<ProductSpecGrid
						title={totalAmount ? formatNumber(totalDue.toFixed(2)) : '0.00'}
						description={'Total Paid Amount'}
						isEnable={false}
					/>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default OtherSL
