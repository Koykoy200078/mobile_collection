import {
	View,
	Text,
	useWindowDimensions,
	useColorScheme,
	Alert,
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import ZigzagView from 'react-native-zigzag-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import databaseOptions, {
	UploadData,
} from '../../../../app/database/allSchemas'

const Summary = ({ navigation, route }) => {
	const { item } = route.params

	const { width, height } = useWindowDimensions()
	const isDarkMode = useColorScheme() === 'dark'

	const [getData, setData] = useState([])

	const currentDate = new Date()

	const day = currentDate.getDate()
	const monthIndex = currentDate.getMonth()
	const year = currentDate.getFullYear()
	const hour = currentDate.getHours()
	const minute = currentDate.getMinutes()
	const ampm = hour >= 12 ? 'PM' : 'AM'

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const formattedHour = hour % 12 === 0 ? 12 : hour % 12 // Convert hour to 12-hour format
	const formattedMinute = minute.toString().padStart(2, '0') // Ensure minute has two digits

	const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`

	// Extract relevant parts
	const getYear = currentDate.getFullYear()
	const getMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Month is 0-indexed
	const getDay = currentDate.getDate().toString().padStart(2, '0')
	const getHour = currentDate.getHours().toString().padStart(2, '0')
	const getMinute = currentDate.getMinutes().toString().padStart(2, '0')
	const getSecond = currentDate.getSeconds().toString().padStart(2, '0')

	// Combine the parts into a single string
	const combinedString = `${getYear}${getMonth}${getDay}${getHour}${getMinute}${getSecond}`

	// Take the last 6 digits as the reference code
	const referenceCode = combinedString.slice(-6)

	const Fullname = [
		item.LName.trim() ? `${item.LName}, ` : '',
		item.FName.trim() ? `${item.FName} ` : '',
		item.MName,
		item.SName,
	]

	const totalDue =
		item &&
		item.collections.reduce((acc, data) => acc + parseFloat(data.ACTUAL_PAY), 0)

	const formatNumber = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	return (
		<SafeAreaView className='p-4'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{
					borderWidth: 1,
					borderColor: isDarkMode ? '#FFF' : '#CCC',
				}}>
				<ZigzagView
					backgroundColor='#CCC'
					surfaceColor='#FFF'
					contentContainerStyle={{
						padding: 10,
					}}>
					<View className='space-y-5'>
						<View className=''>
							<Text
								className='text-center text-2xl font-bold'
								style={{ color: '#000' }}>
								Sacred Heart Coop
							</Text>
							<Text
								className='text-center text-xs font-bold'
								style={{ color: '#000' }}>
								Cruz na Daan 3008 San Rafael, Philippines
							</Text>
						</View>
						<View className='space-y-4'>
							<View className='items-start'>
								<Text
									className='text-center text-base font-bold'
									style={{ color: '#000' }}>
									BILLER
								</Text>
								<View style={{ flexDirection: 'row', padding: 5 }}>
									<View style={{ width: '38%' }}>
										<Text
											style={{
												flexShrink: 1,
												fontWeight: 'bold',
												color: '#000',
											}}>
											Account Name
										</Text>
									</View>
									<View
										style={{ width: '70%' }}
										numberOfLines={1}
										ellipsizeMode='tail'>
										<Text
											style={{
												flexShrink: 1,
												color: '#000',
											}}>
											{Fullname}
										</Text>
									</View>
								</View>
								<View style={{ flexDirection: 'row', padding: 5 }}>
									<View style={{ width: '38%' }}>
										<Text
											style={{
												flexShrink: 1,
												fontWeight: 'bold',
												color: '#000',
											}}>
											Account ID
										</Text>
									</View>
									<View style={{ width: '70%' }}>
										<Text
											numberOfLines={1}
											ellipsizeMode='tail'
											style={{
												flexShrink: 1,
												color: '#000',
											}}>
											{item.client_id || 'N/A'}
										</Text>
									</View>
								</View>
							</View>

							<View
								style={{
									width: '100%',
									marginVertical: 10,
								}}>
								<View
									style={{
										width: '100%',
										borderWidth: 1,
										borderColor: '#E5E5E5',
										borderStyle: 'dashed',
										marginTop: -2,
									}}
								/>
							</View>
							{item &&
								item.collections.map((item, index) => {
									return (
										<View key={index} className='items-start'>
											<Text
												className='text-center text-base font-bold'
												style={{ color: '#000' }}>
												{item.SLDESCR}
											</Text>
											<View style={{ flexDirection: 'row' }}>
												<View style={{ width: '50%' }}>
													<Text className='flex-shrink text-black font-semibold text-sm'>
														• Reference No.
													</Text>
												</View>
												<View>
													<Text
														className='text-center text-sm'
														style={{
															flexShrink: 1,
															color: '#000',
														}}>
														{item.REF_TARGET}
													</Text>
												</View>
											</View>

											<View style={{ flexDirection: 'row' }}>
												<View style={{ width: '50%' }}>
													<Text className='flex-shrink text-black font-semibold text-sm'>
														• Amount Paid
													</Text>
												</View>
												<View>
													<Text
														className='text-sm'
														style={{
															flexShrink: 1,
															color: '#000',
														}}>
														{item.ACTUAL_PAY}
													</Text>
												</View>
											</View>
										</View>
									)
								})}

							<View className='items-start'>
								<Text
									className='text-center text-base font-bold'
									style={{ color: '#000' }}>
									TOTAL PAID
								</Text>
								<View style={{ flexDirection: 'row', padding: 5 }}>
									<View style={{ width: '50%' }}>
										<Text
											style={{
												flexShrink: 1,
												fontWeight: 'bold',
												color: '#000',
											}}>
											Amount
										</Text>
									</View>
									<View>
										<Text
											style={{
												flexShrink: 1,
												color: '#000',
											}}>
											{formatNumber(totalDue.toFixed(2))}
										</Text>
									</View>
								</View>
							</View>

							<View
								style={{
									width: '100%',
									marginVertical: 10,
								}}>
								<View
									style={{
										width: '100%',
										borderWidth: 1,
										borderColor: '#E5E5E5',
										borderStyle: 'dashed',
										marginTop: -2,
									}}
								/>
							</View>

							<View className='items-start'>
								<Text
									className='text-center text-base font-bold'
									style={{ color: '#000' }}>
									TRANSACTIONS DETAILS
								</Text>

								<View style={{ flexDirection: 'row', padding: 5 }}>
									<View style={{ width: '35%' }}>
										<Text
											style={{
												flexShrink: 1,
												fontWeight: 'bold',
												color: '#000',
											}}>
											Reference No.
										</Text>
									</View>
									<View>
										<Text
											style={{
												flexShrink: 1,
												color: '#000',
											}}>
											{referenceCode}
										</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'row', padding: 5 }}>
									<View style={{ width: '35%' }}>
										<Text
											style={{
												flexShrink: 1,
												fontWeight: 'bold',
												color: '#000',
											}}>
											Date
										</Text>
									</View>
									<View>
										<Text
											style={{
												flexShrink: 1,
												color: '#000',
											}}>
											{formattedDate}
										</Text>
									</View>
								</View>
							</View>
						</View>
					</View>
				</ZigzagView>
			</ScrollView>
		</SafeAreaView>
	)
}

export default Summary
