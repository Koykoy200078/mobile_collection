import React, {useEffect, useState} from 'react';
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

const CheckOutScreen = () => {
  const {width} = useWindowDimensions();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();

  const route = useRoute();

  const {
    name,
    regularLoans,
    emergencyLoans,
    savingDeposit,
    shareCapital,
    rPrincipal,
    rInterest,
    rPenalty,
    ePrincipal,
    eInterest,
    ePenalty,
  } = route.params;

  const [regular, setRegular] = useState(regularLoans || 0);
  const [emergency, setEmergency] = useState(emergencyLoans || 0);
  const [saving, setSaving] = useState(savingDeposit || 0);
  const [share, setShare] = useState(shareCapital || 0);

  const [rP, setRP] = useState(rPrincipal || 0);
  const [rI, setRI] = useState(rInterest || 0);
  const [rPe, setRPe] = useState(rPenalty || 0);

  const [eP, setEP] = useState(ePrincipal || 0);
  const [eI, setEI] = useState(eInterest || 0);
  const [ePe, setEPe] = useState(ePenalty || 0);

  useEffect(() => {}, [
    regular,
    emergency,
    saving,
    share,
    rP,
    rI,
    rPe,
    eP,
    eI,
    ePe,
  ]);

  let a = regularLoans ? parseFloat(regular) : 0;
  let b = emergencyLoans ? parseFloat(emergency) : 0;
  let c = savingDeposit ? parseFloat(saving) : 0;
  let d = shareCapital ? parseFloat(share) : 0;

  const aa = a + b + c + d;

  const principalNewData = a.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const emergencyNewData = b.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const savingsNewData = c.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const capitalNewData = d.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const totalAmount = aa.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedRegular = regular.toFixed(2);
  const formattedEmergency = emergency.toFixed(2);
  const formattedSaving = saving.toFixed(2);
  const formattedShare = share.toFixed(2);

  const onAdd = async () => {
    Alert.alert('Confirm', 'Are you sure you want to proceed?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const realm = await Realm.open({schema: [collectorList]});
            const lastCollectorList = realm
              .objects(CollectorList)
              .sorted('id', true)[0];
            const highestId = lastCollectorList ? lastCollectorList.id + 1 : 1;
            realm.write(() => {
              realm.create(CollectorList, {
                id: highestId,
                name: name,
                regularLoans: parseFloat(formattedRegular),
                emergencyLoans: parseFloat(formattedEmergency),
                savingDeposit: parseFloat(formattedSaving),
                shareCapital: parseFloat(formattedShare),
              });
            });
            Alert.alert('Success', 'Payment Confirm', [
              {
                text: 'Ok',
                onPress: () =>
                  navigation.navigate('Print', {
                    name: name,
                    regularLoans: parseFloat(formattedRegular),
                    emergencyLoans: parseFloat(formattedEmergency),
                    savingDeposit: parseFloat(formattedSaving),
                    shareCapital: parseFloat(formattedShare),
                    totalAmount,
                    rP: regular === 0 ? 0 : rP,
                    rI: regular === 0 ? 0 : rI,
                    rPe: regular === 0 ? 0 : rPe,
                    eP: emergency === 0 ? 0 : eP,
                    eI: emergency === 0 ? 0 : eI,
                    ePe: emergency === 0 ? 0 : ePe,
                  }),
                style: 'cancel',
              },
            ]);
            realm.close();
          } catch (error) {
            console.log('Error: ', error);
          }
        },
      },
    ]);
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
                placeholder={regularLoans ? principalNewData : '0.00'}
                checkedBoxLabel="Total Amount Due"
                // value={regularLoans}
                editable={false}
              />
            ) : null}

            {emergencyLoans > 0 ? (
              <CardReport02
                style={{flex: 1, width: width - 30, marginVertical: 10}}
                title={'Emergency Loan'}
                placeholder={emergencyLoans ? emergencyNewData : '0.00'}
                checkedBoxLabel="Total Amount Due"
                // value={emergencyLoans}
                editable={false}
              />
            ) : null}

            {savingDeposit > 0 ? (
              <CardReport02
                style={{flex: 1, width: width - 30, marginVertical: 10}}
                title={'Savings Deposit'}
                placeholder={savingDeposit ? savingsNewData : '0.00'}
                checkedBoxLabel="Amount"
                // value={savingDeposit}
                editable={false}
              />
            ) : null}

            {shareCapital > 0 ? (
              <CardReport02
                style={{flex: 1, width: width - 30, marginVertical: 10}}
                title={'Share Capital'}
                placeholder={shareCapital ? capitalNewData : '0.00'}
                checkedBoxLabel="Amount"
                // value={shareCapital}
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
