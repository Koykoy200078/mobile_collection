import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {BaseStyle, useTheme} from '../../app/config';
import {
  Button,
  Header,
  Icon,
  Project02,
  SafeAreaView,
  TabTag,
  Text,
} from '../../app/components';
import styles from './styles';
import {
  Client,
  ClientSchema,
  CollectionSchema,
} from '../../app/database/allSchema';
import {useDispatch, useSelector} from 'react-redux';
import {getDetails} from '../../app/reducers/batchDetails';
import {FlashList} from '@shopify/flash-list';

const Home = props => {
  const batchData = useSelector(state => state.batchDetails.data);

  const dispatch = useDispatch();
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const tabs = [
    {
      id: 'all',
      title: t('all_clients'),
    },
  ];

  const [tab, setTab] = useState(tabs[0]);
  const [getData, setData] = useState(batchData);
  const [hasData, setHasData] = useState(false);

  // offline data
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (getData) {
      if (hasData) {
      } else {
        saveData();
      }
    } else {
      console.log('false');
    }
  }, [batchData, getData, hasData, clientData]);

  const fetchData = async () => {
    dispatch(
      getDetails({
        branchid: 0,
        collectorid: 1,
        clientid: 1974,
        slclass: [12, 13],
      }),
    );
  };

  const saveData = async () => {
    try {
      const realm = await Realm.open({
        schema: [ClientSchema, CollectionSchema],
      });
      realm.write(() => {
        getData.data.forEach(client => {
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
            MName: client.MName || '', // Handle null MName values
            SName: client.SName || '',
            DateOfBirth: client.DateOfBirth ? formattedDateOfBirth : '', // Handle null DateOfBirth values
            SMSNumber: client.SMSNumber || '',
            collections,
          };

          realm.create(Client, clientData, 'modified');
        });
      });
      console.log('Data saved offline successfully!');
      setHasData(true);
    } catch (error) {
      console.error('Error saving data offline:', error);
      setHasData(false);
    }
  };

  const showData = async () => {
    try {
      const realm = await Realm.open({
        schema: [ClientSchema, CollectionSchema],
      });
      const clients = realm.objects(Client);
      setClientData(Array.from(clients));
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const goProjectDetail = item => () => {
    navigation.navigate('ViewScreen', {item: item});
  };

  const renderContent = () => {
    return (
      <View style={{flex: 1}}>
        <Header
          title={'Collector List'}
          renderLeft={() => {
            return (
              <TouchableOpacity onPress={() => fetchData()}>
                <Icon name="bell" size={24} color={colors.primaryLight} />
              </TouchableOpacity>
            );
          }}
          renderRight={() => {
            return (
              <TouchableOpacity onPress={() => showData()}>
                <Icon name="bell" size={24} color={colors.primaryLight} />
              </TouchableOpacity>
            );
          }}
        />
        <TabTag
          style={{paddingHorizontal: 10, paddingBottom: 20, marginTop: 10}}
          tabs={tabs}
          tab={tab}
          onChange={tabData => setTab(tabData)}
        />
        <FlashList
          contentContainerStyle={styles.paddingFlatList}
          estimatedItemSize={200}
          data={clientData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({item}) => {
            let fName = item.FName ? item.FName : '';
            let mName = item.MName ? item.MName : '';
            let lName = item.LName ? item.LName + ', ' : '';
            let sName = item.SName ? item.SName : '';

            let totalDue = 0;
            let getTotal = item.collections.forEach(data => {
              totalDue += parseFloat(data.TOTALDUE);
            });

            const formatNumber = number => {
              return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            };

            return (
              <Project02
                title={lName + fName + ' ' + mName + ' ' + sName}
                description={item.SLDESCR}
                total_loans={totalDue ? formatNumber(totalDue) : ''}
                onPress={goProjectDetail(item)}
                style={{
                  marginBottom: 20,
                }}
              />
            );
          }}
        />
      </View>
    );
  };

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
