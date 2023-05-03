import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';

import DropShadow from 'react-native-drop-shadow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../app/config/colors';
import {Icons} from '../../../app/config/icons';

export default function ({navigation}) {
  const {width, height} = Dimensions.get('window');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="flex-1" style={{backgroundColor: colors.BGColor}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-center">
          <Image
            source={require('../../../assets/images/welcome.png')}
            style={{width: 200, height: 200}}
          />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <DropShadow
          style={{
            paddingTop: 10,
            width: '100%',
            height: '100%',
            shadowColor: colors.borderColor,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 5,
          }}>
          <View
            className="flex-1 px-8 pt-6"
            style={{
              backgroundColor: colors.BGColor,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}>
            <View className="form space-y-2">
              <Text
                className="ml-4 font-bold"
                style={{color: colors.textColor}}>
                Email Address
              </Text>
              <TextInput
                className="p-4 rounded-2xl mb-3"
                onChangeText={val => setEmail(val)}
                style={{
                  backgroundColor: colors.borderColor,
                  color: colors.textColor,
                }}
                placeholder="Enter your email address"
              />

              <Text
                className="ml-4 font-bold"
                style={{color: colors.textColor}}>
                Password
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 p-4 rounded-2xl"
                  style={{
                    backgroundColor: colors.borderColor,
                    color: colors.textColor,
                  }}
                  onChangeText={val => setPassword(val)}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                />

                <View className="mx-4">
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Icons.Feather
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={24}
                      color={colors.textColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity className="flex items-end mb-4">
                <Text className="font-bold" style={{color: colors.textColor}}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ProjectMenu')}
                className="py-3 rounded-xl"
                style={{backgroundColor: colors.primary}}>
                <Text
                  className="text-xl font-bold text-center"
                  style={{color: colors.textWhite}}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DropShadow>
      </ScrollView>
    </View>
  );
}
