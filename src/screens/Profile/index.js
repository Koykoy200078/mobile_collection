import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BaseStyle, useTheme} from '../../app/config';
// Load sample data
import {UserData} from '../../app/data';
import {
  Button,
  Icon,
  ProfileDetail,
  ProfilePerformance,
  SafeAreaView,
  Tag,
  Text,
} from '../../app/components';
import {AuthActions} from '../../app/actions';
import styles from './styles';

const {authentication} = AuthActions;

const Profile = props => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {navigation} = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData] = useState(UserData[0]);
  const auth = useSelector(state => state.auth);
  const login = auth.login.success;

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onLogOut = () => {
    setLoading(true);
    dispatch(
      authentication(false, () => {
        setLoading(false);
      }),
    );
  };

  const onLogIn = () => {
    navigation.navigate('SignIn');
  };

  const styleItem = {
    ...styles.profileItem,
    borderBottomColor: colors.border,
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <View style={[BaseStyle.container, {flex: 1}]}>
        <View style={{marginBottom: 20}}>
          <Text header bold>
            {t('setting')}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  // navigation.navigate('ProfileEdit');
                }}>
                <Text body1>{t('upload_data')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  // navigation.navigate('ProfileEdit');
                }}>
                <Text body1>{t('download_data')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styleItem}
                onPress={() => {
                  navigation.navigate('Setting');
                }}>
                <Text body1>{t('setting')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={{padding: 10}}>
        <Button full loading={loading} onPress={() => onLogOut()}>
          {t('logout')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
