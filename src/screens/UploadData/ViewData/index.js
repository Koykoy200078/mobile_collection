import React, { useState, useEffect, useRef } from 'react'
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
	Keyboard,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { BaseStyle, Images, ROUTES, useTheme } from '../../../app/config'
import styles from './styles'
import {
	Button,
	CardReport02,
	Header,
	ProductSpecGrid,
} from '../../../app/components'
import { Icons } from '../../../app/config/icons'
import databaseOptions, { Client } from '../../../app/database/allSchemas'
import { FloatingAction } from 'react-native-floating-action'
import { showInfo } from '../../../app/components/AlertMessage'

const ViewData = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	const [item, setItem] = useState('')

	const [checkEnable, setCheckEnable] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState({})
	const [inputAmounts, setInputAmounts] = useState({})
	const [checkboxChecked, setCheckboxChecked] = useState({}) // Add this state

	const [totalValue, setTotalValue] = useState(0)

	const [textInputFocused, setTextInputFocused] = useState(false)

	const scrollY = new Animated.Value(0) // Animated value to track scroll position
	const [visible, setVisible] = useState(true) // State to track FloatingAction visibility
	const [animation, setAnimation] = useState(new Animated.Value(1))

	useEffect(() => {
		calculateTotalValue()
	}, [isCollapsed, inputAmounts, visible, animation, textInputFocused])

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

	useEffect(() => {
		if (route.params?.item) {
			setItem(route.params.item)
		}
	}, [route])

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				if (visible) {
					setVisible(false)
					Animated.timing(animation, {
						toValue: 0,
						duration: 300,
						useNativeDriver: false,
					}).start()
				}
			}
		)

		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				if (!visible && !textInputFocused) {
					setVisible(true)
					Animated.timing(animation, {
						toValue: 1,
						duration: 300,
						useNativeDriver: false,
					}).start()
				}
			}
		)

		return () => {
			keyboardDidShowListener.remove()
			keyboardDidHideListener.remove()
		}
	}, [visible, animation, textInputFocused])

	const actions = [
		{
			text: 'Other SL Accounts',
			icon: (
				<Icons.MaterialCommunityIcons
					name='draw-pen'
					size={25}
					color='#FFFFFF'
				/>
			),
			name: 'bt_SLAccounts',
			position: 1,
		},
	]

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: scrollY } } }],
		{ useNativeDriver: false }
	)

	scrollY.addListener((value) => {
		if ((value.value > 0 && visible) || textInputFocused) {
			setVisible(false)
			Animated.timing(animation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start()
		} else if (value.value <= 0 && !visible && !textInputFocused) {
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
				setTextInputFocused(true)
				setInputAmounts((prevState) => ({
					...prevState,
					[index]: {
						...prevState[index],
						[name]: value,
					},
				}))

				// Update the checkboxChecked state
				setCheckboxChecked((prevState) => ({
					...prevState,
					[index]: !!value, // Set to true if there is a value, otherwise false
				}))
			}
		}
	}

	const handleCheckout = () => {
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
				description: 'Input the amount you want to pay for this collection.',
			})
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

	const { LName, FName, MName, SName } = item
	const Fullname = [LName ? `${LName},` : '', FName ? FName : '', MName, SName]
		.filter(Boolean)
		.join(' ')

	return (
		<SafeAreaView
			style={[BaseStyle.safeAreaView, { flex: 1 }]}
			edges={['right', 'top', 'left']}>
			<Header
				title='Account View'
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
				renderRight={() =>
					item.isPaid ? (
						<Icons.Entypo name='check' size={20} color={'green'} />
					) : null
				}
				onPressRight={async () => {
					item.isPaid
						? Alert.alert(
								'This client is already paid',
								'Are you sure you want to unpaid this client?',
								[
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
														Client,
														item.ClientID
													)

													if (!existingClient) {
														Alert.alert('Error', 'Client not found!')
														return
													}

													// Update client properties
													existingClient.isPaid = false
													realm.create(
														Client,
														existingClient,
														Realm.UpdateMode.Modified
													)
												})

												Alert.alert('Success', 'Data updated successfully!')
												navigation.goBack()
											} catch (error) {
												Alert.alert('Error', 'Error updating data!')
												console.error('Error: ', error)
											}
										},
									},
								]
						  )
						: null
				}}
			/>

			<ScrollView
				contentContainerStyle={styles.container}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				scrollEventThrottle={16}
				onScroll={handleScroll}>
				<View key={item.id}>
					<Text
						title3
						body1
						className='text-xl font-bold text-black dark:text-white'>
						{item.isPaid && (
							<Image
								source={Images.complete}
								style={{ width: 20, height: 20 }}
							/>
						)}{' '}
						{Fullname}
					</Text>

					<View style={styles.specifications}>
						{item &&
							item.collections &&
							item.collections
								.filter((collection) => collection.is_default === 1)
								.map((collection, index) => {
									const a = parseFloat(collection.PRINDUE)
									const b = parseFloat(collection.INTDUE)
									const c = parseFloat(collection.PENDUE)

									const totalDue = item.collections
										.filter((col) => col.is_default === 1)
										.reduce((acc, data) => acc + parseFloat(data.ACTUAL_PAY), 0)

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
											value={collection.ACTUAL_PAY}
											onChangeText={(val) => {
												handleInputChange(collection.REF_TARGET, 'SLDESCR', val)
											}}
											checkBoxEnabled={true}
											checkBox={true}
											editable={false}
											setCheckboxChecked={setCheckboxChecked}
											isActive={isCollapsed[index] ? 'angle-down' : 'angle-up'}
											enableTooltip={true}
											toggleAccordion={() => handleAccordionToggle(index)}
											isCollapsed={isCollapsed[index]}
											principal={formatNumber(collection.PRINDUE)}
											interest={formatNumber(collection.INTDUE)}
											penalty={formatNumber(collection.PENDUE)}
											total={formatNumber(totalDue.toFixed(2))}
										/>
									)
								})}
					</View>
				</View>
			</ScrollView>

			{visible && (
				<Animated.View style={floatingActionStyle}>
					<FloatingAction
						dismissKeyboardOnPress={true}
						actions={actions}
						// visible={textInputRef.current && !textInputRef.current.isFocused()}
						onPressItem={(name) => {
							if (name === 'bt_SLAccounts') {
								navigation.navigate(ROUTES.OTHERSLSCREEN, {
									clientData: item,
								})
							}
						}}
					/>
				</Animated.View>
			)}

			<View style={styles.container}>
				<View className='h-9' style={styles.specifications}>
					<ProductSpecGrid
						style={{ flex: 1 }}
						title={totalAmount ? totalAmount : '0.00'}
						description={'Total Amount Due'}
						isEnable={false}
					/>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default ViewData
