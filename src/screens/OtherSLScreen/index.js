import React, { useState, useEffect, useRef, useMemo } from 'react'
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
import { BaseStyle, Images, ROUTES, useTheme } from '../../app/config'
import styles from './styles'
import {
	Button,
	CardReport02,
	Header,
	ProductSpecGrid,
} from '../../app/components'
import { Icons } from '../../app/config/icons'
import databaseOptions, { Client } from '../../app/database/allSchemas'
import { FloatingAction } from 'react-native-floating-action'
import { showInfo } from '../../app/components/AlertMessage'
import { FlashList } from '@shopify/flash-list'
import { TouchableOpacity } from 'react-native-gesture-handler'

const OtherSLScreen = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()

	const { clientData, clientName, getInputAmounts, getTotal } = route.params
	const item = clientData

	const [isCollapsed, setIsCollapsed] = useState({})
	const [inputAmounts, setInputAmounts] = useState(getInputAmounts || {})
	const [checkboxChecked, setCheckboxChecked] = useState({})

	const [totalValue, setTotalValue] = useState(0)

	const [textInputFocused, setTextInputFocused] = useState(false)

	const [visible, setVisible] = useState(true)
	const [animation, setAnimation] = useState(new Animated.Value(1))

	const Fullname = useMemo(() => {
		return [
			clientData.LName ? `${clientData.LName},` : '',
			clientData.FName ? clientData.FName : '',
			clientData.MName,
			clientData.SName,
		]
			.filter(Boolean)
			.join(' ')
	}, [clientData])

	useEffect(() => {
		calculateTotalValue()
	}, [isCollapsed, inputAmounts, textInputFocused, route])

	console.log('inputAmounts: ', inputAmounts)

	useEffect(() => {
		const initialIsCollapsed = {}
		if (item && item.collections && item.collections.length > 0) {
			item.collections.forEach((_, index) => {
				initialIsCollapsed[index] = true
			})
		}
		setIsCollapsed(initialIsCollapsed)
	}, [item])

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
	}, [textInputFocused, visible, animation])

	const handleAccordionToggle = (index) => {
		setIsCollapsed((prevState) => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	const handleInputChange = (id, slc, refTarget, name, value) => {
		const collection = item.collections.find((c) => c.ID === id)

		if (!collection) {
			return
		}

		const balance = parseFloat(collection.TOTALDUE)
		const inputValue = parseFloat(value)

		const newBal = balance.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})

		if (slc === 12 || slc === 33) {
			if (inputValue > balance) {
				Alert.alert(
					'Warning',
					`The input amount should not exceed the total due of ${newBal}`
				)
				return
			} else {
				setTextInputFocused(true)
			}
		} else {
			setTextInputFocused(true)
		}

		const updatedInputAmounts = {
			...inputAmounts,
			[id]: {
				...inputAmounts[id],
				ID: id,
				[name]: value,
			},
		}

		const updatedCheckboxChecked = {
			...checkboxChecked,
			[id]: !!value,
		}

		setInputAmounts(updatedInputAmounts)
		setCheckboxChecked(updatedCheckboxChecked)
	}

	const handleCheckout = () => {
		if (totalAmount.trim() === '' || totalAmount !== '0.00') {
			navigation.navigate(ROUTES.CHECKOUT, {
				getName: Fullname,
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

	const renderItem = ({ item }) => {
		const a = parseFloat(item.PRINDUE)
		const b = parseFloat(item.INTDUE)
		const c = parseFloat(item.PENDUE)

		const total = a + b + c
		const formatNumber = (number) => {
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		}

		return (
			<CardReport02
				key={item.ID}
				index={item.ID}
				style={{
					flex: 1,
					width: width - 20,
					marginVertical: 10,
					marginHorizontal: 10,
				}}
				title={item.SLDESCR}
				description={item.REF_TARGET}
				placeholder='0.00'
				checkedBoxLabel='Amount'
				value={
					inputAmounts[item.REF_TARGET]?.AMOUNT || inputAmounts[item.ID]?.AMOUNT
				}
				onChangeText={(val) => {
					handleInputChange(item.ID, item.SLC, item.REF_TARGET, 'AMOUNT', val)
				}}
				checkBoxEnabled={true}
				checkBox={!!checkboxChecked[item.ID]}
				editable={!!checkboxChecked[item.ID]}
				setCheckboxChecked={setCheckboxChecked}
				isActive={isCollapsed[item.ID] ? 'angle-down' : 'angle-up'}
				enableTooltip={item.SLC === 12 || item.SLC === 33 ? true : false}
				toggleAccordion={() => handleAccordionToggle(item.ID)}
				isCollapsed={isCollapsed[item.ID]}
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
			<Header
				title='Other SL'
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
				<View className=' h-9' style={styles.specifications}>
					<ProductSpecGrid
						style={{ flex: 1 }}
						title={totalAmount ? totalAmount : '0.00'}
						description={'Total Amount Due'}
						isEnable={false}
					/>
				</View>

				<View style={styles.buttonContainer}>
					<Button full onPress={handleCheckout}>
						Checkout
					</Button>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default OtherSLScreen
