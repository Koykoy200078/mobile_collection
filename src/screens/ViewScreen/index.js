import React, { useState, useEffect, useRef } from 'react'
import { View, Text, useWindowDimensions, SafeAreaView, ScrollView, Image, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { BaseStyle, Images, ROUTES, useTheme } from '../../app/config'
import styles from './styles'
import { Button, CardReport02, Header, ProductSpecGrid } from '../../app/components'
import { Icons } from '../../app/config/icons'
import databaseOptions, { Client } from '../../app/database/allSchemas'

const ViewScreen = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	const [item, setItem] = useState('')
	const [isCollapsed, setIsCollapsed] = useState({})
	const [inputAmounts, setInputAmounts] = useState({})
	const [totalValue, setTotalValue] = useState(0)

	useEffect(() => {
		calculateTotalValue()
	}, [isCollapsed, inputAmounts])

	useEffect(() => {
		if (route.params?.item) {
			setItem(route.params.item)
		}
	}, [route])

	const handleAccordionToggle = (index) => {
		setIsCollapsed((prevState) => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	const handleInputChange = (index, name, value) => {
		const collection = item.collections.find((c) => c.REF_TARGET === index)

		// setInputAmounts(prevState => ({
		//   ...prevState,
		//   [index]: {
		//     ...prevState[index],
		//     [name]: value,
		//   },
		// }));
		if (collection) {
			const balance = parseFloat(collection.TOTALDUE)
			const inputValue = parseFloat(value)

			const newBal = balance.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
			if (inputValue > balance) {
				Alert.alert('Warning', `The input amount should not exceed the total due of ${newBal}`)
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

	let fName = item.FName ? item.FName : ''
	let mName = item.MName ? item.MName : ''
	let lName = item.LName ? item.LName + ', ' : ''
	let sName = item.SName ? item.SName : ''
	let getName = lName + fName + ' ' + mName + ' ' + sName

	return (
		<SafeAreaView style={[BaseStyle.safeAreaView, { flex: 1 }]} edges={['right', 'top', 'left']}>
			<Header
				title='Account View'
				renderLeft={() => <Icons.FontAwesome5 name='angle-left' size={20} color={colors.text} enableRTL={true} />}
				onPressLeft={() => {
					navigation.goBack()
				}}
				renderRight={() => (item.isPaid ? <Icons.Entypo name='check' size={20} color={'green'} /> : null)}
				onPressRight={async () => {
					item.isPaid
						? Alert.alert('This client is already paid', 'Are you sure you want to unpaid this client?', [
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
												const existingClient = realm.objectForPrimaryKey(Client, item.ClientID)

												if (!existingClient) {
													Alert.alert('Error', 'Client not found!')
													return
												}

												// Update client properties
												existingClient.isPaid = false
												realm.create(Client, existingClient, Realm.UpdateMode.Modified)
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
						: null
				}}
			/>

			<ScrollView contentContainerStyle={styles.container} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
				<View key={item.id}>
					<Text title3 body1 className='text-xl font-bold text-black dark:text-white'>
						{item.isPaid && <Image source={Images.complete} style={{ width: 20, height: 20 }} />} {getName}
					</Text>

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
										onChangeText={(val) => handleInputChange(collection.REF_TARGET, 'SLDESCR', val)}
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

					<View style={styles.specifications}>
						<ProductSpecGrid style={{ flex: 1 }} title={totalAmount ? totalAmount : '0.00'} description={'Total Amount Due'} isEnable={false} />
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
									Alert.alert('Error', 'Please input an amount before proceeding.')
								}
							}}>
							Checkout
						</Button>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default ViewScreen
