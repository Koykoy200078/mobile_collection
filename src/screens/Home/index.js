import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {BaseStyle, ROUTES, useTheme} from '../../app/config';
import {Header, Project02, TabTag} from '../../app/components';
import {Icons} from '../../app/config/icons';
import styles from './styles';
import {Realm} from '@realm/react';
import databaseOptions, {Client} from '../../app/database/allSchemas';
import {getDetails, resetGetDetails} from '../../app/reducers/batchDetails';
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {useFocusEffect} from '@react-navigation/native';

const Home = ({navigation}) => {
  const {colors} = useTheme();
  const {width, height} = useWindowDimensions();

  const batchData = useSelector(state => state.batchDetails.data);
  const {isLoading, error, isSuccess} = useSelector(
    state => state.batchDetails,
  );
  const dispatch = useDispatch();

  const [clientData, setClientData] = useState([]);

  const fetchData = useCallback(async () => {
    Alert.alert(
      'Downloading Data',
      'Are you sure you want to download the data?',
      [
        {
          text: 'NO',
          onPress: () => Alert.alert('Cancelled', 'Data not downloaded'),
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            dispatch(
              getDetails({
                branchid: 0,
                collectorid: 1,
                // clientid: 1974,
                // slclass: [12, 13],
              }),
            );
          },
        },
      ],
    );
  }, [dispatch]);

  useEffect(() => {
    showData();
  }, [batchData]);

  useEffect(() => {
    if (isSuccess) {
      saveData();
    }
  }, [isSuccess]);

  const saveData = useCallback(async () => {
    Alert.alert('Saving Data', 'Are you sure you want to save the data?', [
      {
        text: 'NO',
        onPress: () => Alert.alert('Cancelled', 'Data not saved'),
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: async () => {
          try {
            const realm = await Realm.open(databaseOptions);
            realm.write(() => {
              batchData.data.forEach(client => {
                const collections = client.collections.map(collection => ({
                  ...collection,
                  id: `${client.ClientID}-${collection.ID}`,
                }));

                const dateOfBirth = new Date(client.DateOfBirth);
                const formattedDateOfBirth = `${dateOfBirth.getFullYear()}-${(
                  dateOfBirth.getMonth() + 1
                )
                  .toString()
                  .padStart(2, '0')}-${dateOfBirth
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`;

                const clientData = {
                  ClientID: client.ClientID,
                  FName: client.FName || '',
                  LName: client.LName || '',
                  MName: client.MName || '',
                  SName: client.SName || '',
                  DateOfBirth: client.DateOfBirth ? formattedDateOfBirth : '',
                  SMSNumber: client.SMSNumber || '',

                  collections,
                };

                realm.create(Client, clientData, Realm.UpdateMode.Modified);
              });
            });
            Alert.alert('Success', 'Data saved successfully!');
            dispatch(resetGetDetails());
            realm.close();
            showData();
          } catch (error) {
            Alert.alert('Error', 'Error saving data!');
            console.error(error);
          }
        },
      },
    ]);
  }, [batchData, showData]);

  const showData = useCallback(async () => {
    try {
      const realm = await Realm.open(databaseOptions);
      const clients = realm.objects(Client);
      setClientData(Array.from(clients));
    } catch (error) {
      Alert.alert('Error retrieving data', error);
      console.error(error);
    }
  }, []);

  const renderContent = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <Header
          title={'Collector List'}
          renderLeft={() => {
            return (
              <TouchableOpacity onPress={fetchData}>
                <Icons.Ionicons
                  name="cloud-download-outline"
                  size={24}
                  color={colors.primaryLight}
                />
              </TouchableOpacity>
            );
          }}
        />

        <View className="mt-2" />

        <FlashList
          contentContainerStyle={styles.paddingFlatList}
          estimatedItemSize={200}
          data={clientData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({item}) => {
            const {FName, MName, LName, SName, collections, SLDESCR} = item;

            const fName = FName || '';
            const mName = MName || '';
            const lName = LName ? LName + ', ' : '';
            const sName = SName || '';

            const totalDue = collections.reduce(
              (acc, data) => acc + parseFloat(data.TOTALDUE),
              0,
            );

            const formatNumber = number => {
              return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            };

            const clientName = lName + fName + ' ' + mName + ' ' + sName;

            const handlePress = item => {
              if (item.collections.length === 0) {
                Alert.alert('Info', 'This client has no collection data');
              } else {
                navigation.navigate(ROUTES.VIEW, {item: item});
              }
            };

            return (
              <Project02
                title={clientName}
                description={item.DateOfBirth}
                isPaid={item.isPaid}
                total_loans={totalDue ? formatNumber(totalDue) : ''}
                onPress={() => handlePress(item)}
                style={{
                  marginBottom: 10,
                }}
              />
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-black dark:text-white font-bold">
                No data found.
              </Text>
            </View>
          }
        />
      </View>
    );
  }, [
    colors.primary,
    colors.primaryLight,
    fetchData,
    saveData,
    clientData,
    navigation,
  ]);

  // Fetch data when the component mounts
  useEffect(() => {
    showData();
  }, []);

  // Fetch data when the component gains focus
  useFocusEffect(
    useCallback(() => {
      showData();
      return () => {
        // Cleanup function (if needed)
      };
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default Home;
