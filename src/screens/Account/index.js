import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
	View,
	TouchableOpacity,
	useWindowDimensions,
	Alert,
} from 'react-native'
import { ROUTES } from '../../app/config'
import { Project02, Text } from '../../app/components'
import databaseOptions, { Client } from '../../app/database/allSchemas'

const Account = ({ navigation }) => {
	const { width, height } = useWindowDimensions()
	const [clientData, setClientData] = useState([])

	const filterData = clientData && clientData.filter((item) => item.isPaid)
	const countPaidItems = filterData ? filterData.length : 0

	useEffect(() => {
		showData()
	}, [])

	useFocusEffect(
		useCallback(() => {
			showData()
			return () => {}
		}, [])
	)

	const showData = useCallback(async () => {
		try {
			const realm = await Realm.open(databaseOptions)
			const clients = realm.objects(Client)
			setClientData(Array.from(clients))

			// realm.close()
		} catch (error) {
			Alert.alert('Error retrieving data', error)
			console.error(error)
		}
	}, [])

	return (
		<View className='flex-1' style={{ width: width, height: height }}>
			<View className='p-2 items-center justify-center'>
				<Text title1>Account</Text>
			</View>

			<View className='p-4 mx-2'>
				<Project02
					title='Paid Clients'
					description='View Paid Clients'
					total_loans={countPaidItems}
					onPress={() => navigation.navigate(ROUTES.UPLOAD_DATA)}
					style={{
						marginBottom: 10,
					}}
				/>
			</View>
		</View>
	)
}

export default Account
