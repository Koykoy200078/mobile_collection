import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {BaseColor, BaseStyle, Images, useTheme} from '../../../app/config';
import {AuthActions} from '../../../app/actions';
import {Button, Image, SafeAreaView, TextInput} from '../../../app/components';
import styles from './styles';

const {authentication} = AuthActions;
const successInit = {
  name: true,
  password: true,
};

const Login = props => {
  const {navigation} = props;
  const {width} = Dimensions.get('window');
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const [name, seName] = useState('test');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(successInit);

  const onLogin = () => {
    if (name === '' || password === '') {
      setSuccess({
        ...success,
        name: false,
        password: false,
      });
    } else {
      setLoading(true);
      dispatch(
        authentication(true, response => {
          if (response.success && name === 'test' && password === '123456') {
            navigation.navigate('ProjectMenu');
          } else {
            setLoading(false);
          }
        }),
      );
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
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
          <View className="my-8">
            <Image
              source={Images.logo}
              style={{width: width - 40}}
              className="h-[270]"
              resizeMode="contain"
            />
          </View>
          <TextInput
            style={[BaseStyle.textInput, {height: 50}]}
            onChangeText={text => seName(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                name: true,
              });
            }}
            autoCorrect={false}
            placeholder={'Input name'}
            placeholderTextColor={
              success.name ? BaseColor.grayColor : colors.primary
            }
            value={name}
            selectionColor={colors.primary}
          />
          <TextInput
            style={[BaseStyle.textInput, {height: 50, marginTop: 10}]}
            onChangeText={text => setPassword(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                password: true,
              });
            }}
            autoCorrect={false}
            placeholder={'Input password'}
            secureTextEntry={true}
            placeholderTextColor={
              success.password ? BaseColor.grayColor : colors.primary
            }
            value={password}
            selectionColor={colors.primary}
          />
          <View style={{width: '100%', marginVertical: 16}}>
            <Button
              full
              loading={loading}
              style={{marginTop: 20}}
              onPress={onLogin}>
              Login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
