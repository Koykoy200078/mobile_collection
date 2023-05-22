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
import {loanData} from '../../app/data/loans';

const Home = props => {
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
  const [data, setData] = useState(null);

  const onReload = async () => {
    try {
      const realm = await Realm.open({
        schema: [collectorList],
      });
      const data = realm.objects(CollectorList);
      setData(data);
      Alert.alert('data reloaded');
    } catch (error) {
      console.log('Error fetching data:', error);
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
          renderRight={() => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Cautions',
                    'Are you sure you want to reload the data? This will delete all the data you have entered. Please make sure you have synced your data before proceeding.',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'Confirm',
                        onPress: () => {
                          onReload();
                        },
                      },
                    ],
                  );
                }}>
                <Icon name="sync" size={20} color={colors.text} />
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
        <FlatList
          contentContainerStyle={styles.paddingFlatList}
          data={data ? data : loanData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({item}) => {
            let totalPrincipal = 0;
            let totalInterest = 0;
            let totalPenalty = 0;

            const interest = parseFloat(item.principal);

            const penalty = parseFloat(item.penalty) / 12;

            // Add the principal, interest, and penalty to the totals
            totalPrincipal += parseFloat(item.principal);
            totalInterest += interest;
            totalPenalty += penalty;

            // Calculate the total amount
            const totalAmount = totalPrincipal + totalInterest + totalPenalty;
            const formattedAmount = totalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            return (
              <Project02
                title={item.name}
                description={item.description}
                total_loans={formattedAmount}
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
