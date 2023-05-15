import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {BaseColor, BaseStyle, useTheme} from '../../../app/config';
import {AuthActions} from '../../../app/actions';
import {Button, SafeAreaView, TextInput} from '../../../app/components';
import styles from './styles';

const {authentication} = AuthActions;
const successInit = {
  id: true,
  password: true,
};

const Login = props => {
  const {navigation} = props;

  const {colors} = useTheme();
  const dispatch = useDispatch();
  const [id, setId] = useState('test');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(successInit);

  const onLogin = () => {
    if (id === '' || password === '') {
      setSuccess({
        ...success,
        id: false,
        password: false,
      });
    } else {
      setLoading(true);
      dispatch(
        authentication(true, response => {
          if (response.success && id === 'test' && password === '123456') {
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
        <View style={styles.contain}>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={text => setId(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                id: true,
              });
            }}
            autoCorrect={false}
            placeholder={'Input id'}
            placeholderTextColor={
              success.id ? BaseColor.grayColor : colors.primary
            }
            value={id}
            selectionColor={colors.primary}
          />
          <TextInput
            style={[BaseStyle.textInput, {marginTop: 10}]}
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
