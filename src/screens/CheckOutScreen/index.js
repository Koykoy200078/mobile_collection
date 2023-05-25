import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView, View, useWindowDimensions, Alert} from 'react-native';
import {
  Button,
  CardReport02,
  Header,
  Icon,
  ProductSpecGrid,
  SafeAreaView,
  Text,
} from '../../app/components';
import {BaseStyle, useTheme} from '../../app/config';
import styles from './styles';
import {CollectorList, collectorList} from '../../app/database/allSchema';
import Realm from 'realm';

const CheckOutScreen = () => {
  const {width} = useWindowDimensions();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute();

  const {name, regularLoans, emergencyLoans, savingDeposit, shareCapital} =
    route.params;

  useEffect(() => {}, [a, b, c, d]);

  let a = regularLoans ? parseFloat(regularLoans) : 0;
  let b = emergencyLoans ? parseFloat(emergencyLoans) : 0;
  let c = savingDeposit ? parseFloat(savingDeposit) : 0;
  let d = shareCapital ? parseFloat(shareCapital) : 0;

  const aa = a + b + c + d;

  const totalAmount = aa.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const onAdd = async () => {
    // try {
    //   const realm = await Realm.open({schema: [collectorList]});
    //   const lastCollectorList = realm
    //     .objects(CollectorList)
    //     .sorted('id', true)[0];
    //   const highestId = lastCollectorList ? lastCollectorList.id + 1 : 1;
    //   realm.write(() => {
    //     realm.create(CollectorList, {
    //       id: highestId,
    //       name: name,
    //       regularLoans: a,
    //       emergencyLoans: b,
    //       savingDeposit: c,
    //       shareCapital: d,
    //     });
    //   });
    //   console.log('Successfully Added');
    //   realm.close();
    // } catch (error) {
    //   Alert.alert('ERROR: ', error);
    // }
  };

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, {flex: 1}]}
      edges={['right', 'top', 'left']}>
      <Header
        title=""
        renderLeft={() => {
          return (
            <View className="flex-row items-center space-x-2 w-[100]">
              <Icon
                name="angle-left"
                size={20}
                color={colors.text}
                enableRTL={true}
              />

              <Text title3 body1 className="text-xl font-bold">
                Back
              </Text>
            </View>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View>
          <Text title3 body1 className="text-xl font-bold text-center">
            Review Selected Account
          </Text>

          <View style={styles.specifications}>
            {regularLoans > 0 ? (
              <CardReport02
                style={{flex: 1, width: width - 30, marginVertical: 10}}
                title={'Regular Loan'}
                checkedBoxLabel="Total Amount Due"
                value={regularLoans}
                editable={false}
              />
            ) : null}

            {emergencyLoans > 0 ? (
              <CardReport02
                style={{flex: 1, width: width - 30, marginVertical: 10}}
                title={'Emergency Loan'}
                checkedBoxLabel="Total Amount Due"
                value={emergencyLoans}
                editable={false}
              />
            ) : null}

            {savingDeposit > 0 ? (
              <CardReport02
                style={{flex: 1, width: width - 30, marginVertical: 10}}
                title={'Savings Deposit'}
                checkedBoxLabel="Amount"
                value={savingDeposit}
                editable={false}
              />
            ) : null}

            {shareCapital > 0 ? (
              <CardReport02
                style={{flex: 1, width: width - 30, marginVertical: 10}}
                title={'Share Capital'}
                checkedBoxLabel="Amount"
                value={shareCapital}
                editable={false}
              />
            ) : null}
          </View>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={totalAmount ? totalAmount : '0.00'}
              description={t('total_amount')}
              isEnable={false}
            />
          </View>

          <View className="p-[10]">
            <View style={styles.specifications}>
              <Button full onPress={() => onAdd()}>
                Proceed to Payment
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOutScreen;
