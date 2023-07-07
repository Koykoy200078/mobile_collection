import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {BaseStyle, ROUTES, useTheme} from '../../app/config';
import styles from './styles';
import {
  Button,
  CardReport02,
  Header,
  ProductSpecGrid,
} from '../../app/components';
import {Icons} from '../../app/config/icons';

export default function ({navigation, route}) {
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();
  const {colors} = useTheme();
  const myRef = useRef(null);
  const [item, setItem] = useState('');
  const [isCollapsed, setIsCollapsed] = useState({});
  const [inputAmounts, setInputAmounts] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    calculateTotalValue();
  }, [isCollapsed, inputAmounts]);

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route.params.item);
    }
  }, [route]);

  const handleAccordionToggle = index => {
    setIsCollapsed(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  console.log('inputAmounts: ', inputAmounts);

  const handleInputChange = (index, name, value) => {
    setInputAmounts(prevState => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        [name]: value,
      },
    }));
  };

  const calculateTotalValue = () => {
    let total = 0;
    Object.values(inputAmounts).forEach(values => {
      Object.values(values).forEach(value => {
        if (value) {
          total += parseFloat(value);
        }
      });
    });
    setTotalValue(total);
  };

  const totalAmount = totalValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
        renderLeft={() => (
          <Icons.FontAwesome5
            name="angle-left"
            size={20}
            color={colors.text}
            enableRTL={true}
          />
        )}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View key={item.id}>
          <Text
            title3
            body1
            className="text-xl font-bold text-black dark:text-white">
            {getName}
          </Text>

          <View style={styles.specifications}>
            {item &&
              item.collections &&
              item.collections.map((collection, index) => {
                const a = parseFloat(collection.PRINDUE);
                const b = parseFloat(collection.INTDUE);
                const c = parseFloat(collection.PENDUE);

                const total = a + b + c;
                const formatNumber = number => {
                  return number
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                };

                const id = collection.REF_NO; // Unique identifier for the item
                const name = collection.SLDESCR;

                return (
                  <CardReport02
                    key={index}
                    style={{flex: 1, width: width - 30, marginVertical: 10}}
                    title={name}
                    description={'REF# ' + collection.REF_NO}
                    placeholder="0.00"
                    checkedBoxLabel="Input Amount"
                    value={inputAmounts[id]?.SLDESCR || ''}
                    onChangeText={val => handleInputChange(id, 'SLDESCR', val)}
                    checkBoxEnabled={true}
                    checkBox={!!inputAmounts[id]?.SLDESCR}
                    isActive={isCollapsed[index] ? 'angle-down' : 'angle-up'}
                    enableTooltip={true}
                    toggleAccordion={() => handleAccordionToggle(index)}
                    isCollapsed={isCollapsed[index]}
                    principal={formatNumber(collection.PRINDUE)}
                    interest={formatNumber(collection.INTDUE)}
                    penalty={formatNumber(collection.PENDUE)}
                    total={formatNumber(total.toFixed(2))}
                  />
                );
              })}
          </View>

          <View style={styles.specifications}>
            {item &&
              item.collections &&
              item.collections.map((collection, index) => {
                const a = parseFloat(collection.PRINDUE);
                const b = parseFloat(collection.INTDUE);
                const c = parseFloat(collection.PENDUE);

                const total = a + b + c;
                const formatNumber = number => {
                  return number
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                };

                const id = collection.REF_NO; // Unique identifier for the item

                return (
                  <CardReport02
                    key={index}
                    style={{flex: 1, width: width - 30, marginVertical: 10}}
                    title={'Share Capital'}
                    description={'REF# ' + collection.REF_NO}
                    placeholder="0.00"
                    checkedBoxLabel="Input Amount"
                    value={inputAmounts[id]?.SHARECAPITAL || ''}
                    onChangeText={val =>
                      handleInputChange(id, 'SHARECAPITAL', val)
                    }
                    checkBoxEnabled={true}
                    checkBox={!!inputAmounts[id]?.SHARECAPITAL}
                  />
                );
              })}
          </View>

          <View style={styles.specifications}>
            {item &&
              item.collections &&
              item.collections.map((collection, index) => {
                const a = parseFloat(collection.PRINDUE);
                const b = parseFloat(collection.INTDUE);
                const c = parseFloat(collection.PENDUE);

                const total = a + b + c;
                const formatNumber = number => {
                  return number
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                };

                const id = collection.REF_NO; // Unique identifier for the item

                return (
                  <CardReport02
                    key={index}
                    style={{flex: 1, width: width - 30, marginVertical: 10}}
                    title={'Deposit'}
                    description={'REF# ' + collection.REF_NO}
                    placeholder="0.00"
                    checkedBoxLabel="Input Amount"
                    value={inputAmounts[id]?.DEPOSIT || ''}
                    onChangeText={val => handleInputChange(id, 'DEPOSIT', val)}
                    checkBoxEnabled={true}
                    checkBox={!!inputAmounts[id]?.DEPOSIT}
                  />
                );
              })}
          </View>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={totalAmount ? totalAmount : '0.00'}
              description={'Total Amount Due'}
              isEnable={false}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              full
              onPress={() =>
                navigation.navigate(ROUTES.CHECKOUT, {
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
      </ScrollView>
    </SafeAreaView>
  );
}
