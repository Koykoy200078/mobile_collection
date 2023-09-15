import { StyleSheet } from 'react-native'
import { BaseColor } from '../../../../../app/config'

export default StyleSheet.create({
	container: {
		padding: 20,
		paddingTop: 0,
	},
	specifications: {
		marginVertical: 10,
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	wrapContent: {
		flexWrap: 'wrap',
		flexDirection: 'column',
		borderColor: BaseColor.dividerColor,
		marginBottom: 20,
	},
})
