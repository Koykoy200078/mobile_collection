import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {
  Avatars,
  Button,
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
  TextInput,
} from '../../app/components';
import {BaseColor, BaseStyle, useTheme} from '../../app/config';
import {PProject} from '../../app/data';
import styles from './styles';

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
        title="Account View"
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
          <Text title3>{item.name}</Text>
          <Text body2 light style={{paddingVertical: 10}}>
            {item.description}
          </Text>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={'₱ ' + item.principal}
              description={t('principal')}
            />

            <ProductSpecGrid
              style={{flex: 1}}
              title={'₱ ' + item.interest}
              description={t('interest')}
            />
          </View>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={'₱ ' + item.penalty}
              description={t('penalty')}
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
                  {item.status}
                </Tag>
              }
              description={t('status')}
            />
          </View>

          <View style={styles.specifications}>
            <TextInput
              style={[BaseStyle.textInput, {height: 60}]}
              autoCorrect={false}
              placeholder={'Input amount'}
              selectionColor={colors.primary}
            />
          </View>
          <View style={styles.specifications}>
            <Button full>Pay</Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectView;
