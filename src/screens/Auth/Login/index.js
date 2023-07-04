import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  Platform,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {BaseStyle, Images, useTheme} from '../../../app/config';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {Button, TextInput} from '../../../app/components';

import {userLogin} from '../../../app/reducers/auth';

export default function ({navigation}) {
  const {width} = Dimensions.get('window');
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const auth = useSelector(state => state.auth);
  const {isLoading, authData, error} = auth;

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  useEffect(() => {}, [username, password]);

  const onLogin = () => {
    if (username === null || username.length === 0) {
      Alert.alert('Error!', 'Please enter username');
      return;
    } else if (password === null || password.length === 0) {
      Alert.alert('Error!', 'Please enter password');
      return;
    } else {
      dispatch(userLogin({username, password}));
    }
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      className="bg-white dark:bg-black"
      edges={['right', 'top', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{
          flex: 1,
        }}>
        <View
          style={styles.contain}
          className="items-center justify-center space-y-5">
          <View className="my-4">
            <Image
              source={Images.logo}
              style={{width: width}}
              className="h-[360]"
              resizeMode="contain"
            />
          </View>

          <TextInput
            style={[BaseStyle.textInput, {height: 50}]}
            onChangeText={val => setUsername(val)}
            autoCorrect={false}
            placeholder={'Username'}
            value={username}
            selectionColor={colors.primary}
          />

          <TextInput
            style={[BaseStyle.textInput, {height: 50, marginTop: 10}]}
            onChangeText={val => setPassword(val)}
            textAlign={'left'}
            autoCorrect={false}
            placeholder={'Password'}
            secureTextEntry={true}
            value={password}
            selectionColor={colors.primary}
          />

          <View style={{width: '100%', marginVertical: 16}}>
            <Button
              full
              loading={isLoading}
              style={{marginTop: 20}}
              onPress={onLogin}>
              LOGIN
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
