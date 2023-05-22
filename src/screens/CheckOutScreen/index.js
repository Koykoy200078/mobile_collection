import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView, View, useWindowDimensions} from 'react-native';
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

const CheckOutScreen = () => {
  const {width} = useWindowDimensions();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute();

  const {regularLoans, emergencyLoans, savingDeposit, shareCapital} =
    route.params;

  const aa =
    parseFloat(regularLoans) +
    parseFloat(emergencyLoans) +
    parseFloat(savingDeposit) +
    parseFloat(shareCapital);

  const totalAmount = aa.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Regular Loan'}
              checkedBoxLabel="Total Amount Due"
              value={regularLoans}
              editable={false}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Emergency Loan'}
              checkedBoxLabel="Total Amount Due"
              value={emergencyLoans}
              editable={false}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Savings Deposit'}
              checkedBoxLabel="Amount"
              value={savingDeposit}
              editable={false}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Share Capital'}
              checkedBoxLabel="Amount"
              value={shareCapital}
              editable={false}
            />
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
              <Button full>Proceed to Payment</Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOutScreen;