// import { View, Text } from 'react-native'
// import React, { useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import styles from './styles'
// // import RNPrint from 'react-native-print';
// import { Button } from '../../app/components'
// import { imageUri } from './imageUri'
// import { ROUTES } from '../../app/config'
// import RNPrint from 'react-native-print'
// import { ScrollView } from 'react-native-gesture-handler'

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

// 	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// 	const formattedHour = hour % 12 === 0 ? 12 : hour % 12 // Convert hour to 12-hour format
// 	const formattedMinute = minute.toString().padStart(2, '0') // Ensure minute has two digits

// 	const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`

// 	// Function to generate a random number within a range
// 	const getRandomNumber = (min, max) => {
// 		return Math.floor(Math.random() * (max - min + 1) + min)
// 	}

// 	// Generate random Receipt No.
// 	const receiptNo = getRandomNumber(1000, 9999)

// 	// Generate random Reference ID
// 	const referenceID = getRandomNumber(100000000000, 999999999999)

// 	const { name, allData, inputAmounts, total } = route.params

// 	const totalAmount = total.toLocaleString('en-US', {
// 		minimumFractionDigits: 2,
// 		maximumFractionDigits: 2,
// 	})

// 	const filteredData = allData && allData.collections.find((item) => item.ID === item.ID)

// 	const renderedItem = Object.keys(inputAmounts)
// 		.map((refNo) => {
// 			const { REF_TARGET, SLDESCR, DEPOSIT, SHARECAPITAL } = inputAmounts[refNo]
// 			const matchingItem = allData.collections.find((item) => item.REF_TARGET === refNo)

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
// 				itemHTML += `
//           <div class="flex-column"
//             style="justify-content: flex-start">
//             <div class="section-title" style="font-size: 12px">${matchingItem.REF_TARGET}</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">${refNo}</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">Amount Paid: ${ref_target}</div>
//           </div>
//         `
// 			}

// 			if (SLDESCR) {
// 				let sldescr = parseFloat(SLDESCR).toLocaleString('en-US', {
// 					minimumFractionDigits: 2,
// 					maximumFractionDigits: 2,
// 				})
// 				itemHTML += `
//           <div class="flex-column"
//             style="justify-content: flex-start">
//             <div class="section-title" style="font-size: 12px">${matchingItem.SLDESCR}</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">${refNo}</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">Amount Paid: ${sldescr}</div>
//           </div>
//         `
// 			}

// 			if (SHARECAPITAL) {
// 				let sharecapital = parseFloat(SHARECAPITAL).toLocaleString('en-US', {
// 					minimumFractionDigits: 2,
// 					maximumFractionDigits: 2,
// 				})
// 				itemHTML += `
//           <div class="flex-column"
//             style="justify-content: flex-start">
//             <div class="section-title" style="font-size: 12px">Share Capital</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">${refNo}</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">Amount Paid: ${sharecapital}</div>
//           </div>
//         `
// 			}

// 			if (DEPOSIT) {
// 				let deposit = parseFloat(DEPOSIT).toLocaleString('en-US', {
// 					minimumFractionDigits: 2,
// 					maximumFractionDigits: 2,
// 				})
// 				itemHTML += `
//           <div class="flex-column"
//             style="justify-content: flex-start">
//             <div class="section-title" style="font-size: 12px">Deposit</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">${refNo}</div>
//             <div class="section-value" style="margin-left: 10px; font-size: 12px">Amount Paid: ${deposit}</div>
//           </div>
//         `
// 			}

// 			return itemHTML
// 		})
// 		.filter(Boolean)
// 		.join('')

// 	// RenderData
// 	const renderData = Object.keys(inputAmounts)
// 		.map((refNo) => {
// 			const { REF_TARGET, SLDESCR, DEPOSIT, SHARECAPITAL } = inputAmounts[refNo]
// 			const matchingItem = allData.collections.find((item) => item.REF_TARGET.toString() === refNo.toString())

// 			if (!matchingItem || (!REF_TARGET && !SLDESCR && !DEPOSIT && !SHARECAPITAL)) {
// 				return null // Skip if there is no matching item or missing refNo
// 			}

// 			const ref_targetAmount = parseFloat(SLDESCR).toLocaleString('en-US', {
// 				minimumFractionDigits: 2,
// 				maximumFractionDigits: 2,
// 			})

// 			return (
// 				<View key={refNo} className='items-start'>
// 					<Text className='text-center text-base font-bold' style={{ color: '#000' }}>
// 						{matchingItem.SLDESCR}
// 					</Text>
// 					<View style={{ flexDirection: 'row' }}>
// 						<View style={{ width: '50%' }}>
// 							<Text className='flex-shrink text-black font-semibold text-sm'>• Reference No.</Text>
// 						</View>
// 						<View>
// 							<Text className='text-center text-sm' style={{ flexShrink: 1, color: '#000' }}>
// 								{matchingItem.REF_TARGET}
// 							</Text>
// 						</View>
// 					</View>

// 					<View style={{ flexDirection: 'row' }}>
// 						<View style={{ width: '50%' }}>
// 							<Text className='flex-shrink text-black font-semibold text-sm'>• Amount Paid</Text>
// 						</View>
// 						<View>
// 							<Text className='text-sm' style={{ flexShrink: 1, color: '#000' }}>
// 								{ref_targetAmount}
// 							</Text>
// 						</View>
// 					</View>
// 				</View>
// 			)
// 		})
// 		.filter(Boolean)

// 	const printHTML = async () => {
// 		await RNPrint.print({
// 			html: `<!DOCTYPE html>
//   <html>
//     <head>
//       <title>Statement of Account</title>
//       <style>
//         * {
//           box-sizing: border-box;
//         }
//         body {
//           font-family: Arial, sans-serif;
//           margin: 0;
//           padding: 0;
//           background-color: #fff;
//         }
//         .container {
//           width: 58mm;
//           height: 160mm;
//           margin: 0 auto;
//           background-color: #fff;
//           box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
//         }
//         .text-center {
//           text-align: center;
//         }
//         .font-bold {
//           font-weight: bold;
//         }
//         .flex-row {
//           display: flex;
//           flex-direction: row;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 5px;
//         }
//         .receipt-header {
//           display: flex;
//           align-items: center;
//           flex-direction: column;
//           margin-bottom: 15px;
//         }
//         .receipt-header img {
//           height: 60px;
//           margin-right: 5px;
//         }
//         .company-details {
//           display: flex;
//           flex-direction: row;
//           align-items: center;
//         }
//         .company-name {
//           font-size: 16px;
//           margin: 0;
//           margin-left: 5px;
//         }
//         .company-address {
//           font-size: 12px;
//           margin: 0;
//           margin-left: 5px;
//         }
//         .receipt-details {
//           margin-bottom: 15px;
//           background-color: #fff;
//           border-radius: 3px;
//         }
//         .receipt-total {
//           margin-top: 0;
//           margin-bottom: 15px;
//         }
//         .section-title {
//           font-size: 12px;
//           font-weight: bold;
//         }
//         .section-value {
//           font-size: 12px;
//         }

//         .separator {
//           border: none;
//           height: 2px;
//           background-color: #000;
//         }
//         @page {
//           size: 58mm 160mm;
//           margin: 0;
//         }
//         @media print and (-webkit-min-device-pixel-ratio: 0) {
//           /* Remove unnecessary page breaks for Chrome and Safari */
//           .container {
//             page-break-after: auto;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="receipt-header">
//           <div class="company-details">
//             <img src="${logoUri}" alt="Company Logo" width="65" height="100" />
//             <div>
//               <h1 class="company-name">Sacred Heart Coop</h1>
//               <p class="company-address">
//                 Cruz na Daan 3008 San Rafael, Philippines
//               </p>
//             </div>
//           </div>
//         </div>

//         <h1
//           class="text-center"
//           style="font-size: 18px; font-weight: bold; margin-top: 10px"
//         >
//           STATEMENT OF ACCOUNT
//         </h1>

//         <div class="receipt-details">
//           <div class="flex-row">
//             <div class="section-title">Account Number:</div>
//             <div class="section-value">${allData.ClientID}</div>
//           </div>

//           <div class="flex-row">
//             <div class="section-title">Biller Name:</div>
//             <div class="section-value">${name}</div>
//           </div>

//           <hr class="separator" />
//           ${renderedItem}
//           <hr class="separator" />
//         </div>

//         <div class="receipt-total">
//           <div class="flex-row">
//             <div class="section-title">Total Paid Amount:</div>
//             <div class="section-value">${totalAmount}</div>
//           </div>
//         </div>

//         <div class="receipt-details">
//           <div class="flex-row">
//             <div class="section-title">Receipt No.:</div>
//             <div class="section-value">${receiptNo}</div>
//           </div>

//           <div class="flex-row">
//             <div class="section-title">Date:</div>
//             <div class="section-value">${formattedDate}</div>
//           </div>

//           <div class="flex-row">
//             <div class="section-title">Reference ID:</div>
//             <div class="section-value">${referenceID}</div>
//           </div>
//         </div>

//         <div class="receipt-footer">
//           <div
//             class="flex-row text-center"
//             style="justify-content: center; margin-top: 10px"
//           >
//             <div class="section-title">Thank you for using our service!</div>
//           </div>
//         </div>
//       </div>
//     </body>
//   </html>
//   `,
// 		})
// 	}

// 	return (
// 		<SafeAreaView className='flex-1 p-5'>
// 			<ScrollView showsVerticalScrollIndicator={false}>
// 				<View className='space-y-10'>
// 					<View className=''>
// 						<Text className='text-center text-2xl font-bold' style={{ color: '#000' }}>
// 							COLLECTION RECEIPT
// 						</Text>
// 						<Text className='text-center text-xs font-bold' style={{ color: '#000' }}>
// 							Amount has been sent to the biller.
// 						</Text>
// 					</View>

// 					<View className='space-y-4'>
// 						<View className='items-start'>
// 							<Text className='text-center text-base font-bold' style={{ color: '#000' }}>
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
// 								<View style={{ width: '70%' }} numberOfLines={1} ellipsizeMode='tail'>
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
// 									<Text numberOfLines={1} ellipsizeMode='tail' style={{ flexShrink: 1, color: '#000' }}>
// 										{allData.ClientID || 'N/A'}
// 									</Text>
// 								</View>
// 							</View>
// 						</View>

// 						<View className='h-[1] w-full border' />

// 						{renderData}

// 						<View className='items-start'>
// 							<Text className='text-center text-base font-bold' style={{ color: '#000' }}>
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
// 									<Text style={{ flexShrink: 1, color: '#000' }}>{totalAmount}</Text>
// 								</View>
// 							</View>
// 						</View>

// 						<View className='h-[1] w-full border' />

// 						<View className='items-start'>
// 							<Text className='text-center text-base font-bold' style={{ color: '#000' }}>
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
// 									<Text style={{ flexShrink: 1, color: '#000' }}>{receiptNo}</Text>
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
// 									<Text style={{ flexShrink: 1, color: '#000' }}>{formattedDate}</Text>
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
// 									<Text style={{ flexShrink: 1, color: '#000' }}>{referenceID}</Text>
// 								</View>
// 							</View>
// 						</View>
// 					</View>
// 				</View>
// 			</ScrollView>

// 			<View className='p-[10]' style={styles.container}>
// 				<View style={styles.specifications}>
// 					<Button full onPress={() => printHTML()}>
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
