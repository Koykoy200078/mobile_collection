import React, {useState, useEffect} from 'react';
import {
  View,
  useWindowDimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import {Images, ROUTES} from '../../app/config';
import {Text} from '../../app/components';
import {Icons} from '../../app/config/icons';
import {Shadow} from 'react-native-shadow-2';

const Dashboard = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  const ios = Platform.OS === 'ios';

  const data = [
    {
      id: 1,
      title: 'Cash In',
      image: Images.cashIn,
    },
    {
      id: 2,
      title: 'Cash Out',
      image: Images.cashOut,
    },
  ];

  return (
    <View
      className="flex-1"
      style={{
        width: width,
        height: height,
      }}>
      <SafeAreaView className="mb-3">
        <View className="flex-row mx-2 justify-between">
          <View>
            <Text caption1>Good Afternoon</Text>
            <Text title2>...</Text>
          </View>

          <View />

          <View className="items-center">
            <Icons.Entypo name="notification" size={24} color="black" />
          </View>
        </View>
      </SafeAreaView>

      <View className="mx-2 p-2 mb-5">
        <Shadow
          distance={5}
          style={{
            padding: 10,
            width: width - 35,
            marginHorizontal: 15,
            borderRadius: 10,
          }}>
          <Text headline>Total Amount</Text>
          <Text title1>₱ 0.00</Text>
        </Shadow>
      </View>

      <FlatList
        data={data}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: 'space-evenly',
          marginVertical: 10,
        }}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          console.log('item: ', item);
          return (
            <TouchableOpacity
              onPress={() => {
                if (item.id === 1) {
                  navigation.navigate(ROUTES.CASHIN);
                }
              }}>
              {/* <View className="border rounded-md p-2 items-center justify-center">
                <Image
                  source={item.image}
                  style={{width: width * 0.4, height: height * 0.1}}
                  resizeMode="contain"
                />

                <Text title3>{item.title}</Text>
              </View> */}

              <Shadow
                distance={5}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={item.image}
                  style={{width: width * 0.35, height: height * 0.1}}
                  resizeMode="contain"
                />

                <Text title3>{item.title}</Text>
              </Shadow>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Dashboard;
