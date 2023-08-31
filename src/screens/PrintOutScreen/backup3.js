// import { View, Text, NativeModules } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import styles from './styles'
// import { Button } from '../../app/components'
// import { imageUri } from './imageUri'
// import { ROUTES } from '../../app/config'

// import { ScrollView } from 'react-native-gesture-handler'

// const iMinPrinter = NativeModules.IminPrinter

// const PrintOutScreen = ({ navigation, route }) => {
// 	const [data, setData] = useState(null)
// 	const [selectedPrinter, setSelectedPrinter] = useState(null)

// 	const logoUri = 'data:image/png;base64,' + imageUri.data

// 	const currentDate = new Date()

// 	const day = currentDate.getDate()
// 	const monthIndex = currentDate.getMonth()
// 	const year = currentDate.getFullYear()
// 	const hour = currentDate.getHours()
// 	const minute = currentDate.getMinutes()
// 	const ampm = hour >= 12 ? 'PM' : 'AM'

// 	const monthNames = [
// 		'January',
// 		'February',
// 		'March',
// 		'April',
// 		'May',
// 		'June',
// 		'July',
// 		'August',
// 		'September',
// 		'October',
// 		'November',
// 		'December',
// 	]

// 	const formattedHour = hour % 12 === 0 ? 12 : hour % 12 // Convert hour to 12-hour format
// 	const formattedMinute = minute.toString().padStart(2, '0') // Ensure minute has two digits

// 	const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`

// 	console.log(formattedDate)

// 	// Function to generate a random number within a range
// 	const getRandomNumber = (min, max) => {
// 		return Math.floor(Math.random() * (max - min + 1) + min)
// 	}

// 	// Generate random Receipt No.
// 	const receiptNo = getRandomNumber(1000, 9999)

// 	// Generate random Reference ID
// 	const referenceID = getRandomNumber(100000000000, 999999999999)

// 	const { name, allData, inputAmounts, total } = route.params

// 	useEffect(() => {
// 		const check = async () => {
// 			await iMinPrinter.initPrinter()

// 			await iMinPrinter.getStatus((status) => {
// 				console.log('Printer status: ', status)
// 			})

// 			await iMinPrinter.getSn((sn) => {
// 				console.log('Printer SN: ', sn)
// 			})
// 		}

// 		check()
// 	}, [])

// 	const totalAmount = total.toLocaleString('en-US', {
// 		minimumFractionDigits: 2,
// 		maximumFractionDigits: 2,
// 	})

// 	const filteredData =
// 		allData && allData.collections.find((item) => item.ID === item.ID)

// 	const renderedItem = Object.keys(inputAmounts)
// 		.map((refNo) => {
// 			const { REF_TARGET, SLDESCR, DEPOSIT, SHARECAPITAL } = inputAmounts[refNo]
// 			const matchingItem = allData.collections.find(
// 				(item) => item.REF_TARGET === refNo
// 			)

// 			if (!matchingItem) {
// 				return null // Skip if there is no matching item in the API data
// 			}

// 			if (!REF_TARGET && !SLDESCR && !DEPOSIT && !SHARECAPITAL) {
// 				return null // Skip if name is missing or both deposit and share capital are empty
// 			}

// 			// Generate the HTML markup for each item
// 			let itemHTML = ''
// 			if (REF_TARGET) {
// 				let ref_target = parseFloat(REF_TARGET).toLocaleString('en-US', {
// 					minimumFractionDigits: 2,
// 					maximumFractionDigits: 2,
// 				})
// 				itemHTML += `${matchingItem.REF_TARGET}\n${refNo}\nAmount Paid:							₱ ${ref_target}\n\n`
// 			}

// 			if (SLDESCR) {
// 				let sldescr = parseFloat(SLDESCR).toLocaleString('en-US', {
// 					minimumFractionDigits: 2,
// 					maximumFractionDigits: 2,
// 				})
// 				itemHTML += `${matchingItem.SLDESCR}\n${refNo}\nAmount Paid:							₱ ${sldescr}\n\n`
// 			}

// 			if (SHARECAPITAL) {
// 				let sharecapital = parseFloat(SHARECAPITAL).toLocaleString('en-US', {
// 					minimumFractionDigits: 2,
// 					maximumFractionDigits: 2,
// 				})
// 				itemHTML += `Share Capital\n${refNo}\nAmount Paid:							₱ ${sharecapital}\n\n`
// 			}

// 			if (DEPOSIT) {
// 				let deposit = parseFloat(DEPOSIT).toLocaleString('en-US', {
// 					minimumFractionDigits: 2,
// 					maximumFractionDigits: 2,
// 				})
// 				itemHTML += `Deposit\n${refNo}\nAmount Paid:								₱ ${deposit}\n\n`
// 			}

// 			return itemHTML
// 		})
// 		.filter(Boolean)
// 		.join('')

// 	// RenderData
// 	const renderData = Object.keys(inputAmounts)
// 		.map((refNo) => {
// 			const { REF_TARGET, SLDESCR, DEPOSIT, SHARECAPITAL } = inputAmounts[refNo]
// 			const matchingItem = allData.collections.find(
// 				(item) => item.REF_TARGET.toString() === refNo.toString()
// 			)

// 			if (
// 				!matchingItem ||
// 				(!REF_TARGET && !SLDESCR && !DEPOSIT && !SHARECAPITAL)
// 			) {
// 				return null // Skip if there is no matching item or missing refNo
// 			}

// 			const ref_targetAmount = parseFloat(SLDESCR).toLocaleString('en-US', {
// 				minimumFractionDigits: 2,
// 				maximumFractionDigits: 2,
// 			})

// 			return (
// 				<View key={refNo} className='items-start'>
// 					<Text
// 						className='text-center text-base font-bold'
// 						style={{ color: '#000' }}>
// 						{matchingItem.SLDESCR}
// 					</Text>
// 					<View style={{ flexDirection: 'row' }}>
// 						<View style={{ width: '50%' }}>
// 							<Text className='flex-shrink text-black font-semibold text-sm'>
// 								• Reference No.
// 							</Text>
// 						</View>
// 						<View>
// 							<Text
// 								className='text-center text-sm'
// 								style={{ flexShrink: 1, color: '#000' }}>
// 								{matchingItem.REF_TARGET}
// 							</Text>
// 						</View>
// 					</View>

// 					<View style={{ flexDirection: 'row' }}>
// 						<View style={{ width: '50%' }}>
// 							<Text className='flex-shrink text-black font-semibold text-sm'>
// 								• Amount Paid
// 							</Text>
// 						</View>
// 						<View>
// 							<Text
// 								className='text-sm'
// 								style={{ flexShrink: 1, color: '#000' }}>
// 								{ref_targetAmount}
// 							</Text>
// 						</View>
// 					</View>
// 				</View>
// 			)
// 		})
// 		.filter(Boolean)

// 	const checkPrinterStatus = async () => {
// 		try {
// 			const textArray = `					Statement of Account\n					   Sacred Heart Coop\nCruz na Daan 3008 San Rafael, Philippines\n----------------------------------------------------------------\nAccount Number: ${allData.ClientID}\nBiller Name: ${name}\n----------------------------------------------------------------\n${renderedItem}\nTotal Paid Amount:					₱ ${totalAmount}\n----------------------------------------------------------------\nReceipt No.: ${receiptNo}\nDate: ${formattedDate}\nReference ID: ${referenceID}\n----------------------------------------------------------------\n			Thank you for using our service!`

// 			try {
// 				await iMinPrinter.setTextSize(20)
// 				await iMinPrinter.printText(textArray, () => {
// 					iMinPrinter.printAndLineFeed()
// 					iMinPrinter.printAndFeedPaper(100)
// 					iMinPrinter.partialCut()
// 				})

// 				console.log(textArray)
// 			} catch (error) {
// 				console.error('Error printing text with word wrap: ', error)
// 			}
// 		} catch (error) {
// 			console.error(error)
// 		}
// 	}

// 	return (
// 		<SafeAreaView className='flex-1 p-5'>
// 			<ScrollView showsVerticalScrollIndicator={false}>
// 				<View className='space-y-10'>
// 					<View className=''>
// 						<Text
// 							className='text-center text-2xl font-bold'
// 							style={{ color: '#000' }}>
// 							COLLECTION RECEIPT
// 						</Text>
// 						<Text
// 							className='text-center text-xs font-bold'
// 							style={{ color: '#000' }}>
// 							Amount has been sent to the biller.
// 						</Text>
// 					</View>

// 					<View className='space-y-4'>
// 						<View className='items-start'>
// 							<Text
// 								className='text-center text-base font-bold'
// 								style={{ color: '#000' }}>
// 								BILLER
// 							</Text>
// 							<View style={{ flexDirection: 'row', padding: 5 }}>
// 								<View style={{ width: '45%' }}>
// 									<Text
// 										style={{
// 											flexShrink: 1,
// 											fontWeight: 'bold',
// 											color: '#000',
// 										}}>
// 										Account Name
// 									</Text>
// 								</View>
// 								<View
// 									style={{ width: '70%' }}
// 									numberOfLines={1}
// 									ellipsizeMode='tail'>
// 									<Text style={{ flexShrink: 1, color: '#000' }}>{name}</Text>
// 								</View>
// 							</View>
// 							<View style={{ flexDirection: 'row', padding: 5 }}>
// 								<View style={{ width: '45%' }}>
// 									<Text
// 										style={{
// 											flexShrink: 1,
// 											fontWeight: 'bold',
// 											color: '#000',
// 										}}>
// 										Account ID
// 									</Text>
// 								</View>
// 								<View style={{ width: '70%' }}>
// 									<Text
// 										numberOfLines={1}
// 										ellipsizeMode='tail'
// 										style={{ flexShrink: 1, color: '#000' }}>
// 										{allData.ClientID || 'N/A'}
// 									</Text>
// 								</View>
// 							</View>
// 						</View>

// 						<View className='h-[1] w-full border' />

// 						{renderData}

// 						<View className='items-start'>
// 							<Text
// 								className='text-center text-base font-bold'
// 								style={{ color: '#000' }}>
// 								TOTAL PAID
// 							</Text>
// 							<View style={{ flexDirection: 'row', padding: 5 }}>
// 								<View style={{ width: '50%' }}>
// 									<Text
// 										style={{
// 											flexShrink: 1,
// 											fontWeight: 'bold',
// 											color: '#000',
// 										}}>
// 										Amount
// 									</Text>
// 								</View>
// 								<View>
// 									<Text style={{ flexShrink: 1, color: '#000' }}>
// 										{totalAmount}
// 									</Text>
// 								</View>
// 							</View>
// 						</View>

// 						<View className='h-[1] w-full border' />

// 						<View className='items-start'>
// 							<Text
// 								className='text-center text-base font-bold'
// 								style={{ color: '#000' }}>
// 								TRANSACTIONS DETAILS
// 							</Text>

// 							<View style={{ flexDirection: 'row', padding: 5 }}>
// 								<View style={{ width: '45%' }}>
// 									<Text
// 										style={{
// 											flexShrink: 1,
// 											fontWeight: 'bold',
// 											color: '#000',
// 										}}>
// 										Receipt No.
// 									</Text>
// 								</View>
// 								<View>
// 									<Text style={{ flexShrink: 1, color: '#000' }}>
// 										{receiptNo}
// 									</Text>
// 								</View>
// 							</View>

// 							<View style={{ flexDirection: 'row', padding: 5 }}>
// 								<View style={{ width: '45%' }}>
// 									<Text
// 										style={{
// 											flexShrink: 1,
// 											fontWeight: 'bold',
// 											color: '#000',
// 										}}>
// 										Date
// 									</Text>
// 								</View>
// 								<View>
// 									<Text style={{ flexShrink: 1, color: '#000' }}>
// 										{formattedDate}
// 									</Text>
// 								</View>
// 							</View>

// 							<View style={{ flexDirection: 'row', padding: 5 }}>
// 								<View style={{ width: '45%' }}>
// 									<Text
// 										style={{
// 											flexShrink: 1,
// 											fontWeight: 'bold',
// 											color: '#000',
// 										}}>
// 										Reference ID
// 									</Text>
// 								</View>
// 								<View>
// 									<Text style={{ flexShrink: 1, color: '#000' }}>
// 										{referenceID}
// 									</Text>
// 								</View>
// 							</View>
// 						</View>
// 					</View>
// 				</View>
// 			</ScrollView>

// 			<View className='p-[10]' style={styles.container}>
// 				<View style={styles.specifications}>
// 					<Button full onPress={checkPrinterStatus}>
// 						{/* onPress={() => printHTML()} */}
// 						PRINT
// 					</Button>
// 				</View>

// 				<View style={styles.specifications}>
// 					<Button
// 						full
// 						onPress={() => {
// 							navigation.navigate(ROUTES.DASHBOARD)
// 						}}>
// 						GO BACK
// 					</Button>
// 				</View>
// 			</View>
// 		</SafeAreaView>
// 	)
// }

// export default PrintOutScreen
