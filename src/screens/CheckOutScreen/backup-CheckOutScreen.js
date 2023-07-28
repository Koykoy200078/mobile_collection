import React, {useState, useEffect} from 'react';
import {View, Text, useWindowDimensions, Alert} from 'react-native';
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
import {useDispatch} from 'react-redux';
import {uploadData} from '../../app/reducers/upload';

const CheckOutScreen1 = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const {colors} = useTheme();
  const {name, allData, inputAmounts, total} = route.params;

  const [clientID, setClientID] = useState('0');
  const [fName, setFName] = useState('aa');
  const [lName, setLName] = useState('bb');
  const [mName, setMName] = useState('cc');
  const [sName, setSName] = useState('dd');
  const [dob, setDOB] = useState('ee');
  const [smsNumber, setSMSNumber] = useState('ff');

  const [collectionID, setCollectionID] = useState('0');
  const [clientName, setClientName] = useState('aaa');
  const [slc, setSlc] = useState('bbb');
  const [slt, setSlt] = useState('ccc');
  const [ref, setRef] = useState('ddd');
  const [sldescr, setSLDESCR] = useState('eee');
  const [refNo, setRefNo] = useState('fff');
  const [amt, setAmt] = useState('ggg');
  const [shareCapital, setShareCapital] = useState('hhh');
  const [deposit, setDeposit] = useState('iii');
  const [remarks, setRemarks] = useState('jjj');

  const dispatch = useDispatch();

  useEffect(() => {}, [name, allData, inputAmounts, total, requestData]);

  const [requestData, setRequestData] = useState({
    service: 'collection',
    collectorid: 1,
    branchid: 0,
    is_auto_post: false,
    data: [],
  });

  console.log('requestData: ', requestData);
  const aa = requestData.data.map(item => item);
  console.log('aa: ', aa);
  const handleAddCollection = () => {
    // Create a new collection object from user input
    const newCollection = {
      ID: collectionID,
      CLIENTNAME: clientName,
      SLC: parseInt(slc),
      SLT: parseInt(slt),
      REF: parseInt(ref),
      SLDESCR: sldescr,
      REF_NO: refNo,
      AMT: parseFloat(amt),
      SHARECAPITAL: shareCapital,
      DEPOSIT: deposit,
      REMARKS: remarks,
      // ... other properties based on other collection inputs
    };

    // Add the new collection to the data array in the requestData object
    setRequestData(prevData => ({
      ...prevData,
      data: [
        ...prevData.data,
        {
          ClientID: parseInt(clientID),
          FName: fName,
          LName: lName,
          MName: mName,
          SName: sName,
          DateOfBirth: dob,
          SMSNumber: smsNumber,
          collections: [newCollection],
        },
      ],
    }));

    // Clear collection input fields after adding
    setCollectionID('0');
    setClientName('aaa');
    setSlc('bbb');
    setSlt('ccc');
    setRef('ddd');
    setSLDESCR('eee');
    setRefNo('fff');
    setAmt('ggg');
    setShareCapital('hhh');
    setDeposit('iii');
    setRemarks('jjj');
  };

  const totalAmount = total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const renderedItem = Object.keys(inputAmounts)
    .map(refNo => {
      const {SLDESCR, DEPOSIT, SHARECAPITAL} = inputAmounts[refNo];

      const matchingItem = allData.collections.find(
        item => item.REF_NO === refNo,
      );

      if (!matchingItem) {
        return null; // Skip if there is no matching item in the API data
      }

      if (!SLDESCR && !DEPOSIT && !SHARECAPITAL) {
        return null; // Skip if name is missing or both deposit and share capital are empty
      }
      return (
        <View key={refNo}>
          {SLDESCR ? (
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title={matchingItem.SLDESCR}
              description={`REF# ${refNo}`}
              checkedBoxLabel="Total Amount Paid"
              value={SLDESCR}
              editable={false}
            />
          ) : null}

          {SHARECAPITAL ? (
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title="Share Capital"
              description={`REF# ${refNo}`}
              checkedBoxLabel="Total Amount Paid"
              value={SHARECAPITAL}
              editable={false}
            />
          ) : null}

          {DEPOSIT ? (
            <CardReport02
              style={{flex: 1, width: width - 30, marginVertical: 10}}
              title="Deposit"
              description={`REF# ${refNo}`}
              checkedBoxLabel="Total Amount Paid"
              value={DEPOSIT}
              editable={false}
            />
          ) : null}
        </View>
      );
    })
    .filter(Boolean);

  // TODO: not finished yet, last touched here
  // TODO: auth user
  const updateData = async updatedCollectionData => {
    // Alert.alert('Confirm', 'Are you sure you want to proceed?', [
    //   {
    //     text: 'Cancel',
    //     onPress: () => console.log('Cancel Pressed'),
    //     style: 'cancel',
    //   },
    //   {
    //     text: 'Yes',
    //     onPress: async () => {
    //       try {
    //         const realm = await Realm.open(databaseOptions);
    //         realm.write(() => {
    //           updatedCollectionData.forEach(collection => {
    //             realm.create(
    //               updatedCollectionDataSchema,
    //               collection,
    //               'modified',
    //             );
    //           });
    //         });
    //         console.log('Data updated successfully!');
    //         realm.close();
    //       } catch (error) {
    //         console.error('Error updating data: ', error);
    //       }
    //     },
    //   },
    // ]);

    Alert.alert('Confirm', 'Everything is working fine!', [
      {
        text: 'Cancel',
        // onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => dispatch(uploadData(requestData)),
        // navigation.navigate(ROUTES.PRINTOUT, {
        //   name: name,
        //   allData: allData,
        //   inputAmounts: inputAmounts,
        //   total: total,
        // }),
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
              <Button full onPress={() => handleAddCollection()}>
                Proceed to Payment
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOutScreen1;
