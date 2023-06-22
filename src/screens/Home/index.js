import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, FlatList, TouchableOpacity, View} from 'react-native';
import {PProjectHome} from '../../app/data';
import {BaseColor, BaseStyle, useTheme} from '../../app/config';
import * as Utils from '../../app/utils';
import {
  Header,
  Icon,
  PieChart,
  Project02,
  SafeAreaView,
  TabTag,
  Text,
} from '../../app/components';
import styles from './styles';
import {CollectorList, collectorList} from '../../app/database/allSchema';
import {BASE_URL} from '../../app/config/url';
import {loanData} from '../../app/data/loans';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {getDetails} from '../../app/reducers/batchDetails';

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

  useEffect(() => {}, [batchData, getData]);

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
      const CollectorListSchema = {
        name: 'DownloadedData',
        properties: {
          id: 'int',
          name: 'string',
          regularLoans: 'float',
          emergencyLoans: 'float',
          savingDeposit: 'float',
          shareCapital: 'float',
        },
        primaryKey: 'id',
      };
    } catch (error) {
      console.error(error);
    }
  };

  const goProjectDetail = item => () => {
    navigation.navigate('ViewScreen', {item: item});
  };

  const renderContent = () => {
    return (
      <View style={{flex: 1}}>
        <Header title={'Collector List'} />
        <TabTag
          style={{paddingHorizontal: 10, paddingBottom: 20, marginTop: 10}}
          tabs={tabs}
          tab={tab}
          onChange={tabData => setTab(tabData)}
        />
        {!getData ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No data found</Text>

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => fetchData()}>
              <Text style={{color: '#FFFFFF'}}>Fetch Data</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.paddingFlatList}
            data={getData?.data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({item}) => {
              let total = item.TOTALDUE;

              const formatNumber = number => {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              };

              return (
                <Project02
                  title={item.CLIENTNAME}
                  description={item.SLDESCR}
                  total_loans={formatNumber(total)}
                  onPress={goProjectDetail(item)}
                  style={{
                    marginBottom: 20,
                  }}
                />
              );
            }}
          />
        )}
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
