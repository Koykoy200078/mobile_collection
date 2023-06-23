import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView, View, useWindowDimensions} from 'react-native';
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
import {useDispatch} from 'react-redux';

const ViewScreen = () => {
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const myRef = useRef(null);
  const [item, setItem] = useState('');

  const [isCollapsed, setIsCollapsed] = useState({});
  const [inputAmounts, setInputAmounts] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [collectionData, setCollectionData] = useState(null);

  console.log('isCollapsed ==> ', isCollapsed);
  console.log('inputAmounts ==> ', inputAmounts);

  useEffect(() => {
    calculateTotalValue();
  }, [isCollapsed, inputAmounts]);

  const handleAccordionToggle = index => {
    setIsCollapsed(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleInputChange = (index, value) => {
    setInputAmounts(prevState => ({
      ...prevState,
      [index]: value,
    }));
  };

  const calculateTotalValue = () => {
    let total = 0;
    Object.values(inputAmounts).forEach(value => {
      if (value) {
        total += parseFloat(value);
      }
    });
    setTotalValue(total);
  };

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [route]);

  let fName = item.FName ? item.FName : '';
  let mName = item.MName ? item.MName : '';
  let lName = item.LName ? item.LName + ', ' : '';
  let sName = item.SName ? item.SName : '';
  let getName = lName + fName + ' ' + mName + ' ' + sName;
  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, {flex: 1}]}
      edges={['right', 'top', 'left']}>
      <Header
        title="Account View"
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.text}
              enableRTL={true}
            />
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
        <View key={item.id}>
          <Text title3 body1 className="text-xl font-bold">
            {getName}
          </Text>

          <View style={styles.specifications}>
            {item &&
              item.collections &&
              item.collections.map((item, index) => {
                const a = parseFloat(item.PRINDUE);
                const b = parseFloat(item.INTDUE);
                const c = parseFloat(item.PENDUE);

                const total = a + b + c;
                const formatNumber = number => {
                  return number
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                };

                const id = item.REF_NO; // Unique identifier for the item

                return (
                  <CardReport02
                    key={index}
                    style={{flex: 1, width: width - 30, marginVertical: 10}}
                    title={item.SLDESCR}
                    description={'REF: ' + item.REF_NO}
                    placeholder="0.00"
                    checkedBoxLabel="Input Amount"
                    value={inputAmounts[id] || ''}
                    onChangeText={val => handleInputChange(id, val)}
                    checkBoxEnabled={true}
                    checkBox={!!inputAmounts[id]}
                    isActive={isCollapsed[index] ? 'angle-down' : 'angle-up'}
                    enableTooltip={true}
                    toggleAccordion={() => handleAccordionToggle(index)}
                    isCollapsed={isCollapsed[index]}
                    principal={formatNumber(item.PRINDUE)}
                    interest={formatNumber(item.INTDUE)}
                    penalty={formatNumber(item.PENDUE)}
                    total={formatNumber(total.toFixed(2))}
                  />
                );
              })}
          </View>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={totalValue ? totalValue.toFixed(2) : '0.00'}
              description={t('total_amount')}
              isEnable={false}
            />
          </View>

          <View className="p-[10]">
            <View style={styles.specifications}>
              <Button
                full
                onPress={() =>
                  navigation.navigate('CheckOutScreen', {
                    name: getName,
                    allData: item,
                    inputAmounts: inputAmounts,
                    total: parseFloat(totalValue),
                  })
                }>
                Checkout
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewScreen;
