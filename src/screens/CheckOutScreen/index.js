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
	const [isCOCIChecked, setCOCIChecked] = useState(false)
	const [checkNumber, setCheckNumber] = useState('')
	const [bankCode, setBankCode] = useState('')
	const [checkType, setCheckType] = useState('')
	const [clearingDays, setClearingDays] = useState('')

	const [dateOfCheck, setDateOfCheck] = useState('')
	const [open, setOpen] = useState(false)

	const [getUpload, setGetUpload] = useState([])

	const [referenceNumber, setReferenceNumber] = useState('')
	const [lastSavedIncrement, setLastSavedIncrement] = useState(null)

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
		checkAndShowData()
	}, [
		getName,
		allData,
		inputAmounts,
		total,
		isCashChecked,
		isCOCIChecked,
		referenceNumber,
		lastSavedIncrement,

		checkNumber,
		bankCode,
		checkType,
		clearingDays,
		dateOfCheck,
	])

	const formatDate = (date) => {
		const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
		return date.toLocaleDateString(undefined, options)
	}

	const handleCashCheckBox = () => {
		setCashChecked(true) // Toggle the value
		setCOCIChecked(false)
	}

	const handleCOCICheckBox = () => {
		setCOCIChecked(true) // Toggle the value
		setCashChecked(false)
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
		if (isCashChecked || isCOCIChecked) {
			if (isCOCIChecked) {
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
						message: 'COCI',
						description: 'Please complete the COCI details.',
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

			const transformedData = {
				branch_id: targetClient.branch_id,
				client_id: targetClient.client_id,
				FName: targetClient.FName,
				LName: targetClient.LName,
				MName: targetClient.MName,
				SName: targetClient.SName,
				REF_NO: lastSavedIncrement ? lastSavedIncrement : referenceNumber,
				collections: [],
			}

			targetClient.collections.forEach((collection) => {
				const inputAmount = inputAmounts[collection.ID]
				const matchingItem = allData.collections.find(
					(item) => item.ID === collection.ID
				)

				if (matchingItem && inputAmount) {
					const amount = inputAmount.AMOUNT

					// Check if the collection already exists in transformedData
					const existingCollection = transformedData.collections.find(
						(item) => item.ID === collection.ID
					)

					if (existingCollection) {
						// Update the existing collection with the payment amount
						existingCollection.ACTUAL_PAY = amount
					} else {
						// Create a new collection entry in transformedData
						amount.length > 0 &&
							transformedData.collections.push({
								ID: collection.ID,
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
								TOP: isCashChecked
									? [
											{
												TYPE: 'CASH',
												AMOUNT: amount,
											},
									  ]
									: [
											{
												TYPE: 'CHECK',
												AMOUNT: amount,
												CHECK_NUMBER: parseInt(checkNumber),
												BANK_CODE: bankCode,
												CHECK_TYPE: checkType,
												CLEARING_DAYS: clearingDays,
												DATE_OF_CHECK: dateOfCheck,
											},
									  ],
								STATUS: 1, // 1 - Active, 4 - Cancelled, 5 - Disapproved
								is_default: collection.is_default,
							})
					}
				}
			})

			console.log(JSON.stringify(transformedData, null, 2))

			// realm.write(() => {
			// 	realm.create(UploadData, transformedData, Realm.UpdateMode.Modified)
			// })

			// transactionData()
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
				Alert.alert('Error', 'An unexpected error occurred.')
			} else {
				navigation.navigate(ROUTES.PRINTOUT, {
					getName: getName,
					allData: allData,
					inputAmounts: inputAmounts,
					total: total,
					refNo: lastSavedIncrement ? lastSavedIncrement : referenceNumber,
					isSuccessful: true,
				})
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
									title='COCI (Check and Other Cash Items)'
									checked={isCOCIChecked}
									color={colors.primary}
									style={{ flex: 1 }}
									onPress={handleCOCICheckBox}
								/>

								{isCOCIChecked && (
									<View className='mt-2'>
										<Text className='text-black font-bold text-base'>
											Check Number:
										</Text>
										<TextInput
											placeholder='Enter check number'
											keyboardType='numeric'
											onChangeText={(text) => setCheckNumber(text)}
										/>

										<Text className='text-black font-bold text-base'>
											Bank Code:
										</Text>
										<TextInput
											placeholder='Enter bank code'
											onChangeText={(text) => setBankCode(text)}
										/>

										<Text className='text-black font-bold text-base'>
											Check Type:
										</Text>
										<Dropdown
											data={data}
											placeholder='--- Select Check Type ---'
											value={checkType}
											labelField='ChkTypeDesc'
											valueField='ChkTypeID'
											maxHeight={100}
											onChange={(item) => {
												setCheckType(item.ChkTypeID)
											}}
										/>

										<Text className='text-black font-bold text-base'>
											Clearing Days:
										</Text>
										<Dropdown
											data={data}
											placeholder='--- Select Clearing Days ---'
											value={clearingDays}
											labelField='ChkTypeDays'
											valueField='ChkTypeDays'
											maxHeight={100}
											onChange={(item) => {
												setClearingDays(item.ChkTypeDays)
											}}
										/>

										<Text className='text-black font-bold text-base'>
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
											theme='auto'
											open={open}
											date={today}
											maximumDate={today}
											onConfirm={(selectedDate) => {
												setOpen(false)
												// setDate(selectedDate)
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
