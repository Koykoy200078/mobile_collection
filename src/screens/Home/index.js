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
import databaseOptions, {Client} from '../../app/database/allSchema';
import {getDetails} from '../../app/reducers/batchDetails';
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

export default function ({navigation}) {
  const {colors} = useTheme();
  const {width, height} = useWindowDimensions();
  const tabs = [
    {
      id: 'all',
      title: 'All Clients',
    },
  ];

  const batchData = useSelector(state => state.batchDetails.data);
  const batchLoading = useSelector(state => state.batchDetails.isLoading);
  const dispatch = useDispatch();
  const [tab, setTab] = useState(tabs[0]);
  // const [hasData, setHasData] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log('clientData: ', clientData);

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
                clientid: 1974,
                slclass: [12, 13],
              }),
            );

            {
              batchLoading
                ? Alert.alert('Info', 'Downloading, Please wait . . .')
                : Alert.alert('Info', 'Successfully Downloaded', [
                    {
                      text: 'Next',
                      onPress: () => saveData(),
                    },
                  ]);
            }
          },
        },
      ],
    );
  }, [dispatch]);

  useEffect(() => {
    if (batchData) {
      showData();
    }
  }, [batchData, saveData, fetchData]);

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

                // const updateMode = {mode: 'modified', update: true};
                realm.create(Client, clientData, 'modified');
              });
            });
            Alert.alert('Success', 'Data saved successfully!');
            realm.close();
            showData();
          } catch (error) {
            Alert.alert('Error', 'Error saving data!');
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
      console.error('Error retrieving data:', error);
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
                  name="md-cloud-download-outline"
                  size={24}
                  color={colors.primaryLight}
                />
              </TouchableOpacity>
            );
          }}
        />
        <TabTag
          style={{paddingHorizontal: 10, paddingBottom: 20, marginTop: 10}}
          tabs={tabs}
          tab={tab}
          onChange={setTab}
        />
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
              navigation.navigate(ROUTES.VIEW, {item: item});
            };

            return (
              <Project02
                title={clientName}
                description={item.DateOfBirth}
                isPaid={item.isPaid}
                total_loans={totalDue ? formatNumber(totalDue) : ''}
                onPress={() => handlePress(item)}
                style={{
                  marginBottom: 20,
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
    loading,
    saveData,
    clientData,
    navigation,
    tab,
    tabs,
  ]);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
