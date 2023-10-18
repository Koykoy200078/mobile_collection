import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, View, useColorScheme } from 'react-native'
import { useTheme } from '../../../config'
import Text from '../../../components/Text'
import styles from './styles'
import { CheckBox, TextInput } from '../..'
import Collapsible from 'react-native-collapsible'
import { Icons } from '../../../config/icons'

const CardReport02 = ({
	props,

	title = '',
	status,
	textStatusColor,
	description,
	checkedBoxLabel = '',
	style = {},
	onPress = () => {},
	disabled = false,

	checkBoxEnabled,
	checkBox,
	value,
	onChangeText,
	editable,
	index,
	setCheckboxChecked,

	statusOnPress,
	isStatus = false,

	principal,
	interest,
	penalty,
	total,

	placeholder,
	enableTooltip = false,

	toggleAccordion,
	isCollapsed,
	isActive,

	inputRef,
	onFocus,
	onBlur,
}) => {
	const { colors } = useTheme()
	const textInputRef = useRef(null)

	const isDarkMode = useColorScheme() === 'dark'

	useEffect(() => {}, [isCollapsed])
	return (
		<View
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
				<View style={[styles.header]} className='justify-between'>
					<View className='flex-row items-start justify-between'>
						<Text headline style={{ marginBottom: 5 }}>
							{title}
						</Text>

						{isStatus ? (
							<TouchableOpacity onPress={statusOnPress}>
								<View className='flex-row items-center justify-between'>
									<View className='flex-row'>
										<Text
											caption2
											style={{ color: textStatusColor }}
											numberOfLines={1}
											className='ml-2 text-xs font-bold'>
											{status}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						) : null}
					</View>
				</View>

				<View className='flex-row justify-between space-x-1 mb-2'>
					<View className=''>
						<Text caption2 style={{ color: colors.text }}>
							{description}
						</Text>
					</View>

					{enableTooltip ? (
						<View>
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
					) : null}
				</View>

				<Collapsible collapsed={isCollapsed}>
					<View className='mb-2'>
						<View className='flex-row justify-between'>
							<Text className='font-bold text-xs'>Principal: </Text>
							<Text className='font-bold text-xs'>{principal}</Text>
						</View>

						<View className='flex-row justify-between'>
							<Text className='font-bold text-xs'>Interest: </Text>
							<Text className='font-bold text-xs'>{interest}</Text>
						</View>

						<View className='flex-row justify-between'>
							<Text className='font-bold text-xs'>Penalty: </Text>
							<Text className='font-bold text-xs'>{penalty}</Text>
						</View>

						<View className='flex-row justify-between mt-2'>
							<Text className='font-bold text-sm'>TOTAL: </Text>
							<Text className='font-bold text-sm'>{total}</Text>
						</View>
					</View>
				</Collapsible>

				<View className='flex-col items-start space-y-1'>
					<View className='flex-row items-center'>
						<View className='flex-row items-center w-[190]'>
							{checkBoxEnabled ? (
								<CheckBox
									title=''
									checked={checkBox}
									color={colors.primary}
									style={{ flex: 1 }}
									onPress={() => {
										if (checkBoxEnabled) {
											// Toggle the checkboxChecked state when the checkbox is pressed
											setCheckboxChecked((prevState) => ({
												...prevState,
												[index]: !prevState[index],
											}))

											// Clear the input value when unchecking the checkbox
											if (checkBox) {
												onChangeText('') // Clear the input value
											}
										}
									}}
								/>
							) : null}
							<Text
								headline
								light
								className='flex-row text-base font-bold'
								numberOfLines={1}
								ellipsizeMode='tail'>
								{checkedBoxLabel}
							</Text>
						</View>

						<TextInput
							ref={textInputRef}
							style={[
								{
									height: 40,
									width: 117,
									fontStyle: 'italic',
									flex: 1,
								},
							]}
							className='text-black dark:text-[#F1F1F1]'
							textAlign={'right'}
							autoCorrect={false}
							placeholder={placeholder}
							selectionColor={colors.primary}
							value={value ? value : ''}
							keyboardType='numeric'
							editable={editable}
							onChangeText={onChangeText}
							onFocus={() => textInputRef.current.focus()}
							onBlur={() => textInputRef.current.blur()}
						/>
					</View>
				</View>
			</View>
		</View>
	)
}

CardReport02.propTypes = {
	onPress: PropTypes.func,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	title: PropTypes.string,
	price: PropTypes.string,
	icon: PropTypes.string,
}

export default CardReport02
