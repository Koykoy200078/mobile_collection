import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

function getCurrentDateFormatted() {
	const today = new Date()
	const year = today.getFullYear()
	const month = String(today.getMonth() + 1).padStart(2, '0')
	const day = String(today.getDate()).padStart(2, '0')
	return `${year}${month}${day}`
}

export default function ReferenceNo({ onReferenceNumberChange, collectorId }) {
	// Function to retrieve and update the incremental number from AsyncStorage
	async function getNextIncrementalNumber() {
		try {
			let incrementalNumber = await AsyncStorage.getItem('incrementalNumber')

			if (incrementalNumber === null) {
				// If no stored incremental number is found, start from 1
				incrementalNumber = '1'
			} else {
				// Increment the retrieved number
				incrementalNumber = String(Number(incrementalNumber) + 1)
			}

			// Store the updated incremental number back in AsyncStorage
			await AsyncStorage.setItem('incrementalNumber', incrementalNumber)

			// Pad the incremental number to 7 digits with leading zeros
			return incrementalNumber.padStart(7, '0')
		} catch (error) {
			console.error('Error retrieving or updating incremental number:', error)
			return null
		}
	}

	async function generateReferenceNumber() {
		try {
			const currentDate = getCurrentDateFormatted()
			const paddedIncrementalNumber = await getNextIncrementalNumber()

			if (paddedIncrementalNumber !== null) {
				const referenceNumber = `${currentDate}${collectorId}${paddedIncrementalNumber}`
				onReferenceNumberChange(referenceNumber) // Pass the reference number to the parent component
			}
		} catch (error) {
			console.error('Error generating reference number:', error)
		}
	}

	useEffect(() => {
		generateReferenceNumber()
	}, [])

	return <></>
}
