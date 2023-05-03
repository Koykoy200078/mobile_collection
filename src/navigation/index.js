import React, {useEffect, useState} from 'react';
import {Platform, StatusBar, View, useColorScheme} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {BaseSetting, useTheme} from '../app/config';
import {languageSelect, getInto} from '../app/selectors';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import * as rootNavigation from './rootNavigation';
import {AllScreens, ModalScreens} from './config';

import {ApplicationActions} from '../app/actions';

import * as Utils from '../app/utils';
import Login from '../screens/Auth/Login';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

const MainScreens = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {Object.keys(AllScreens).map(name => {
        const {component, options} = AllScreens[name];
        return (
          <MainStack.Screen
            key={name}
            name={name}
            component={component}
            options={options}
          />
        );
      })}
    </MainStack.Navigator>
  );
};

export default function () {
  const {theme} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const language = useSelector(languageSelect);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const intro = useSelector(getInto);

  useEffect(() => {
    // Config status bar
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(isDarkMode ? 'black' : 'white', true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [isDarkMode]);

  useEffect(() => {
    const onProcess = async () => {
      // Get current language of device
      const languageCode = language ?? BaseSetting.defaultLanguage;
      dispatch(ApplicationActions.onChangeLanguage(languageCode));
      // Config language for app
      await i18n.use(initReactI18next).init({
        compatibilityJSON: 'v3',
        resources: BaseSetting.resourcesLanguage,
        lng: languageCode,
        fallbackLng: languageCode,
      });

      Utils.enableExperimental();
      rootNavigation.dispatch(StackActions.replace('Login'));
    };
    onProcess();
  }, []);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <NavigationContainer theme={theme} ref={rootNavigation.navigationRef}>
        <RootStack.Navigator
          screenOptions={{
            presentation: 'transparentModal',
            headerShown: false,
            cardStyle: {backgroundColor: 'transparent'},
            cardOverlayEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}>
          <RootStack.Screen
            name="MainScreens"
            component={MainScreens}
            options={{headerShown: false}}
          />
          {Object.keys(ModalScreens).map(name => {
            const {component, options} = ModalScreens[name];
            return (
              <RootStack.Screen
                key={name}
                name={name}
                component={component}
                options={options}
              />
            );
          })}
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}
