import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  CardReport02,
  Header,
  ProductSpecGrid,
} from '../../app/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BaseStyle, ROUTES, useTheme} from '../../app/config';
import {Icons} from '../../app/config/icons';
import {ScrollView} from 'react-native-gesture-handler';
import styles from './styles';
import databaseOptions, {
  Client,
  UploadData,
  updateClient,
  uploadSchema,
} from '../../app/database/allSchemas';
import Realm from 'realm';

const CheckOutScreen = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const {colors} = useTheme();
  const [data, setData] = useState([]);
  const {name, allData, inputAmounts, total} = route.params;

  useEffect(() => {}, [name, allData, inputAmounts, total, data]);

  const totalAmount = total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  console.log('total: ', total);

  const renderedItem = Object.keys(inputAmounts)
    .map(refNo => {
      const {REF_TARGET, SLDESCR, DEPOSIT, SHARECAPITAL} = inputAmounts[refNo];

      console.log('inputAmounts: ', inputAmounts, refNo);

      const matchingItem = allData.collections.find(
        item => item.REF_TARGET === refNo,
      );

      if (!matchingItem) {
        return null; // Skip if there is no matching item in the API data
      }

      if (!REF_TARGET && !SLDESCR && !DEPOSIT && !SHARECAPITAL) {
        return null; // Skip if name is missing or both deposit and share capital are empty
      }
      return (
        <View key={refNo}>
          {REF_TARGET ? (
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={matchingItem.REF_TARGET}
              description={refNo}
              checkedBoxLabel="Total Amount Paid"
              value={REF_TARGET}
              editable={false}
            />
          ) : null}

          {SLDESCR ? (
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={matchingItem.SLDESCR}
              description={refNo}
              checkedBoxLabel="Total Amount Paid"
              value={SLDESCR}
              editable={false}
            />
          ) : null}

          {SHARECAPITAL ? (
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title="Share Capital"
              description={refNo}
              checkedBoxLabel="Total Amount Paid"
              value={SHARECAPITAL}
              editable={false}
            />
          ) : null}

          {DEPOSIT ? (
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title="Deposit"
              description={refNo}
              checkedBoxLabel="Total Amount Paid"
              value={DEPOSIT}
              editable={false}
            />
          ) : null}
        </View>
      );
    })
    .filter(Boolean);

  const updateData = async () => {
    Alert.alert('Confirm', 'Everything is working fine!', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          saveNewData();
        },
      },
    ]);
  };

  const saveNewData = async () => {
    const realm = await Realm.open(databaseOptions);
    try {
      // Fetch the target client with its collections using the provided ClientID
      const targetClient = realm
        .objects(Client)
        .filtered(
          'ClientID = $0 AND collections.@size > 0',
          allData.ClientID,
        )[0];

      if (!targetClient) {
        console.log(
          `Client with ClientID ${allData.ClientID} not found or has no collections.`,
        );
        realm.close();
        return;
      }

      // Transform the data into the expected format
      const transformedData = {
        ClientID: targetClient.ClientID,
        FName: targetClient.FName,
        LName: targetClient.LName,
        MName: targetClient.MName,
        SName: targetClient.SName,
        DateOfBirth: targetClient.DateOfBirth,
        SMSNumber: targetClient.SMSNumber,
        collections: targetClient.collections.map(collection => ({
          ID: collection.ID,
          CLIENTNAME: collection.CLIENTNAME,
          SLC: collection.SLC,
          SLT: collection.SLT,
          REF: collection.REF,
          SLDESCR: collection.SLDESCR,
          REF_NO: collection.REF_NO,
          AMT: totalAmount,
          SHARECAPITAL: collection.SHARECAPITAL,
          DEPOSIT: collection.DEPOSIT,
          REMARKS: 'Paid Due',
        })),
      };

      // Begin a write transaction
      realm.write(() => {
        realm.create(UploadData, transformedData, Realm.UpdateMode.Modified);
      });
      transactionData();
    } catch (error) {
      Alert.alert('Error', 'Error saving data!');
      console.error('Error: ', error);
    } finally {
      navigation.navigate(ROUTES.PRINTOUT, {
        name: name,
        allData: allData,
        inputAmounts: inputAmounts,
        total: total,
        isSuccessful: true,
      });
    }
  };

  const transactionData = async () => {
    try {
      const realm = await Realm.open(databaseOptions);
      realm.write(() => {
        const existingClient = realm.objectForPrimaryKey(
          Client,
          allData.ClientID,
        );

        if (!existingClient) {
          Alert.alert('Error', 'Client not found!');
          return;
        }

        // Update client properties
        existingClient.isPaid = true;
        realm.create(Client, existingClient, Realm.UpdateMode.Modified);
      });

      Alert.alert('Success', 'Data updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Error updating data!');
      console.error('Error: ', error);
    } finally {
      // TODO: last touch here
      if (
        inputAmounts === null &&
        inputAmounts === undefined &&
        inputAmounts === '' &&
        inputAmounts === 0
      ) {
        Alert.alert('Error', 'Something went wrong!');
      } else {
        navigation.navigate(ROUTES.PRINTOUT, {
          name: name,
          allData: allData,
          inputAmounts: inputAmounts,
          total: total,
          isSuccessful: true,
        });
      }
    }
  };

  // const showData = useCallback(async () => {
  //   try {
  //     const realm = await Realm.open(databaseOptions);
  //     const savedData = realm.objects(UploadData);
  //     const data = Array.from(savedData); // Convert Realm results to a regular array
  //     console.log('Saved Data:', JSON.stringify(data, null, 2));
  //     realm.close(); // Close the Realm after use
  //   } catch (error) {
  //     console.error('Error while fetching data:', error);
  //     return null;
  //   }
  // }, []);

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, {flex: 1}]}
      edges={['right', 'top', 'left']}>
      <Header
        title=""
        renderLeft={() => {
          return (
            <View className="flex-row items-center space-x-2 w-[100]">
              <Icons.FontAwesome5
                name="angle-left"
                size={20}
                color={colors.text}
                enableRTL={true}
              />

              <Text
                title3
                body1
                className="text-xl font-bold text-black dark:text-white">
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
          <Text
            title3
            body1
            className="text-xl font-bold text-center text-black dark:text-white">
            Review Selected Account
          </Text>

          {renderedItem}

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={totalAmount ? totalAmount : '0.00'}
              description={'Total Amount Paid'}
              isEnable={false}
            />
          </View>

          <View className="p-[10]">
            <View style={styles.specifications}>
              <Button full onPress={() => updateData()}>
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
