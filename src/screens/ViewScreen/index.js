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

  const [openModal, setModal] = useState(false);

  const [regularLoans, setRegularLoans] = useState(0.0);
  const [emergencyLoans, setEmergencyLoans] = useState(0.0);
  const [savingDeposit, setSavingDeposit] = useState(0.0);
  const [shareCapital, setShareCapital] = useState(0.0);

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [
    route,
    openModal,
    regularLoans,
    emergencyLoans,
    savingDeposit,
    shareCapital,
    totalAmount,
  ]);

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
        <View>
          <Text title3 body1 className="text-xl font-bold">
            {item.name}
          </Text>

          <View style={styles.specifications}>
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Regular Loan'}
              checkedBoxLabel="Total Amount Due"
              value={regularLoans}
              onChangeText={val => setRegularLoans(val)}
              checkBoxEnabled={true}
              checkBox={!regularLoans ? false : true}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={item.description}
              checkedBoxLabel="Total Amount Due"
              value={emergencyLoans}
              onChangeText={val => setEmergencyLoans(val)}
              checkBoxEnabled={true}
              checkBox={!emergencyLoans ? false : true}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Savings Deposit'}
              checkedBoxLabel="Amount"
              value={savingDeposit}
              onChangeText={val => setSavingDeposit(val)}
              checkBoxEnabled={true}
              checkBox={!savingDeposit ? false : true}
            />

            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Share Capital'}
              checkedBoxLabel="Amount"
              value={shareCapital}
              onChangeText={val => setShareCapital(val)}
              checkBoxEnabled={true}
              checkBox={!shareCapital ? false : true}
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
              <Button
                full
                onPress={() =>
                  navigation.navigate('CheckOutScreen', {
                    regularLoans,
                    emergencyLoans,
                    savingDeposit,
                    shareCapital,
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
