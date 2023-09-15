import React, { useState, useEffect, useRef } from 'react'
import {
	SafeAreaView,
	Dimensions,
	StyleSheet,
	View,
	TextInput,
	Image,
	TouchableHighlight,
	ScrollView,
	Animated,
	Easing,
	useWindowDimensions,
	useColorScheme,
} from 'react-native'

import { Text } from '..'

import { Images } from '../../config'
import { Icons } from '../../config/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FlashList } from '@shopify/flash-list'
const { Value, timing } = Animated

const Search = ({
	title,
	onPress,
	onPressUpload,
	value,
	onChangeText,
	clearStatus = false,
	isDownload = false,
	isUpload = false,
}) => {
	const isDarkMode = useColorScheme() === 'dark'
	const { width, height } = useWindowDimensions()
	const [isFocused, setIsFocused] = useState(false)
	// const [searchText, setSearchText] = useState('');

	const _inputBoxTranslateX = useRef(new Animated.Value(width)).current
	const _backButtonOpacity = useRef(new Animated.Value(0)).current
	const _contentTranslateY = useRef(new Animated.Value(height)).current
	const _contentOpacity = useRef(new Animated.Value(0)).current

	const refInput = useRef(null)
	useEffect(() => {}, [isFocused])

	const animateInputBox = (toValue, duration) => {
		return Animated.timing(_inputBoxTranslateX, {
			toValue,
			duration,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: false,
		})
	}

	const animateBackButton = (toValue, duration) => {
		return Animated.timing(_backButtonOpacity, {
			toValue,
			duration,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: false,
		})
	}

	const animateContent = (toValue, duration) => {
		return Animated.timing(_contentTranslateY, {
			toValue,
			duration,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: false,
		})
	}

	const _onFocus = () => {
		setIsFocused(true)
		Animated.parallel([
			animateInputBox(0, 200),
			animateBackButton(1, 200),
			animateContent(0, 200),
			Animated.timing(_contentOpacity, {
				toValue: 1,
				duration: 200,
				easing: Easing.inOut(Easing.ease),
				useNativeDriver: false,
			}),
		]).start()
		refInput.current.focus()
	}

	const _onBlur = () => {
		setIsFocused(false)
		clearStatus(true)
		Animated.parallel([
			animateInputBox(width, 200),
			animateBackButton(0, 50),
			animateContent(height, 0),
			Animated.timing(_contentOpacity, {
				toValue: 0,
				duration: 200,
				easing: Easing.inOut(Easing.ease),
				useNativeDriver: false,
			}),
		]).start()
		refInput.current.blur()
	}

	return (
		<>
			<SafeAreaView className='z-[1000]'>
				<View className='px-2 h-12'>
					<View className='flex-1 overflow-hidden flex-row justify-between items-center relative'>
						{isFocused ? (
							<>
								<View />

								<View />
							</>
						) : (
							<>
								{isDownload ? (
									<TouchableOpacity onPress={onPress}>
										<View className='mx-2'>
											<Icons.Feather
												name='download-cloud'
												size={30}
												color={isDarkMode ? '#f1f1f1' : '#161924'}
											/>
										</View>
									</TouchableOpacity>
								) : null}

								{isUpload ? (
									<TouchableOpacity onPress={onPressUpload}>
										<View className='mx-2'>
											<Icons.SimpleLineIcons
												name='cloud-upload'
												size={25}
												color={isDarkMode ? '#f1f1f1' : '#161924'}
											/>
										</View>
									</TouchableOpacity>
								) : null}

								<Text
									headline
									numberOfLines={1}
									className='text-black dark:text-white'>
									{title}
								</Text>
							</>
						)}

						<TouchableHighlight
							activeOpacity={1}
							underlayColor={'#ccd0d5'}
							onPress={_onFocus}
							className='w-10 h-10 rounded-full flex-row justify-center items-center'>
							<Icons.FontAwesome5
								name='search'
								size={22}
								color={isDarkMode ? '#f1f1f1' : '#161924'}
							/>
						</TouchableHighlight>

						<Animated.View
							className='h-12 flex-row items-center absolute mx-[19]'
							style={{
								width: width - 35,
								transform: [{ translateX: _inputBoxTranslateX }],
							}}>
							<Animated.View style={{ opacity: _backButtonOpacity }}>
								<TouchableHighlight
									activeOpacity={1}
									underlayColor={'transparent'}
									onPress={_onBlur}
									className='w-10 h-40 rounded-md flex-row justify-center items-center mr-5'>
									<Icons.FontAwesome
										name='close'
										size={20}
										color={isDarkMode ? '#f1f1f1' : '#161924'}
									/>
								</TouchableHighlight>
							</Animated.View>

							<View className='flex-1 bg-[#ccd0d5] rounded-md'>
								<TextInput
									ref={refInput}
									placeholder='Search'
									placeholderTextColor={isDarkMode ? '#161924' : '#161924'}
									clearButtonMode='always'
									value={value}
									onChangeText={onChangeText}
									className='h-[45] px-3 text-base text-black dark:text-black'
								/>
							</View>
						</Animated.View>
					</View>
				</View>
			</SafeAreaView>
		</>
	)
}

export default Search
