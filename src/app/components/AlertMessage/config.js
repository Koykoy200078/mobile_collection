import { Dimensions, View, Text } from 'react-native'
import { Icons } from '../../config/icons'

const { width, height } = Dimensions.get('window')

export default {
	customError: ({ text1, text2, props }) => (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				height: 80,
				width: width * 0.92,
				padding: 10,
				backgroundColor: '#E5E5E5',
				borderRadius: 8,
			}}
			className='space-x-2'>
			<View>
				<Icons.AntDesign name='warning' size={28} color='#FF3B30' />
			</View>
			{/* Text Content */}
			<View
				style={{ flexDirection: 'column', width: '90%' }}
				className='space-y-1'>
				<View>
					<Text style={{ color: '#333333' }} className='text-base font-bold'>
						{text1}
					</Text>

					<Text style={{ color: '#333333' }} className='text-sm'>
						{text2}
					</Text>
				</View>
			</View>
		</View>
	),

	customInfo: ({ text1, text2, props }) => (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				height: 80,
				width: width * 0.92,
				padding: 10,
				backgroundColor: '#E5E5E5',
				borderRadius: 8,
			}}
			className='space-x-2'>
			<View className=''>
				<Icons.Octicons name='info' size={30} color='#111827' />
			</View>
			{/* Text Content */}
			<View
				style={{ flexDirection: 'column', width: '90%' }}
				className='space-y-1'>
				<View>
					<Text style={{ color: '#333333' }} className='text-base font-bold'>
						{text1}
					</Text>

					<Text style={{ color: '#333333' }} className='text-sm'>
						{text2}
					</Text>
				</View>
			</View>
		</View>
	),
}
