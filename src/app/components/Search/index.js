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
  useWindowDimensions,
} from 'react-native';

import {Text} from '..';

import {Images} from '../../config';
import {Icons} from '../../config/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FlashList} from '@shopify/flash-list';
const {Value, timing} = Animated;

const Search = ({title, onPress, value, onChangeText, clearStatus = false}) => {
  const {width, height} = useWindowDimensions();
  const [isFocused, setIsFocused] = useState(false);
  // const [searchText, setSearchText] = useState('');

  const _inputBoxTranslateX = useRef(new Animated.Value(width)).current;
  const _backButtonOpacity = useRef(new Animated.Value(0)).current;
  const _contentTranslateY = useRef(new Animated.Value(height)).current;
  const _contentOpacity = useRef(new Animated.Value(0)).current;

  const refInput = useRef(null);
  useEffect(() => {}, [isFocused]);

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
    clearStatus(true);
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
                  <View className="mx-2">
                    <Icons.Feather
                      name="download-cloud"
                      size={30}
                      color="#161924"
                    />
                  </View>
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
                  value={value}
                  onChangeText={onChangeText}
                  className="h-[45] px-3 text-base text-black dark:text-black"
                />
              </View>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>

      {/* <Animated.View
        className="absolute left-0 bottom-0 z-[999]"
        style={{
          width: width,
          height: height,
          opacity: _contentOpacity,
          transform: [{translateY: _contentTranslateY}],
        }}>
        <SafeAreaView className="flex-1">
          {searchText === '' ? (
            <View className="flex-col justify-center items-center mt-[100] bg-white">
              <Image
                source={Images.logo}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text className="text-center mt-2 text-black">
                Search for items, brands and inspiration
              </Text>
            </View>
          ) : (
            <FlashList
              contentContainerStyle={{paddingHorizontal: 20}}
              estimatedItemSize={200}
              data={filterData}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({item}) => {
                const {FName, MName, LName, SName, collections, SLDESCR} = item;

                const fName = FName || '';
                const mName = MName || '';
                const lName = LName ? LName + ', ' : '';
                const sName = SName || '';

                const totalDue = collections.reduce(
                  (acc, data) => acc + parseFloat(data.TOTALDUE),
                  0,
                );

                const formatNumber = number => {
                  return number
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                };

                const clientName = lName + fName + ' ' + mName + ' ' + sName;

                const handlePress = item => {
                  if (item.collections.length === 0) {
                    Alert.alert('Info', 'This client has no collection data');
                  } else {
                    navigation.navigate(ROUTES.VIEW, {item: item});
                  }
                };

                return (
                  <Project02
                    title={clientName}
                    description={item.DateOfBirth}
                    isPaid={item.isPaid}
                    total_loans={totalDue ? formatNumber(totalDue) : ''}
                    onPress={() => handlePress(item)}
                    style={{
                      marginBottom: 10,
                    }}
                  />
                );
              }}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center">
                  <Text className="text-black dark:text-white font-bold">
                    No data found.
                  </Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Animated.View> */}
    </>
  );
};

export default Search;
