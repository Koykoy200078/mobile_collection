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

  const {name, allData, inputAmounts, total} = route.params;

  useEffect(() => {}, [name, allData, inputAmounts, total]);

  console.log('allData ==>', allData);

  const totalAmount = total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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

  const matchingItems = allData.collections.filter(item =>
    inputAmounts.hasOwnProperty(item.REF_NO),
  );
  const renderedItem = matchingItems.map(item => (
    <View
      style={{flex: 1, width: width - 30, marginVertical: 10}}
      key={item.REF_NO}>
      <CardReport02
        style={{flex: 1}}
        title={item.SLDESCR}
        description={'REF: ' + item.REF_NO}
        checkedBoxLabel="Total Amount Paid"
        value={inputAmounts[item.REF_NO]}
        editable={false}
      />
    </View>
  ));

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
            {/* <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={'Regular Loan'}
              checkedBoxLabel="Total Amount Due"
              // value={regularLoans}
              editable={false}
            /> */}
            {renderedItem}
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
