import React, { useState, useEffect, useCallback } from 'react'
import {
	View,
	Text,
	useWindowDimensions,
	Alert,
	TouchableOpacity,
} from 'react-native'
import {
	Button,
	CardReport02,
	CheckBox,
	Header,
	ProductSpecGrid,
} from '../../app/components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BaseStyle, ROUTES, useTheme } from '../../app/config'
import { Icons } from '../../app/config/icons'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import styles from './styles'
import databaseOptions, {
	Client,
	UploadData,
	updateClient,
	uploadSchema,
} from '../../app/database/allSchemas'
import Realm from 'realm'
import { showInfo } from '../../app/components/AlertMessage'
import ReferenceNo from '../../app/config/ReferenceNo'

import { Dropdown } from 'react-native-element-dropdown'
import DatePicker from 'react-native-date-picker'

const CheckOutScreen = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	const [isCashChecked, setCashChecked] = useState(false)
	const [isCheck, setIsCheck] = useState(false)

	const [isCashCheck, setCashCheck] = useState(false)
	const [cashTotal, setCashTotal] = useState('')
	const [checkTotal, setCheckTotal] = useState('')

	const [checkNumber, setCheckNumber] = useState('')
	const [bankCode, setBankCode] = useState('')
	const [checkType, setCheckType] = useState('')
	const [clearingDays, setClearingDays] = useState('')

	const [dateOfCheck, setDateOfCheck] = useState('')
	const [open, setOpen] = useState(false)

	const [getUpload, setGetUpload] = useState([])

	const [referenceNumber, setReferenceNumber] = useState('')
	const [lastSavedIncrement, setLastSavedIncrement] = useState(null)

	const [isNavSuccess, setNavSuccess] = useState(false)
	const [passToPrint, setPassToPrint] = useState()

	// Calculate today's date
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const { getName, allData, inputAmounts, total } = route.params

	const data = [
		{ ChkTypeID: '1', ChkTypeDesc: 'Local', ChkTypeDays: '2' },
		{ ChkTypeID: '2', ChkTypeDesc: 'Regional', ChkTypeDays: '7' },
		{ ChkTypeID: '3', ChkTypeDesc: 'Out of Town', ChkTypeDays: '15' },
		{ ChkTypeID: '4', ChkTypeDesc: 'Foreign', ChkTypeDays: '45' },
		{ ChkTypeID: '5', ChkTypeDesc: 'On Us', ChkTypeDays: '0' },
		{ ChkTypeID: '6', ChkTypeDesc: 'Good Check', ChkTypeDays: '0' },
	]

	useEffect(() => {
		if (isNavSuccess) {
			navigation.navigate(ROUTES.PRINTOUT, {
				getName: getName,
				allData: allData,
				inputAmounts: inputAmounts,
				total: total,
				refNo: lastSavedIncrement ? lastSavedIncrement : referenceNumber,
				isSuccessful: true,
				dataToPrint: passToPrint,
			})
		}
	}, [isCashCheck, cashTotal, checkTotal, isNavSuccess])

	useEffect(() => {
		checkAndShowData()
	}, [
		getName,
		allData,
		inputAmounts,
		total,
		isCashChecked,
		isCheck,

		isCashCheck,
		cashTotal,
		checkTotal,

		referenceNumber,
		lastSavedIncrement,

		checkNumber,
		bankCode,
		checkType,
		clearingDays,
		dateOfCheck,

		passToPrint,
	])

	const formatDate = (date) => {
		const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
		return date.toLocaleDateString(undefined, options)
	}

	const handleCashCheckBox = () => {
		setCashChecked(true) // Toggle the value
		setIsCheck(false)
		setCashCheck(false)

		setCheckNumber('')
		setBankCode('')
		setCheckType('')
		setClearingDays('')
		setDateOfCheck('')
	}

	const handleCheckCheckBox = () => {
		setIsCheck(true) // Toggle the value
		setCashChecked(false)
		setCashCheck(false)

		setCashTotal('')
		setCheckNumber('')
		setBankCode('')
		setCheckType('')
		setClearingDays('')
		setDateOfCheck('')
	}

	const handleCashCheck = () => {
		setCashCheck(true)
		setCashChecked(false)
		setIsCheck(false)

		setCashTotal('')
		setCheckNumber('')
		setBankCode('')
		setCheckType('')
		setClearingDays('')
		setDateOfCheck('')
	}

	// Function to set the reference number received from the child component
	function handleReferenceNumber(reference) {
		setReferenceNumber(reference)
	}

	const checkAndShowData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const uploadData = realm.objects(UploadData)

			if (uploadData.length > 0) {
				setGetUpload(Array.from(uploadData))
			} else {
				setGetUpload(0)
			}
		} catch (error) {
			Alert.alert('Error retrieving data: ', error)
			console.error(error)
		}
	}, [])

	const updateData = async () => {
		if (isCashChecked || isCheck || isCashCheck) {
			if (isCheck) {
				if (
					checkNumber.length > 0 &&
					bankCode.length > 0 &&
					checkType.length > 0 &&
					clearingDays.length > 0 &&
					dateOfCheck.length > 0
				) {
					Alert.alert('Confirmation', 'Would you like to save the new data?', [
						{
							text: 'Cancel',
							onPress: () => {
								if (lastSavedIncrement !== null) {
									// Revert to the last saved increment if available
									setReferenceNumber(lastSavedIncrement)
								}
							},
						},
						{
							text: 'Yes',
							onPress: async () => {
								await saveNewData(referenceNumber)
								setLastSavedIncrement(referenceNumber)
							},
						},
					])
				} else {
					showInfo({
						message: 'CHECK',
						description: 'Please complete the CHECK details.',
					})
				}
			} else if (isCashChecked) {
				Alert.alert('Confirmation', 'Would you like to save the new data?', [
					{
						text: 'Cancel',
						onPress: () => {
							if (lastSavedIncrement !== null) {
								// Revert to the last saved increment if available
								setReferenceNumber(lastSavedIncrement)
							}
						},
					},
					{
						text: 'Yes',
						onPress: async () => {
							await saveNewData(referenceNumber)
							setLastSavedIncrement(referenceNumber)
						},
					},
				])
			} else if (isCashCheck) {
				if (
					cashTotal.length > 0 &&
					checkNumber.length > 0 &&
					bankCode.length > 0 &&
					checkType.length > 0 &&
					clearingDays.length > 0 &&
					dateOfCheck.length > 0
				) {
					Alert.alert('Confirmation', 'Would you like to save the new data?', [
						{
							text: 'Cancel',
							onPress: () => {
								if (lastSavedIncrement !== null) {
									// Revert to the last saved increment if available
									setReferenceNumber(lastSavedIncrement)
								}
							},
						},
						{
							text: 'Yes',
							onPress: async () => {
								const totalPaid = Number(total)
								const cash = Number(cashTotal)
								const check = Number(checkTotal)

								if (totalPaid !== cash + check) {
									showInfo({
										message: 'Payment Alert',
										description:
											'The total amount paid must be the exact sum of the cash and check total amount combined.',
									})
								} else {
									await saveNewData(referenceNumber)
									setLastSavedIncrement(referenceNumber)
								}
								// await saveNewData(referenceNumber)
								// setLastSavedIncrement(referenceNumber)
							},
						},
					])
				} else {
					showInfo({
						message: 'CASH & CHECK',
						description: 'Please complete the CASH & CHECK details.',
					})
				}
			}
		} else {
			showInfo({
				message: 'Type of Payment',
				description: 'Please select a type of payment.',
			})
		}
	}

	const saveNewData = async () => {
		const realm = await Realm.open(databaseOptions)
		try {
			const targetClient = realm
				.objects(Client)
				.filtered(
					'client_id = $0 AND collections.@size > 0',
					allData.client_id
				)[0]

			if (!targetClient) {
				console.log(
					`Client with client_id ${allData.client_id} not found or has no collections.`
				)
				realm.close()
				return
			}

			realm.write(() => {
				// Fetch existing data
				let existingData = realm
					.objects(UploadData)
					.filtered('client_id = $0', targetClient.client_id)

				if (existingData.length === 0) {
					existingData = {
						branch_id: targetClient.branch_id,
						client_id: targetClient.client_id,
						FName: targetClient.FName,
						LName: targetClient.LName,
						MName: targetClient.MName,
						SName: targetClient.SName,
						REF_NO: lastSavedIncrement ? lastSavedIncrement : referenceNumber,
						status: 1, // 1 - Active, 4 - Cancelled, 5 - Disapproved
						collections: [],
						COCI: [], // Add the COCI field here
					}
				} else {
					// If existing data, use the first object
					existingData = existingData[0]
				}

				targetClient.collections.forEach((collection) => {
					const inputAmount = inputAmounts[collection.ID]
					const matchingItem = allData.collections.find(
						(item) => item.ID === collection.ID
					)

					if (matchingItem && inputAmount) {
						const amount = inputAmount.AMOUNT

						// Check if the collection already exists in transformedData
						const existingCollection = existingData.collections.find(
							(item) => item.ID === collection.ID
						)

						if (existingCollection) {
							const updatedCollection = {
								...existingCollection,
								ACTUAL_PAY: amount,
							}

							// Find the index of the existingCollection in the collections array
							const index = existingData.collections.findIndex(
								(item) => item.ID === collection.ID
							)

							// Replace the existingCollection with the updatedCollection
							if (index !== -1) {
								existingData.collections[index] = updatedCollection
							}
						} else {
							// Create a new collection entry in transformedData
							amount.length > 0 &&
								existingData.collections.push({
									// ID: collection.ID,
									BRCODE: collection.BRCODE,
									SLC: collection.SLC,
									SLT: collection.SLT,
									REF: collection.REF,
									SLDESCR: matchingItem.SLDESCR,
									REF_TARGET: collection.REF_TARGET,
									REF_SOURCE: collection.REF_SOURCE,
									PRINCIPAL: collection.PRINCIPAL,
									BALANCE: collection.BALANCE,
									PRINDUE: collection.PRINDUE,
									INTDUE: collection.INTDUE,
									PENDUE: collection.PENDUE,
									INSDUE: collection.INSDUE,
									TOTALDUE: collection.TOTALDUE,
									ACTUAL_PAY: amount,
									is_default: collection.is_default,
								})
						}

						const COCI = []
						const getTotal = total.toString()
						if (isCashChecked) {
							// Add COCI data for CASH
							COCI.push({
								TYPE: 'CASH',
								AMOUNT: getTotal,
							})
						}
						if (isCheck) {
							// Add COCI data for CHECK
							COCI.push({
								TYPE: 'CHECK',
								AMOUNT: getTotal,
								CHECK_NUMBER: parseInt(checkNumber),
								BANK_CODE: bankCode,
								CHECK_TYPE: checkType,
								CLEARING_DAYS: clearingDays,
								DATE_OF_CHECK: dateOfCheck,
							})
						}
						if (isCashCheck) {
							// Add COCI data for CASH and CHECK combined
							COCI.push({
								TYPE: 'CASH',
								AMOUNT: cashTotal,
							})
							COCI.push({
								TYPE: 'CHECK',
								AMOUNT: checkTotal,
								CHECK_NUMBER: parseInt(checkNumber),
								BANK_CODE: bankCode,
								CHECK_TYPE: checkType,
								CLEARING_DAYS: clearingDays,
								DATE_OF_CHECK: dateOfCheck,
							})
						}

						// Set the COCI array in existingData
						existingData.COCI = COCI
					}
				})

				setPassToPrint(existingData)
				realm.create(UploadData, existingData, 'modified')
			})

			await transactionData()
		} catch (error) {
			Alert.alert(
				'Error',
				'An error occurred while updating the data. Please try again later.'
			)
			console.error('Error: ', error)
		}
	}

	const transactionData = async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			realm.write(() => {
				const existingClient = realm.objectForPrimaryKey(
					Client,
					allData.client_id
				)

				if (!existingClient) {
					Alert.alert('Error', 'The client could not be found.')
					return
				}
				existingClient.isPaid = true
				realm.create(Client, existingClient, Realm.UpdateMode.Modified)
			})

			Alert.alert('Success', 'The data has been updated successfully.')
		} catch (error) {
			Alert.alert(
				'Error',
				'An error occurred while updating the data. Please try again later.'
			)
			console.error('Error: ', error)
		} finally {
			if (
				inputAmounts === null &&
				inputAmounts === undefined &&
				inputAmounts === '' &&
				inputAmounts === 0
			) {
				setNavSuccess(false)
				Alert.alert('Error', 'An unexpected error occurred.')
			} else {
				setNavSuccess(true)
			}
		}
	}

	const totalAmount = total.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const renderedItem = allData.collections.map((collection) => {
		const matchingInputAmount = inputAmounts[collection.ID]

		if (matchingInputAmount && matchingInputAmount.AMOUNT.length > 0) {
			const { AMOUNT } = matchingInputAmount
			let getAMNT = parseFloat(AMOUNT).toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
			return (
				<View key={collection.ID}>
					<CardReport02
						style={{ flex: 1, width: width - 30, marginVertical: 10 }}
						title={collection.SLDESCR}
						description={collection.REF_TARGET}
						checkedBoxLabel='Total Amount Paid'
						value={getAMNT}
						editable={false}
					/>
				</View>
			)
		} else {
			return null
		}
	})

	return (
		<SafeAreaView
			style={[BaseStyle.safeAreaView, { flex: 1 }]}
			edges={['right', 'top', 'left']}>
			<Header
				title=''
				renderLeft={() => {
					return (
						<View className='flex-row items-center space-x-2 w-[100]'>
							<Icons.FontAwesome5
								name='angle-left'
								size={20}
								color={colors.text}
								enableRTL={true}
							/>

							<Text
								title3
								body1
								className='text-xl font-bold text-black dark:text-white'>
								Back
							</Text>
						</View>
					)
				}}
				onPressLeft={() => {
					navigation.goBack()
				}}
			/>

			<ScrollView
				contentContainerStyle={styles.container}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}>
				<View>
					<Text
						title3
						body1
						className='text-xl font-bold text-center text-black dark:text-white'>
						Review Selected Account
					</Text>

					{renderedItem}

					<View style={styles.specifications}>
						<ProductSpecGrid
							style={{ flex: 1 }}
							title={totalAmount ? totalAmount : '0.00'}
							description={'Total Amount Paid'}
							isEnable={false}
						/>
					</View>

					<View style={styles.specifications}>
						<View className='space-y-2 rounded-md p-2'>
							<Text className='text-black font-bold text-base'>
								Type of Payment
							</Text>
							<View>
								<CheckBox
									title='CASH'
									checked={isCashChecked}
									color={colors.primary}
									style={{ flex: 1 }}
									onPress={handleCashCheckBox}
								/>
							</View>
							<View>
								<CheckBox
									title='CHECK'
									checked={isCheck}
									color={colors.primary}
									style={{ flex: 1 }}
									onPress={handleCheckCheckBox}
								/>
							</View>

							{/* Option 3 */}
							<View
								style={{
									width: width,
								}}>
								<CheckBox
									title='CASH & CHECK'
									checked={isCashCheck}
									color={colors.primary}
									style={{ flex: 1 }}
									onPress={handleCashCheck}
								/>

								{isCashCheck && (
									<View className='mt-2'>
										<Text className='text-black dark:text-white font-bold text-base'>
											Cash Amount:
										</Text>
										<TextInput
											placeholder='Enter cash amount'
											keyboardType='numeric'
											onChangeText={(text) => setCashTotal(text)}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Check Amount:
										</Text>
										<TextInput
											placeholder='Enter cash amount'
											keyboardType='numeric'
											onChangeText={(text) => setCheckTotal(text)}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Check Number:
										</Text>
										<TextInput
											placeholder='Enter check number'
											keyboardType='numeric'
											onChangeText={(text) => setCheckNumber(text)}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Bank:
										</Text>
										<TextInput
											placeholder='Enter bank'
											onChangeText={(text) => setBankCode(text)}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Check Type:
										</Text>
										<Dropdown
											data={data}
											placeholder='--- Select Check Type ---'
											value={checkType}
											labelField='ChkTypeDesc'
											valueField='ChkTypeID'
											maxHeight={200}
											onChange={(item) => {
												setCheckType(item.ChkTypeID)
											}}
											itemTextStyle={{ color: '#000000' }}
											containerStyle={{
												borderBottomLeftRadius: 10,
												borderBottomRightRadius: 10,
											}}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Clearing Days:
										</Text>
										<Dropdown
											data={data}
											placeholder='--- Select Clearing Days ---'
											value={clearingDays}
											labelField='ChkTypeDays'
											valueField='ChkTypeDays'
											maxHeight={200}
											onChange={(item) => {
												setClearingDays(item.ChkTypeDays)
											}}
											itemTextStyle={{ color: '#000000' }}
											containerStyle={{
												borderBottomLeftRadius: 10,
												borderBottomRightRadius: 10,
											}}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Date of Check:
										</Text>
										<TouchableOpacity onPress={() => setOpen(true)}>
											<View>
												{dateOfCheck.length > 0 ? (
													<Text>{dateOfCheck}</Text>
												) : (
													<Text className='text-base'>--- Select date ---</Text>
												)}
											</View>
										</TouchableOpacity>

										<DatePicker
											modal
											mode='date'
											theme='light'
											open={open}
											date={today}
											onConfirm={(selectedDate) => {
												setOpen(false)
												setDateOfCheck(formatDate(selectedDate))
											}}
											onCancel={() => {
												setOpen(false)
											}}
										/>
									</View>
								)}

								{isCheck && (
									<View className='mt-2'>
										<Text className='text-black dark:text-white font-bold text-base'>
											Check Number:
										</Text>
										<TextInput
											placeholder='Enter check number'
											keyboardType='numeric'
											onChangeText={(text) => setCheckNumber(text)}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Bank:
										</Text>
										<TextInput
											placeholder='Enter bank'
											onChangeText={(text) => setBankCode(text)}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Check Type:
										</Text>
										<Dropdown
											data={data}
											placeholder='--- Select Check Type ---'
											value={checkType}
											labelField='ChkTypeDesc'
											valueField='ChkTypeID'
											maxHeight={200}
											onChange={(item) => {
												setCheckType(item.ChkTypeID)
											}}
											itemTextStyle={{ color: '#000000' }}
											containerStyle={{
												borderBottomLeftRadius: 10,
												borderBottomRightRadius: 10,
											}}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Clearing Days:
										</Text>
										<Dropdown
											data={data}
											placeholder='--- Select Clearing Days ---'
											value={clearingDays}
											labelField='ChkTypeDays'
											valueField='ChkTypeDays'
											maxHeight={200}
											onChange={(item) => {
												setClearingDays(item.ChkTypeDays)
											}}
											itemTextStyle={{ color: '#000000' }}
											containerStyle={{
												borderBottomLeftRadius: 10,
												borderBottomRightRadius: 10,
											}}
										/>

										<Text className='text-black dark:text-white font-bold text-base'>
											Date of Check:
										</Text>
										<TouchableOpacity onPress={() => setOpen(true)}>
											<View>
												{dateOfCheck.length > 0 ? (
													<Text>{dateOfCheck}</Text>
												) : (
													<Text className='text-base'>--- Select date ---</Text>
												)}
											</View>
										</TouchableOpacity>

										<DatePicker
											modal
											mode='date'
											theme='light'
											open={open}
											date={today}
											onConfirm={(selectedDate) => {
												setOpen(false)
												setDateOfCheck(formatDate(selectedDate))
											}}
											onCancel={() => {
												setOpen(false)
											}}
										/>
									</View>
								)}
							</View>
						</View>
					</View>

					<View className='p-[10]'>
						<View style={styles.specifications}>
							<Button
								full
								onPress={() => {
									updateData()
								}}>
								Proceed to Payment
							</Button>

							<ReferenceNo
								onReferenceNumberChange={handleReferenceNumber}
								collectorId={allData.client_id}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default CheckOutScreen
