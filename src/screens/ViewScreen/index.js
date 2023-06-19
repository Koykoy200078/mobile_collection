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

const ViewScreen = () => {
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

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [route]);

  const extractRegularLoanData = data => {
    const regularData = {
      descriptions: [],
      principals: [],
      interests: [],
      penalties: [],
    };

    if (data) {
      item.data.forEach(item => {
        item.regular.forEach(loan => {
          regularData.descriptions.push(loan.description);
          regularData.principals.push(loan.principal);
          regularData.interests.push(loan.interest);
          regularData.penalties.push(loan.penalty);
        });
      });
    }

    return regularData;
  };

  const extractEmergencyLoanData = data => {
    const emergencyData = {
      descriptions: [],
      principals: [],
      interests: [],
      penalties: [],
    };

    if (data) {
      item.data.forEach(item => {
        item.emergency.forEach(loan => {
          emergencyData.descriptions.push(loan.description);
          emergencyData.principals.push(loan.principal);
          emergencyData.interests.push(loan.interest);
          emergencyData.penalties.push(loan.penalty);
        });
      });
    }

    return emergencyData;
  };

  const extractSavingsData = data => {
    const savingsData = {
      amount: [],
    };

    if (data) {
      item.data.forEach(item => {
        savingsData.amount.push(item.saving);
      });
    }

    return savingsData;
  };

  const extractCapitalData = data => {
    const capitalData = {
      amount: [],
    };

    if (data) {
      item.data.forEach(item => {
        capitalData.amount.push(item.share);
      });
    }

    return capitalData;
  };

  const regularLoanData = extractRegularLoanData(item);
  const regularPrincipal = parseFloat(regularLoanData.principals);
  const regularInterest = parseFloat(regularLoanData.interests);
  const regularPenalty = parseFloat(regularLoanData.penalties);
  const regularAmount = regularPrincipal + regularInterest + regularPenalty;
  const principalNewData = regularAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const emergencyLoanData = extractEmergencyLoanData(item);
  const emergencyPrincipal = parseFloat(emergencyLoanData.principals);
  const emergencyInterest = parseFloat(emergencyLoanData.interests);
  const emergencyPenalty = parseFloat(emergencyLoanData.penalties);
  const emergencyAmount =
    emergencyPrincipal + emergencyInterest + emergencyPenalty;
  const emergencyNewData = emergencyAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const savingsData = extractSavingsData(item);
  const savingsAmount = parseFloat(savingsData.amount);
  const savingsNewData = savingsAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const capitalData = extractCapitalData(item);
  const capitalAmount = parseFloat(capitalData.amount);
  const capitalNewData = capitalAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let a = regularLoans ? parseFloat(regularLoans) : parseFloat(regularAmount);
  let b = emergencyLoans
    ? parseFloat(emergencyLoans)
    : parseFloat(emergencyAmount);
  let c = savingDeposit ? parseFloat(savingDeposit) : parseFloat(savingsAmount);
  let d = shareCapital ? parseFloat(shareCapital) : parseFloat(capitalAmount);

  const getTotalAmount = a + b + c + d;
  const totalAmountDue = getTotalAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
            {item.name}
          </Text>

          <View style={styles.specifications}>
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title="Regular Loan"
              placeholder={
                regularLoans
                  ? regularLoans
                  : principalNewData
                  ? principalNewData
                  : '0.00'
              }
              checkedBoxLabel="Total Amount Due"
              value={regularLoans}
              onChangeText={val => setRegularLoans(val)}
              checkBoxEnabled={true}
              checkBox={
                regularLoans || principalNewData !== '0.00' ? true : false
              }
              isVisible={regularView}
              enableTooltip={true}
              onClose={() => setRegularView(false)}
              onPressView={() => setRegularView(true)}
              principal={regularLoanData.principals}
              interest={regularLoanData.interests}
              penalty={regularLoanData.penalties}
            />

            <CardReport02
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
              isVisible={emergencyView}
              enableTooltip={true}
              onClose={() => setEmergencyView(false)}
              onPressView={() => setEmergencyView(true)}
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
            />
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Share Capital'}
              checkedBoxLabel="Amount"
              placeholder={
                shareCapital
                  ? shareCapital
                  : capitalNewData
                  ? capitalNewData
                  : '0.00'
              }
              value={shareCapital}
              onChangeText={val => setShareCapital(val)}
              checkBoxEnabled={true}
              checkBox={
                shareCapital || capitalNewData !== '0.00' ? true : false
              }
            />
          </View>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={totalAmountDue ? totalAmountDue : '0.00'}
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
