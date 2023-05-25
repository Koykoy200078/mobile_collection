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
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const ViewScreen = () => {
  const {width} = useWindowDimensions();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute();
  const myRef = useRef(null);

  const [item, setItem] = useState('');

  const [regularLoans, setRegularLoans] = useState(0);
  const [emergencyLoans, setEmergencyLoans] = useState(0);
  const [savingDeposit, setSavingDeposit] = useState(0);
  const [shareCapital, setShareCapital] = useState(0);

  const [regularView, setRegularView] = useState(false);
  const [emergencyView, setEmergencyView] = useState(false);

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [
    route,
    regularLoans,
    emergencyLoans,
    savingDeposit,
    shareCapital,
    item,
    getTotalAmount,
  ]);

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
  const extractSavingDeposit = data => {
    const savingDeposit = {
      amount: [],
    };

    if (data) {
      item.data.forEach(item => {
        savingDeposit.amount.push(item.saving.totalAmount);
      });
    }

    return savingDeposit;
  };

  const extractShareCapital = data => {
    const shareCapital = {
      amount: [],
    };

    if (data) {
      item.data.forEach(item => {
        let totalShare = 0;
        console.log('item.share ==> ', item.share['totalAmount']);
        // shareCapital.amount.push(item.share);
      });
    }

    return shareCapital;
  };

  const regularLoanData = extractRegularLoanData(item);
  const emergencyLoanData = extractEmergencyLoanData(item);
  const savingDepositData = extractSavingDeposit(item);
  const shareCapitalData = extractShareCapital(item);

  console.log('savingDepositData ==> ', savingDepositData);

  const regularPrincipal = parseFloat(regularLoanData.principals); // Convert the regularPrincipal to a float
  const regularInterest = parseFloat(regularLoanData.interests); // Convert the regularInterest to a float
  const regularPenalty = parseFloat(regularLoanData.penalties); // Convert the regularPenalty to a float
  const regularAmount = regularPrincipal + regularInterest + regularPenalty;
  const principalNewData = regularAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const emergencyPrincipal = parseFloat(emergencyLoanData.principals); // Convert the emergencyPrincipal to a float
  const emergencyInterest = parseFloat(emergencyLoanData.interests); // Convert the emergencyInterest to a float
  const emergencyPenalty = parseFloat(emergencyLoanData.penalties); // Convert the emergencyPenalty to a float
  const emergencyAmount =
    emergencyPrincipal + emergencyInterest + emergencyPenalty;
  const emergencyNewData = emergencyAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const savingData = parseFloat(savingDepositData.amount); // Convert the savingDepositData to a float
  const savingNewData = savingData.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shareData = parseFloat(shareCapitalData.amount); // Convert the shareCapitalData to a float
  const shareNewData = shareData.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let a = regularLoans ? regularLoans : principalNewData;
  let b = emergencyLoans ? emergencyLoans : emergencyNewData;
  let c = savingDeposit ? savingDeposit : savingNewData;
  let d = shareCapital ? shareCapital : shareNewData;

  const getTotalAmount =
    parseFloat(a) + parseFloat(b) + parseFloat(c) + parseFloat(d);
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
              checkedBoxLabel="Total Amount Due"
              value={regularLoans ? regularLoans : principalNewData}
              onChangeText={val => setRegularLoans(val)}
              checkBoxEnabled={true}
              checkBox={!regularLoans && !principalNewData ? false : true}
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
              value={emergencyLoans ? emergencyLoans : emergencyNewData}
              onChangeText={val => setEmergencyLoans(val)}
              checkBoxEnabled={true}
              checkBox={!emergencyLoans && !emergencyNewData ? false : true}
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
              value={savingDeposit ? savingDeposit : savingNewData}
              onChangeText={val => setSavingDeposit(val)}
              checkBoxEnabled={true}
              checkBox={!savingDeposit && !savingNewData ? false : true}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Share Capital'}
              checkedBoxLabel="Amount"
              value={shareCapital ? shareCapital : shareNewData}
              onChangeText={val => setShareCapital(val)}
              checkBoxEnabled={true}
              checkBox={!shareCapital && !shareNewData ? false : true}
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
                    regularLoans: regularLoans
                      ? regularLoans
                      : item.regularLoans,
                    emergencyLoans: emergencyLoans
                      ? emergencyLoans
                      : item.emergencyLoans,
                    savingDeposit: savingDeposit
                      ? savingDeposit
                      : item.savingDeposit,
                    shareCapital: shareCapital
                      ? shareCapital
                      : item.shareCapital,
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
