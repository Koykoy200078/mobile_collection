import React from 'react'
import PropTypes from 'prop-types'
import { Image, TouchableOpacity, View, useColorScheme } from 'react-native'
import { Images, useTheme } from '../../../config'

import Text from '../../../components/Text'
import styles from './styles'

const Project02 = ({
	title = '',
	style = {},
	onPress = () => {},
	description = '',
	disabled = false,
	total_loans = 0,
	isPaid,
	isCancelled,
}) => {
	const { colors } = useTheme()
	const isDarkMode = useColorScheme() === 'dark'

	return (
		<TouchableOpacity
			disabled={disabled}
			style={[styles.container, style]}
			onPress={onPress}>
			<View
				style={[
					styles.content,
					{
						backgroundColor: colors.background,
						borderColor: isDarkMode ? '#f1f1f1' : colors.border,
					},
				]}>
				<View style={styles.viewProgress}>
					<View style={styles.viewLeft}>
						<Text headline>{title}</Text>
						<Text caption1 light style={styles.description}>
							{description}
						</Text>
					</View>
					<View className='flex-col items-end'>
						<View>
							{isPaid ? (
								<Image
									source={Images.complete}
									style={{ width: 20, height: 20 }}
								/>
							) : null}
							{isCancelled ? (
								<Image
									source={Images.cancelled}
									style={{ width: 50, height: 23, marginTop: -10 }}
								/>
							) : null}
						</View>
						<View style={styles.viewRight}>
							<Text footnote light>
								{total_loans}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}

Project02.propTypes = {
	onPress: PropTypes.func,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	title: PropTypes.string,
	subTitle: PropTypes.string,
	description: PropTypes.string,
	progress: PropTypes.number,
	days: PropTypes.string,
	members: PropTypes.array,
}

export default Project02
