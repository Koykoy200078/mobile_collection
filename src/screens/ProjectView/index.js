import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {
  Avatars,
  CardReport02,
  CardReport03,
  CardReport04,
  Header,
  Icon,
  PButtonAddUser,
  ProductSpecGrid,
  SafeAreaView,
  Tag,
  Text,
} from '../../app/components';
import {BaseColor, BaseStyle, useTheme} from '../../app/config';
import {PProject} from '../../app/data';
import styles from './styles';

const TAGS = [
  {id: '1', icon: 'wifi', name: 'HTML', checked: true},
  {id: '2', icon: 'bath', name: 'Bootstrap'},
  {id: '3', icon: 'paw', name: 'CSS3'},
  {id: '4', icon: 'bus', name: 'Jquery'},
];

const ProjectView = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [members, setMembers] = useState(PProject[0].members);
  const [item, setItem] = useState(PProject[0]);

  useEffect(() => {
    if (route?.params?.members) {
      setMembers(route?.params?.members);
    }
  }, [route?.params?.members]);

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [route?.params?.item]);

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, {flex: 1}]}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('project_view')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.text}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor>
              {t('edit')}
            </Text>
          );
        }}
        onPressRight={() => {
          navigation.navigate('ProjectCreate', {item: item});
        }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View>
          <Text title3>{item.title}</Text>
          <Text body2 light style={{paddingVertical: 10}}>
            {'Guihulngan City, Negros Oriental'}
          </Text>
          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={'17 March 2019'}
              description={t('start_date')}
            />
            <ProductSpecGrid
              style={{flex: 1}}
              title={'17 March 2019'}
              description={t('end_date')}
            />
          </View>
          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={'₱ 30,000'}
              description={t('budget')}
            />
            <ProductSpecGrid
              style={{flex: 1}}
              title={
                <Tag
                  light
                  style={{
                    backgroundColor: BaseColor.grayColor,
                    borderRadius: 5,
                    paddingHorizontal: 5,
                  }}
                  textStyle={{color: BaseColor.whiteColor}}>
                  On Going
                </Tag>
              }
              description={t('status')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectView;
