import React from 'react'
import { View, useWindowDimensions, TouchableOpacity } from 'react-native'
import Collapsible from 'react-native-collapsible'
import colors from '../../../config/colors'
import { Icons } from '../../../config/icons'
import { Text } from '../..'

const Show = ({
	isCollapsed,
	totalCollectedAmount,
	totalRemittedAmount,
	title,
	enableTooltip,
	toggleAccordion,
	isActive,
	total,

	totalCash,
	totalCheck,
	totalOthers,
}) => {
	const { width, height } = useWindowDimensions()

	return (
		<>
			<View className='flex-row justify-between space-x-1'>
				<View>
					<Text title3>{title}</Text>
				</View>
				{/* {enableTooltip ? (
					<View className='items-center justify-center'>
						<TouchableOpacity onPress={toggleAccordion}>
							<View className='flex-row items-center justify-between'>
								<View className='flex-row'>
									<Icons.FontAwesome5
										name={isActive}
										size={17}
										color={colors.text}
									/>
									<Text
										caption2
										style={{ color: colors.text }}
										numberOfLines={1}
										className='ml-2 text-xs font-bold'>
										See More
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				) : null} */}
			</View>

			{/* <Collapsible collapsed={isCollapsed}>
				<View className='mx-2' style={{ width: width * 0.78, height: 105 }}>
					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs'>• Total Collected Amount</Text>
						<Text className='font-bold text-xs'>{totalCollectedAmount}</Text>
					</View>

					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs ml-4'>• Cash</Text>
						<Text className='font-bold text-xs'>{totalCollectedAmount}</Text>
					</View>

					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs ml-4'>• Check</Text>
						<Text className='font-bold text-xs'>{totalCollectedAmount}</Text>
					</View>

					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs ml-4'>• Others</Text>
						<Text className='font-bold text-xs'>{totalCollectedAmount}</Text>
					</View>

					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs'>• Total Remitted Amount:</Text>
						<Text className='font-bold text-xs'>{totalRemittedAmount}</Text>
					</View>

					<View className='flex-row justify-between my-2'>
						<Text className='font-extrabold text-sm'>TOTAL CASH ON HAND:</Text>
						<Text className='font-extrabold text-sm'>{total}</Text>
					</View>
				</View>
			</Collapsible> */}

			<View className='mx-2' style={{ width: width * 0.81, height: 105 }}>
				<View className='flex-row justify-between'>
					<View className='flex-row'>
						<Text className='font-bold text-xs'>• Total Collected Amount</Text>
					</View>
					<Text className='font-bold text-xs'>{totalCollectedAmount}</Text>
				</View>

				<Collapsible collapsed={isCollapsed}>
					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs ml-4'>• Cash</Text>
						<Text className='font-bold text-xs'>{totalCash}</Text>
					</View>

					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs ml-4'>• Check</Text>
						<Text className='font-bold text-xs'>{totalCheck}</Text>
					</View>

					<View className='flex-row justify-between'>
						<Text className='font-bold text-xs ml-4'>• Other's</Text>
						<Text className='font-bold text-xs'>{totalOthers}</Text>
					</View>
				</Collapsible>

				<View className='flex-row justify-between mt-2'>
					<Text className='font-bold text-xs'>• Total Remitted Amount</Text>
					<Text className='font-bold text-xs'>{totalRemittedAmount}</Text>
				</View>

				<View className='flex-row justify-between my-2'>
					<Text className='font-extrabold text-sm'>TOTAL CASH ON HAND:</Text>
					<Text className='font-extrabold text-sm'>{total}</Text>
				</View>
			</View>
		</>
	)
}

export default Show
