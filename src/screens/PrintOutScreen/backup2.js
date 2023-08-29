// import React, { useEffect } from 'react'
// import { View, Text, TouchableOpacity, NativeModules } from 'react-native'
// import { imageUri } from './imageUri'
// const iMinPrinter = NativeModules.IminPrinter

// const PrintOutScreen = () => {
// 	const logoUri = 'data:image/png;base64,' + imageUri.data

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

// 	const checkPrinterStatus = async () => {
// 		try {
// 			const paperHeight = 50 // Set the desired paper height
// 			const printData = `
//         Statement of Account

//         Sacred Heart Coop
//     Cruz na Daan 3008 San Rafael, Philippines
//     ----------------------------------------------
//     Account Number: {allData.ClientID}
//     Biller Name: {name}
//     ----------------------------------------------
//     Item 1:
//     Description: {item1Description}
//     Amount: {item1Amount}

//     Item 2:
//     Description: {item2Description}
//     Amount: {item2Amount}
//     ----------------------------------------------
//     Total Paid Amount: {totalAmount}
//     ----------------------------------------------
//     Receipt No.: {receiptNo}
//     Date: {formattedDate}
//     Reference ID: {referenceID}
//     ----------------------------------------------
//     Thank you for using our service!
//     `

// 			console.log(printData)
// 			await iMinPrinter.printText(printData, () => {
// 				console.log('Print text success')
// 			})
// 			await iMinPrinter
// 				.printAndFeedPaper(paperHeight)
// 				.then(() => {
// 					console.log('Print and feed paper success')
// 				})
// 				.catch((error) => {
// 					console.error('Error in printAndFeedPaper:', error)
// 				})
// 		} catch (error) {
// 			console.error(error)
// 		}
// 	}

// 	return (
// 		<View>
// 			<Text>Receipt Application</Text>
// 			<TouchableOpacity onPress={checkPrinterStatus}>
// 				<Text>Print Receipt</Text>
// 			</TouchableOpacity>
// 		</View>
// 	)
// }

// export default PrintOutScreen
