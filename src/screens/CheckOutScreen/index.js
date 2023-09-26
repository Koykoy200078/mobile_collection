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
import { ScrollView } from 'react-native-gesture-handler'
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

const CheckOutScreen = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	const [isCashChecked, setCashChecked] = useState(false)
	const [isCOCIChecked, setCOCIChecked] = useState(false)

	const [getUpload, setGetUpload] = useState([])

	const [referenceNumber, setReferenceNumber] = useState('')
	const [lastSavedIncrement, setLastSavedIncrement] = useState(null)

	const { getName, allData, inputAmounts, total } = route.params

	console.log('lastSavedIncrement: ', lastSavedIncrement)

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
	])

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
								TOP: isCashChecked ? 'CASH' : 'COCI',
								STATUS: 1, // 1 - Active, 4 - Cancelled, 5 - Disapproved
								is_default: collection.is_default,
							})
					}
				}
			})

			console.log(JSON.stringify(transformedData, null, 2))

			realm.write(() => {
				realm.create(UploadData, transformedData, Realm.UpdateMode.Modified)
			})

			transactionData()
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
			return null // Don't render if there's no matching inputAmount
		}
	})

	// function getCurrentDateFormatted() {
	// 	const today = new Date()
	// 	const year = today.getFullYear()
	// 	const month = String(today.getMonth() + 1).padStart(2, '0')
	// 	const day = String(today.getDate()).padStart(2, '0')
	// 	return `${year}${month}${day}`
	// }

	// const collectorId = allData.client_id

	// // Keep track of the incremental number using a variable outside the function
	// let incrementalNumber = 1

	// function generateIncrementalNumber() {
	// 	// Generate the incremental number with leading zeros to make it 7 digits long
	// 	const formattedIncrement = String(incrementalNumber).padStart(7, '0')

	// 	// Increment the variable for the next time
	// 	incrementalNumber++

	// 	return formattedIncrement
	// }

	// // Create the reference number
	// const currentDate = getCurrentDateFormatted()

	// // Calculate the total length so far
	// const totalLengthSoFar = currentDate.length + collectorId.length

	// // Calculate the remaining length required to reach a total length of 17
	// const remainingLength = 17 - totalLengthSoFar

	// // Pad the incremental number with leading zeros to reach the desired total length
	// const paddedIncrementalNumber = generateIncrementalNumber()

	// // Create the reference number by concatenating all components
	// const referenceNumber = `${currentDate}${collectorId}${paddedIncrementalNumber}`

	// // Now, referenceNumber contains your generated reference number with a total length of 17 characters
	// // console.log(referenceNumber)
	// console.log('referenceNumber: ', ReferenceNo())

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
