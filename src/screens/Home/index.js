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

  console.log('data ==> ', data);

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
        <FlatList
          contentContainerStyle={styles.paddingFlatList}
          data={data ? data : loanData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({item}) => {
            let a = parseFloat(
              item.data.map(data => data.regular.map(item => item.principal)),
            );
            let aa = parseFloat(
              item.data.map(data => data.regular.map(item => item.interest)),
            );
            let aaa = parseFloat(
              item.data.map(data => data.regular.map(item => item.penalty)),
            );
            const regularAmount = a + aa + aaa;

            let b = parseFloat(
              item.data.map(data => data.emergency.map(item => item.principal)),
            );
            let bb = parseFloat(
              item.data.map(data => data.emergency.map(item => item.interest)),
            );
            let bbb = parseFloat(
              item.data.map(data => data.emergency.map(item => item.penalty)),
            );
            const emergencyAmount = b + bb + bbb;

            let c = parseFloat(item.data.map(data => data.saving));

            let d = parseFloat(item.data.map(data => data.share));
            // Calculate the total amount
            const totalAmount = regularAmount + emergencyAmount + c + d;
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
