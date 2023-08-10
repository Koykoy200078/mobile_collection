import React, {useState, useEffect, useRef} from 'react';
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
} from 'react-native';

import {Text} from '..';

import {Images} from '../../config';
import {Icons} from '../../config/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
const {Value, timing} = Animated;

const {width, height} = Dimensions.get('window');

const Search = ({title, onPress}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  const _inputBoxTranslateX = useRef(new Animated.Value(width)).current;
  const _backButtonOpacity = useRef(new Animated.Value(0)).current;
  const _contentTranslateY = useRef(new Animated.Value(height)).current;
  const _contentOpacity = useRef(new Animated.Value(0)).current;

  const refInput = useRef(null);

  const animateInputBox = (toValue, duration) => {
    return Animated.timing(_inputBoxTranslateX, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
  };

  const animateBackButton = (toValue, duration) => {
    return Animated.timing(_backButtonOpacity, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
  };

  const animateContent = (toValue, duration) => {
    return Animated.timing(_contentTranslateY, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
  };

  const _onFocus = () => {
    setIsFocused(true);
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
    ]).start();
    refInput.current.focus();
  };

  const _onBlur = () => {
    setIsFocused(false);
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
    ]).start();
    refInput.current.blur();
  };

  return (
    <>
      <SafeAreaView className="z-[1000]">
        <View className="px-2 h-12">
          <View className="flex-1 overflow-hidden flex-row justify-between items-center relative">
            {isFocused ? (
              <>
                <View />

                <View />
              </>
            ) : (
              <>
                <TouchableOpacity onPress={onPress}>
                  <Icons.Feather
                    name="download-cloud"
                    size={30}
                    color="#161924"
                  />
                </TouchableOpacity>

                <Text
                  headline
                  numberOfLines={1}
                  className="text-black dark:text-white">
                  {title}
                </Text>
              </>
            )}

            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ccd0d5'}
              onPress={_onFocus}
              className="w-10 h-10 rounded-full flex-row justify-center items-center">
              <Icons.FontAwesome5 name="search" size={22} color="#000" />
            </TouchableHighlight>

            <Animated.View
              className="h-12 flex-row items-center absolute mx-[19]"
              style={{
                width: width - 35,
                transform: [{translateX: _inputBoxTranslateX}],
              }}>
              <Animated.View style={{opacity: _backButtonOpacity}}>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'transparent'}
                  onPress={_onBlur}
                  className="w-10 h-40 rounded-md flex-row justify-center items-center mr-5">
                  <Icons.FontAwesome name="close" size={20} color="#000" />
                </TouchableHighlight>
              </Animated.View>

              <View className="flex-1 bg-[#ccd0d5] rounded-md">
                <TextInput
                  ref={refInput}
                  placeholder="Search"
                  clearButtonMode="always"
                  value={searchText}
                  onChangeText={text => setSearchText(text)}
                  className="h-[45] px-3 text-base text-black dark:text-black"
                />
              </View>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>

      <Animated.View
        className="absolute left-0 bottom-0 z-[999]"
        style={{
          width: width,
          height: height,
          opacity: _contentOpacity,
          transform: [{translateY: _contentTranslateY}],
        }}>
        <SafeAreaView className="flex-1">
          <View className="flex-1">
            <View className="h-1" />
            {searchText.length < 0 ? (
              <View className="flex-1 flex-col justify-center items-center mt-[250]">
                <Image
                  source={Images.logo}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
                <Text className="text-center mt-2">
                  Search for items, brands and inspiration
                </Text>
              </View>
            ) : (
              <ScrollView className="border border-red-500 mt-[250] h-[250]">
                <View className="flex-col h-10 items-center border-b ml-4">
                  <Text
                    headline
                    numberOfLines={1}
                    className="text-black dark:text-white">
                    asdadasdasds
                  </Text>
                  <Text
                    headline
                    numberOfLines={1}
                    className="text-black dark:text-white">
                    asdadasdasds
                  </Text>
                  <Text
                    headline
                    numberOfLines={1}
                    className="text-black dark:text-white">
                    asdadasdasds
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

export default Search;
