import React, { useEffect, useState, useCallback } from 'react'
import { View, useWindowDimensions, Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { ROUTES } from '../../app/config'
import { Project02, Text } from '../../app/components'
import databaseOptions, { Client } from '../../app/database/allSchemas'

const Account = ({ navigation }) => {
	const { width, height } = useWindowDimensions()
	const [clientData, setClientData] = useState([])
	const countPaidItems = clientData.filter((item) => item.isPaid).length

	const showData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const clients = realm.objects(Client)
			setClientData(Array.from(clients))
		} catch (error) {
			Alert.alert('Error retrieving data: ', error)
			console.error(error)
		}
	}, [])

	useEffect(() => {
		showData()
	}, [])

	useFocusEffect(
		useCallback(() => {
			showData()
			return () => {}
		}, [])
	)

	const navigateToUploadData = () => {
		navigation.navigate(ROUTES.UPLOAD_DATA)
	}

	return (
		<View style={{ flex: 1, width, height }}>
			<View
				style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
				<Text title1>Account</Text>
			</View>

			<View style={{ padding: 32, marginLeft: 8, marginRight: 8 }}>
				<Project02
					title='Payments'
					description='Payment type summary'
					total_loans={countPaidItems}
					// onPress={() => navigation.navigate(ROUTES.PAYMENT_SUMMARY)}
					style={{ marginBottom: 10 }}
				/>

				<Project02
					title='Clients'
					description='Collection Report'
					total_loans={countPaidItems}
					onPress={navigateToUploadData}
					style={{ marginBottom: 10 }}
				/>
			</View>
		</View>
	)
}

export default Account
