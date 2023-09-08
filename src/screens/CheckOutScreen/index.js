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

const CheckOutScreen = ({ navigation, route }) => {
	const { width } = useWindowDimensions()
	const { colors } = useTheme()
	const [data, setData] = useState([])
	const { name, allData, inputAmounts, total } = route.params

	const [isCashChecked, setCashChecked] = useState(false)
	const [isCOCIChecked, setCOCIChecked] = useState(false)

	useEffect(() => {}, [
		name,
		allData,
		inputAmounts,
		total,
		data,
		isCashChecked,
		isCOCIChecked,
	])

	const handleCashCheckBox = () => {
		setCashChecked(true) // Toggle the value
		setCOCIChecked(false)
	}

	const handleCOCICheckBox = () => {
		setCOCIChecked(true) // Toggle the value
		setCashChecked(false)
	}

	const totalAmount = total.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const renderedItem = Object.keys(inputAmounts)
		.map((refNo) => {
			const { REF_TARGET, SLDESCR, DEPOSIT, SHARECAPITAL } = inputAmounts[refNo]

			const matchingItem = allData.collections.find(
				(item) => item.REF_TARGET === refNo
			)

			if (!matchingItem) {
				return null
			}

			if (!REF_TARGET && !SLDESCR && !DEPOSIT && !SHARECAPITAL) {
				return null
			}

			return (
				<View key={refNo}>
					{REF_TARGET ? (
						<CardReport02
							style={{ flex: 1, width: width - 30, marginVertical: 10 }}
							title={matchingItem.REF_TARGET}
							description={refNo}
							checkedBoxLabel='Total Amount Paid'
							value={REF_TARGET}
							editable={false}
						/>
					) : null}

					{SLDESCR ? (
						<CardReport02
							style={{ flex: 1, width: width - 30, marginVertical: 10 }}
							title={matchingItem.SLDESCR}
							description={refNo}
							checkedBoxLabel='Total Amount Paid'
							value={SLDESCR}
							editable={false}
						/>
					) : null}

					{SHARECAPITAL ? (
						<CardReport02
							style={{ flex: 1, width: width - 30, marginVertical: 10 }}
							title='Share Capital'
							description={refNo}
							checkedBoxLabel='Total Amount Paid'
							value={SHARECAPITAL}
							editable={false}
						/>
					) : null}

					{DEPOSIT ? (
						<CardReport02
							style={{ flex: 1, width: width - 30, marginVertical: 10 }}
							title='Deposit'
							description={refNo}
							checkedBoxLabel='Total Amount Paid'
							value={DEPOSIT}
							editable={false}
						/>
					) : null}
				</View>
			)
		})
		.filter(Boolean)

	const updateData = async () => {
		if (isCashChecked || isCOCIChecked) {
			Alert.alert('Confirmation', 'Would you like to save the new data?', [
				{
					text: 'Cancel',
					onPress: () => null,
					style: 'cancel',
				},
				{
					text: 'Yes',
					onPress: async () => {
						await saveNewData()
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
				TOP: isCashChecked ? 'CASH' : 'COCI',

				collections: [],
			}

			targetClient.collections.forEach((collection) => {
				const refNo = collection.REF_TARGET
				const inputAmount = inputAmounts[refNo]
				const matchingItem = allData.collections.find(
					(item) => item.REF_TARGET === refNo
				)

				if (matchingItem && inputAmount) {
					const amount = inputAmount.SLDESCR

					const existingCollection = transformedData.collections.find(
						(item) => item.REF_TARGET === refNo
					)

					if (existingCollection) {
						// Update existing collection
						existingCollection.ACTUAL_PAY = amount
						// You can update other fields here if needed
					} else {
						// Add a new collection entry
						transformedData.collections.push({
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
							REMARKS: 'OK',
							is_default: 1,
						})
					}
				}
			})

			// console.log(JSON.stringify(transformedData, null, 2))
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

				// Update client properties
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
					name: name,
					allData: allData,
					inputAmounts: inputAmounts,
					total: total,
					isSuccessful: true,
				})
			}
		}
	}

	// const showData = useCallback(async () => {
	//   try {
	//     const realm = await Realm.open(databaseOptions);
	//     const savedData = realm.objects(UploadData);
	//     const data = Array.from(savedData); // Convert Realm results to a regular array
	//     console.log('Saved Data:', JSON.stringify(data, null, 2));
	//     realm.close(); // Close the Realm after use
	//   } catch (error) {
	//     console.error('Error while fetching data:', error);
	//     return null;
	//   }
	// }, []);

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
							<Button full onPress={() => updateData()}>
								Proceed to Payment
							</Button>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default CheckOutScreen
