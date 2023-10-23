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
	useColorScheme,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { BaseStyle, Images, ROUTES, useTheme } from '../../../../app/config'
import styles from './styles'
import {
	Button,
	CardReport02,
	Header,
	ProductSpecGrid,
} from '../../../../app/components'
import { Icons } from '../../../../app/config/icons'
import databaseOptions, {
	Client,
	UploadData,
} from '../../../../app/database/allSchemas'
import { FloatingAction } from 'react-native-floating-action'
import { showInfo } from '../../../../app/components/AlertMessage'
import { FlashList } from '@shopify/flash-list'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ViewData = ({ navigation, route }) => {
	const isDarkMode = useColorScheme() === 'dark'
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	const [item, setItem] = useState('')

	const myData = item

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
	}, [isCollapsed, inputAmounts, visible, animation, textInputFocused, item])

	console.log('item: ', item)

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

	const totalDue =
		item &&
		item.collections
			.filter((col) => col.is_default === 1)
			.reduce((acc, data) => acc + parseFloat(data.ACTUAL_PAY), 0)

	const formatNumber = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

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

	const renderItem = ({ item, index }) => {
		return (
			<CardReport02
				key={index}
				index={index}
				style={{
					flex: 1,
					width: width - 20,
					marginVertical: 10,
					marginHorizontal: 10,
				}}
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
				onChangeText={(val) => {
					handleInputChange(item.REF_TARGET, 'SLDESCR', val)
				}}
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
				total={formatNumber(totalDue.toFixed(2))}
			/>
		)
	}

	let aa = item && item.COCI.map((item) => item.TYPE)

	return (
		<SafeAreaView
			style={[BaseStyle.safeAreaView, { flex: 1 }]}
			edges={['right', 'top', 'left']}>
			<Header
				title={`Account View`}
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
			<FlashList
				data={
					item &&
					item.collections &&
					item.collections.filter((collection) => collection.is_default === 1)
				}
				renderItem={renderItem}
				ListHeaderComponent={
					<View className='mx-2'>
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
					</View>
				}
				keyExtractor={(item, index) => index.toString()}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				estimatedItemSize={360}
				onScroll={handleScroll}
			/>
			{visible && (
				<Animated.View style={floatingActionStyle}>
					<FloatingAction
						dismissKeyboardOnPress={true}
						actions={actions}
						// visible={textInputRef.current && !textInputRef.current.isFocused()}
						onPressItem={(name) => {
							if (name === 'bt_SLAccounts') {
								navigation.navigate(ROUTES.OTHERSL, {
									clientData: item,
								})
							}
						}}
					/>
				</Animated.View>
			)}
			<View
				style={{
					padding: 15,
					paddingTop: 0,
				}}>
				<View
					className='h-14'
					style={{
						marginVertical: 10,
						flexDirection: 'column',
						alignItems: 'flex-start',
					}}>
					<View
						className='flex-row items-center justify-between'
						style={{ width: width / 1.1 }}>
						<View>
							<Text className='font-bold text-black dark:text-white text-base'>
								Ref No.
							</Text>
						</View>
						<View>
							<Text className='text-black dark:text-white'>{item.REF_NO}</Text>
						</View>
					</View>

					<View
						className='flex-row items-center justify-between'
						style={{ width: width / 1.1 }}>
						<View>
							<Text className='font-bold text-black dark:text-white text-base'>
								Payment Type
							</Text>
						</View>
						<View>
							<Text className='text-black dark:text-white'>
								{aa.toString()}
							</Text>
						</View>
					</View>

					<View
						className='flex-row items-center justify-between'
						style={{ width: width / 1.1 }}>
						<View>
							<Text className='font-bold text-black dark:text-white text-base'>
								Total Paid Amount
							</Text>
						</View>
						<View>
							<Text className='text-black dark:text-white'>
								{totalDue ? formatNumber(totalDue.toFixed(2)) : '0.00'}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default ViewData
