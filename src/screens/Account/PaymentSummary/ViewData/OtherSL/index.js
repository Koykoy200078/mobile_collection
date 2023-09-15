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

	console.log('inputAmounts: ', inputAmounts)

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

	const renderItem = ({ item, index }) => {
		const a = parseFloat(item.PRINDUE)
		const b = parseFloat(item.INTDUE)
		const c = parseFloat(item.PENDUE)

		const total = a + b + c
		const formatNumber = (number) => {
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		}

		return (
			<CardReport02
				key={index}
				index={index}
				style={{ flex: 1, width: width, marginVertical: 10, padding: 5 }}
				title={item.SLDESCR}
				description={item.REF_TARGET}
				placeholder='0.00'
				checkedBoxLabel='Amount'
				value={inputAmounts[item.REF_TARGET]?.AMOUNT || ''}
				onChangeText={(val) =>
					handleInputChange(item.REF_TARGET, item.ID, 'AMOUNT', val)
				}
				checkBoxEnabled={true}
				checkBox={!!checkboxChecked[index]}
				editable={!!checkboxChecked[index]}
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

			{/* <ScrollView
				contentContainerStyle={styles.container}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}>
				<View key={item.id}>
					<View style={styles.specifications}>
						{item &&
							item.collections &&
							item.collections
								.filter((collection) => collection.is_default === 0)
								.map((collection, index) => {
									const a = parseFloat(collection.PRINDUE)
									const b = parseFloat(collection.INTDUE)
									const c = parseFloat(collection.PENDUE)

									const total = a + b + c
									const formatNumber = (number) => {
										return number
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									}

									return (
										<CardReport02
											key={index}
											index={index}
											style={{ flex: 1, width: width - 30, marginVertical: 10 }}
											title={collection.SLDESCR}
											description={collection.REF_TARGET}
											placeholder='0.00'
											checkedBoxLabel='Amount'
											value={inputAmounts[collection.REF_TARGET]?.SLDESCR || ''}
											onChangeText={(val) =>
												handleInputChange(collection.REF_TARGET, 'SLDESCR', val)
											}
											checkBoxEnabled={true}
											checkBox={!!checkboxChecked[index]}
											editable={!!checkboxChecked[index]}
											setCheckboxChecked={setCheckboxChecked}
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
			</ScrollView> */}

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
									name: item.Fullname,
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

export default OtherSL
