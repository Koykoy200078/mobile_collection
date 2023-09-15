// import React, { useState, useEffect, useRef, useMemo } from 'react'
// import {
// 	View,
// 	Text,
// 	useWindowDimensions,
// 	SafeAreaView,
// 	ScrollView,
// 	Image,
// 	Alert,
// 	Animated,
// 	TextInput,
// 	Keyboard,
// } from 'react-native'
// import { useDispatch } from 'react-redux'
// import { BaseStyle, Images, ROUTES, useTheme } from '../../app/config'
// import styles from './styles'
// import {
// 	Button,
// 	CardReport02,
// 	Header,
// 	ProductSpecGrid,
// } from '../../app/components'
// import { Icons } from '../../app/config/icons'
// import databaseOptions, { Client } from '../../app/database/allSchemas'
// import { FloatingAction } from 'react-native-floating-action'
// import { showInfo } from '../../app/components/AlertMessage'
// import { FlashList } from '@shopify/flash-list'
// import { TouchableOpacity } from 'react-native-gesture-handler'

// const ViewScreen = ({ navigation, route }) => {
// 	const { width } = useWindowDimensions()
// 	const { colors } = useTheme()
// 	const [item, setItem] = useState('')

// 	const [checkEnable, setCheckEnable] = useState(false)
// 	const [isCollapsed, setIsCollapsed] = useState({})
// 	const [inputAmounts, setInputAmounts] = useState({})
// 	const [checkboxChecked, setCheckboxChecked] = useState({})

// 	const [totalValue, setTotalValue] = useState(0)

// 	const [textInputFocused, setTextInputFocused] = useState(false)

// 	const [visible, setVisible] = useState(true)
// 	const [animation, setAnimation] = useState(new Animated.Value(1))

// 	useEffect(() => {
// 		calculateTotalValue()
// 	}, [isCollapsed, inputAmounts, textInputFocused])

// 	useEffect(() => {
// 		const initialIsCollapsed = {}
// 		if (item && item.collections && item.collections.length > 0) {
// 			item.collections.forEach((_, index) => {
// 				initialIsCollapsed[index] = true
// 			})
// 		}
// 		setIsCollapsed(initialIsCollapsed)
// 	}, [item])

// 	useEffect(() => {
// 		if (route.params?.item) {
// 			setItem(route.params.item)
// 		}
// 	}, [route])

// 	useEffect(() => {
// 		const keyboardDidShowListener = Keyboard.addListener(
// 			'keyboardDidShow',
// 			() => {
// 				if (visible) {
// 					setVisible(false)
// 					Animated.timing(animation, {
// 						toValue: 0,
// 						duration: 300,
// 						useNativeDriver: false,
// 					}).start()
// 				}
// 			}
// 		)

// 		const keyboardDidHideListener = Keyboard.addListener(
// 			'keyboardDidHide',
// 			() => {
// 				if (!visible && !textInputFocused) {
// 					setVisible(true)
// 					Animated.timing(animation, {
// 						toValue: 1,
// 						duration: 300,
// 						useNativeDriver: false,
// 					}).start()
// 				}
// 			}
// 		)

// 		return () => {
// 			keyboardDidShowListener.remove()
// 			keyboardDidHideListener.remove()
// 		}
// 	}, [textInputFocused, visible, animation])

// 	const actions = [
// 		{
// 			text: 'Other SL Accounts',
// 			icon: (
// 				<Icons.MaterialCommunityIcons
// 					name='draw-pen'
// 					size={25}
// 					color='#FFFFFF'
// 				/>
// 			),
// 			name: 'bt_SLAccounts',
// 			position: 1,
// 		},
// 	]

// 	const handleAccordionToggle = (index) => {
// 		setIsCollapsed((prevState) => ({
// 			...prevState,
// 			[index]: !prevState[index],
// 		}))
// 	}

// 	const handleInputChange = (index, name, value) => {
// 		const collection = item.collections.find((c) => c.REF_TARGET === index)

// 		if (collection) {
// 			const balance = parseFloat(collection.TOTALDUE)
// 			const inputValue = parseFloat(value)

// 			const newBal = balance.toLocaleString('en-US', {
// 				minimumFractionDigits: 2,
// 				maximumFractionDigits: 2,
// 			})
// 			if (inputValue > balance) {
// 				Alert.alert(
// 					'Warning',
// 					`The input amount should not exceed the total due of ${newBal}`
// 				)
// 			} else {
// 				setTextInputFocused(true)
// 				setInputAmounts((prevState) => ({
// 					...prevState,
// 					[index]: {
// 						...prevState[index],
// 						[name]: value,
// 					},
// 				}))

// 				// Update the checkboxChecked state
// 				setCheckboxChecked((prevState) => ({
// 					...prevState,
// 					[index]: !!value, // Set to true if there is a value, otherwise false
// 				}))
// 			}
// 		}
// 	}

// 	const handleCheckout = () => {
// 		if (totalAmount.trim() === '' || totalAmount !== '0.00') {
// 			navigation.navigate(ROUTES.CHECKOUT, {
// 				name: item.Fullname,
// 				allData: item,
// 				inputAmounts: inputAmounts,
// 				total: parseFloat(totalValue),
// 			})
// 		} else {
// 			showInfo({
// 				message: 'Input Amount',
// 				description: 'Input the amount you want to pay for this collection.',
// 			})
// 		}
// 	}

// 	const calculateTotalValue = () => {
// 		let total = 0
// 		Object.values(inputAmounts).forEach((values) => {
// 			Object.values(values).forEach((value) => {
// 				if (value) {
// 					total += parseFloat(value)
// 				}
// 			})
// 		})
// 		setTotalValue(total)
// 	}

// 	const totalAmount = useMemo(() => {
// 		let total = 0
// 		Object.values(inputAmounts).forEach((values) => {
// 			Object.values(values).forEach((value) => {
// 				if (value) {
// 					total += parseFloat(value)
// 				}
// 			})
// 		})
// 		return total.toLocaleString('en-US', {
// 			minimumFractionDigits: 2,
// 			maximumFractionDigits: 2,
// 		})
// 	}, [inputAmounts])

// 	const { LName, FName, MName, SName } = item

// 	const Fullname = useMemo(() => {
// 		return [LName ? `${LName},` : '', FName ? FName : '', MName, SName]
// 			.filter(Boolean)
// 			.join(' ')
// 	}, [LName, FName, MName, SName])

// 	const renderItem = ({ item, index }) => {
// 		const a = parseFloat(item.PRINDUE)
// 		const b = parseFloat(item.INTDUE)
// 		const c = parseFloat(item.PENDUE)

// 		const total = a + b + c
// 		const formatNumber = (number) => {
// 			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
// 		}

// 		return (
// 			<CardReport02
// 				key={index}
// 				index={index}
// 				style={{
// 					flex: 1,
// 					width: width - 20,
// 					marginVertical: 10,
// 					marginHorizontal: 10,
// 				}}
// 				title={item.SLDESCR}
// 				description={item.REF_TARGET}
// 				placeholder='0.00'
// 				checkedBoxLabel='Amount'
// 				value={inputAmounts[item.REF_TARGET]?.SLDESCR || ''}
// 				onChangeText={(val) => {
// 					handleInputChange(item.REF_TARGET, 'SLDESCR', val)
// 				}}
// 				checkBoxEnabled={true}
// 				checkBox={!!checkboxChecked[index]}
// 				editable={!!checkboxChecked[index]}
// 				setCheckboxChecked={setCheckboxChecked}
// 				isActive={isCollapsed[index] ? 'angle-down' : 'angle-up'}
// 				enableTooltip={true}
// 				toggleAccordion={() => handleAccordionToggle(index)}
// 				isCollapsed={isCollapsed[index]}
// 				principal={formatNumber(item.PRINDUE)}
// 				interest={formatNumber(item.INTDUE)}
// 				penalty={formatNumber(item.PENDUE)}
// 				total={formatNumber(total.toFixed(2))}
// 			/>
// 		)
// 	}

// 	return (
// 		<SafeAreaView
// 			style={[BaseStyle.safeAreaView, { flex: 1 }]}
// 			edges={['right', 'top', 'left']}>
// 			<Header
// 				title='Account View'
// 				renderLeft={() => (
// 					<Icons.FontAwesome5
// 						name='angle-left'
// 						size={20}
// 						color={colors.text}
// 						enableRTL={true}
// 					/>
// 				)}
// 				onPressLeft={() => {
// 					navigation.goBack()
// 				}}
// 				renderRight={() => {
// 					return (
// 						<TouchableOpacity
// 							onPress={() =>
// 								navigation.navigate(ROUTES.OTHERSLSCREEN, {
// 									clientData: item,
// 								})
// 							}>
// 							<View className='items-center justify-center flex-row'>
// 								<Text className='text-center font-bold text-black dark:text-white mr-1'>
// 									Other SL
// 								</Text>
// 								<Icons.FontAwesome5
// 									name='angle-right'
// 									size={20}
// 									color={colors.text}
// 									enableRTL={true}
// 								/>
// 							</View>
// 						</TouchableOpacity>
// 					)
// 				}}
// 			/>

// 			<View className='mx-2 mb-2'>
// 				{item.isPaid ? (
// 					<TouchableOpacity
// 						onPress={() => {
// 							item.isPaid
// 								? Alert.alert(
// 										'This client is already paid',
// 										'Are you sure you want to unpaid this client?',
// 										[
// 											{
// 												text: 'Cancel',
// 												onPress: () => console.log('Cancel Pressed'),
// 												style: 'cancel',
// 											},
// 											{
// 												text: 'Yes',
// 												onPress: async () => {
// 													try {
// 														const realm = await Realm.open(databaseOptions)
// 														realm.write(() => {
// 															const existingClient = realm.objectForPrimaryKey(
// 																Client,
// 																item.ClientID
// 															)

// 															if (!existingClient) {
// 																Alert.alert('Error', 'Client not found!')
// 																return
// 															}

// 															// Update client properties
// 															existingClient.isPaid = false
// 															realm.create(
// 																Client,
// 																existingClient,
// 																Realm.UpdateMode.Modified
// 															)
// 														})

// 														Alert.alert('Success', 'Data updated successfully!')
// 														navigation.goBack()
// 													} catch (error) {
// 														Alert.alert('Error', 'Error updating data!')
// 														console.error('Error: ', error)
// 													}
// 												},
// 											},
// 										]
// 								  )
// 								: null
// 						}}>
// 						<View className='flex-row items-center justify-start'>
// 							<Image
// 								source={Images.complete}
// 								style={{ width: 20, height: 20 }}
// 							/>
// 							<Text
// 								title3
// 								body1
// 								className='text-xl font-bold text-black dark:text-white ml-2'>
// 								{Fullname}
// 							</Text>
// 						</View>
// 					</TouchableOpacity>
// 				) : (
// 					<Text
// 						title3
// 						body1
// 						className='text-xl font-bold text-black dark:text-white'>
// 						{Fullname}
// 					</Text>
// 				)}
// 			</View>

// 			<FlashList
// 				data={
// 					item &&
// 					item.collections &&
// 					item.collections.filter((collection) => collection.is_default === 1)
// 				}
// 				renderItem={renderItem}
// 				initialScrollIndex={0}
// 				keyExtractor={(item, index) => index.toString()}
// 				showsHorizontalScrollIndicator={false}
// 				showsVerticalScrollIndicator={false}
// 				estimatedItemSize={360}
// 			/>

// 			<View style={styles.container}>
// 				<View className=' h-9' style={styles.specifications}>
// 					<ProductSpecGrid
// 						style={{ flex: 1 }}
// 						title={totalAmount ? totalAmount : '0.00'}
// 						description={'Total Amount Due'}
// 						isEnable={false}
// 					/>
// 				</View>

// 				<View style={styles.buttonContainer}>
// 					<Button full onPress={handleCheckout}>
// 						Checkout
// 					</Button>
// 				</View>
// 			</View>
// 		</SafeAreaView>
// 	)
// }

// export default ViewScreen
