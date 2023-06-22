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
import {useDispatch} from 'react-redux';

const ViewScreen = () => {
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const myRef = useRef(null);
  const [item, setItem] = useState('');

  const [regularView, setRegularView] = useState(false);
  const [emergencyView, setEmergencyView] = useState(false);

  const [regularLoans, setRegularLoans] = useState(0);
  const [emergencyLoans, setEmergencyLoans] = useState(0);
  const [savingDeposit, setSavingDeposit] = useState(0);
  const [shareCapital, setShareCapital] = useState(0);

  const [isCollapsed1, setIsCollapsed1] = useState(true);
  const [isCollapsed2, setIsCollapsed2] = useState(true);

  const toggleAccordion1 = () => {
    setIsCollapsed1(!isCollapsed1);
  };

  const toggleAccordion2 = () => {
    setIsCollapsed2(!isCollapsed2);
  };

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [route]);

  console.log('item ==> ', item);

  // const formatNumber = number => {
  //   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // };

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
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View key={item.id}>
          <Text title3 body1 className="text-xl font-bold">
            {item.CLIENTNAME}
          </Text>

          <View style={styles.specifications}>
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title="Regular Loan"
              // placeholder={
              //   regularLoans
              //     ? regularLoans
              //     : principalNewData
              //     ? principalNewData
              //     : '0.00'
              // }
              checkedBoxLabel="Total Amount Due"
              // value={regularLoans}
              // onChangeText={val => setRegularLoans(val)}
              checkBoxEnabled={true}
              // checkBox={
              //   regularLoans || principalNewData !== '0.00' ? true : false
              // }
              enableTooltip={true}
              toggleAccordion={toggleAccordion1}
              isCollapsed={isCollapsed1}
              principal={item.PRINDUE}
              interest={item.INTDUE}
              penalty={item.penalties}
            />

            {/* <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title="Emergency Loan"
              checkedBoxLabel="Total Amount Due"
              placeholder={
                emergencyLoans
                  ? emergencyLoans
                  : emergencyNewData
                  ? emergencyNewData
                  : '0.00'
              }
              value={emergencyLoans}
              onChangeText={val => setEmergencyLoans(val)}
              checkBoxEnabled={true}
              checkBox={
                emergencyLoans || emergencyNewData !== '0.00' ? true : false
              }
              enableTooltip={true}
              toggleAccordion={toggleAccordion2}
              isCollapsed={isCollapsed2}
              principal={emergencyLoanData.principals}
              interest={emergencyLoanData.interests}
              penalty={emergencyLoanData.penalties}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Savings Deposit'}
              checkedBoxLabel="Amount"
              placeholder={
                savingDeposit
                  ? savingDeposit
                  : savingsNewData
                  ? savingsNewData
                  : '0.00'
              }
              value={savingDeposit}
              onChangeText={val => setSavingDeposit(val)}
              checkBoxEnabled={true}
              checkBox={
                savingDeposit || savingsNewData !== '0.00' ? true : false
              }
            />*/}
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Share Capital'}
              checkedBoxLabel="Amount"
              // placeholder={
              //   shareCapital
              //     ? shareCapital
              //     : capitalNewData
              //     ? capitalNewData
              //     : '0.00'
              // }
              // value={formatNumber(item.SHARECAPITAL)}
              // onChangeText={val => setShareCapital(val)}
              checkBoxEnabled={true}
              // checkBox={
              //   shareCapital || capitalNewData !== '0.00' ? true : false
              // }
            />
          </View>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              // title={totalAmountDue ? totalAmountDue : '0.00'}
              description={t('total_amount')}
              isEnable={false}
            />
          </View>

          <View className="p-[10]">
            <View style={styles.specifications}>
              <Button
                full
                onPress={() =>
                  navigation.navigate('CheckOutScreen', {
                    name: item.name,
                    regularLoans: a,
                    rPrincipal: regularLoanData.principals,
                    rInterest: regularLoanData.interests,
                    rPenalty: regularLoanData.penalties,
                    emergencyLoans: b,
                    ePrincipal: emergencyLoanData.principals,
                    eInterest: emergencyLoanData.interests,
                    ePenalty: emergencyLoanData.penalties,
                    savingDeposit: c,
                    shareCapital: d,
                  })
                }>
                Checkout
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewScreen;
