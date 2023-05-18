import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import {
  Avatars,
  Button,
  CardReport02,
  CardReport03,
  CardReport04,
  Header,
  Icon,
  ModalPopup,
  PButtonAddUser,
  ProductSpecGrid,
  SafeAreaView,
  Tag,
  Text,
  TextInput,
} from '../../app/components';
import {BaseColor, BaseStyle, useTheme} from '../../app/config';
import {PProject} from '../../app/data';
import styles from './styles';
import Modal from 'react-native-modal';
import {CollectorList, collectorList} from '../../app/database/allSchema';
import {loanData} from '../../app/data/loans';

const ProjectView = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [members, setMembers] = useState(PProject[0].members);

  const [item, setItem] = useState(PProject[0]);

  const [principal, setPrincipal] = useState(null);
  const [getInterest, setInterest] = useState(null);
  const [getPenalty, setPenalty] = useState(null);

  const [openModal, setModal] = useState(false);
  const [openModal2, setModal2] = useState(false);
  const [openModal3, setModal3] = useState(false);

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [
    route,
    openModal,
    openModal2,
    openModal3,
    principal,
    getInterest,
    getPenalty,
  ]);

  const updateMe = async id => {
    let aa = principal ? principal : item.principal;

    try {
      const realm = await Realm.open({schema: [collectorList]});
      const collector = realm.objectForPrimaryKey(CollectorList, id); // id is the primary key of the object you want to edit
      realm.write(() => {
        collector.principal = aa;
      });
      console.log('Successfully Edited');
      setPrincipal(null);
      setInterest(null);
      setPenalty(null);
      setModal(false);
      setModal2(false);
      setModal3(false);
      realm.close();
    } catch (error) {
      Alert.alert('ERROR: ', error);
    }
  };

  const updateMe2 = async id => {
    let aa = getInterest ? getInterest : item.interest;

    try {
      const realm = await Realm.open({schema: [collectorList]});
      const collector = realm.objectForPrimaryKey(CollectorList, id); // id is the primary key of the object you want to edit
      realm.write(() => {
        collector.interest = aa;
      });
      console.log('Successfully Edited');
      setPrincipal(null);
      setInterest(null);
      setPenalty(null);
      setModal(false);
      setModal2(false);
      setModal3(false);
      realm.close();
    } catch (error) {
      Alert.alert('ERROR: ', error);
    }
  };

  const updateMe3 = async id => {
    let aa = getPenalty ? getPenalty : item.penalty;

    try {
      const realm = await Realm.open({schema: [collectorList]});
      const collector = realm.objectForPrimaryKey(CollectorList, id); // id is the primary key of the object you want to edit
      realm.write(() => {
        collector.penalty = aa;
      });
      console.log('Successfully Edited');
      setPrincipal(null);
      setInterest(null);
      setPenalty(null);
      setModal(false);
      setModal2(false);
      setModal3(false);
      realm.close();
    } catch (error) {
      Alert.alert('ERROR: ', error);
    }
  };

  // principal
  function viewModal(openModal) {
    return (
      <ModalPopup visible={openModal} modalStyle="w-[230] h-[200] rounded">
        <View className="h-[190] w-full">
          <View className="flex-row w-fit h-[30] mx-[5] items-center justify-between border-b">
            <Text
              className="text-xs font-bold w-fit text-black"
              numberOfLines={1}
              ellipsizeMode="tail">
              Input Amount
            </Text>
            <View className="justify-between items-end">
              <TouchableOpacity onPress={() => setModal(false)}>
                <Icon name="times" size={23} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full h-full items-center justify-center ">
            <View className="p-[10]">
              <View style={styles.specifications} className="border rounded-md">
                <TextInput
                  style={[BaseStyle.textInput, {height: 60, width: 200}]}
                  autoCorrect={false}
                  placeholder={'Update Amount'}
                  selectionColor={colors.primary}
                  value={principal}
                  keyboardType="numeric"
                  onChangeText={text => setPrincipal(text)}
                />
              </View>
              <View style={styles.specifications}>
                <Button full onPress={() => updateMe(item.id)}>
                  Set
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ModalPopup>
    );
  }
  // interest
  function viewModal2(openModal2) {
    return (
      <ModalPopup visible={openModal2} modalStyle="w-[230] h-[200] rounded">
        <View className="h-[190] w-full">
          <View className="flex-row w-fit h-[30] mx-[5] items-center justify-between border-b">
            <Text
              className="text-xs font-bold w-fit text-black"
              numberOfLines={1}
              ellipsizeMode="tail">
              Input Amount
            </Text>
            <View className="justify-between items-end">
              <TouchableOpacity onPress={() => setModal2(false)}>
                <Icon name="times" size={23} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full h-full items-center justify-center ">
            <View className="p-[10]">
              <View style={styles.specifications} className="border rounded-md">
                <TextInput
                  style={[BaseStyle.textInput, {height: 60, width: 200}]}
                  autoCorrect={false}
                  placeholder={'Update Amount'}
                  selectionColor={colors.primary}
                  value={interest}
                  keyboardType="numeric"
                  onChangeText={text => setInterest(text)}
                />
              </View>
              <View style={styles.specifications}>
                <Button full onPress={() => updateMe2(item.id)}>
                  Update
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ModalPopup>
    );
  }
  // penalty
  function viewModal3(openModal3) {
    return (
      <ModalPopup visible={openModal3} modalStyle="w-[230] h-[200] rounded">
        <View className="h-[190] w-full">
          <View className="flex-row w-fit h-[30] mx-[5] items-center justify-between border-b">
            <Text
              className="text-xs font-bold w-fit text-black"
              numberOfLines={1}
              ellipsizeMode="tail">
              Input Amount
            </Text>
            <View className="justify-between items-end">
              <TouchableOpacity onPress={() => setModal3(false)}>
                <Icon name="times" size={23} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full h-full items-center justify-center ">
            <View className="p-[10]">
              <View style={styles.specifications} className="border rounded-md">
                <TextInput
                  style={[BaseStyle.textInput, {height: 60, width: 200}]}
                  autoCorrect={false}
                  placeholder={'Update Amount'}
                  selectionColor={colors.primary}
                  value={penalty}
                  keyboardType="numeric"
                  onChangeText={text => setPenalty(text)}
                />
              </View>
              <View style={styles.specifications}>
                <Button full onPress={() => updateMe3(item.id)}>
                  Update
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ModalPopup>
    );
  }

  let totalPrincipal = 0;
  let totalInterest = 0;
  let totalPenalty = 0;

  const interest = parseFloat(item.principal);

  const penalty = parseFloat(item.penalty);

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

  const data = totalAmount.toFixed(2);

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
        <View>
          <Text title3 body1 className="text-xl font-bold">
            {item.name}
          </Text>
          <Text body2 light style={{paddingVertical: 10}}>
            {item.description}
          </Text>

          {viewModal(openModal, setModal)}
          {viewModal2(openModal2, setModal2)}
          {viewModal3(openModal3, setModal3)}

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={item.principal}
              description={t('principal')}
              onPress={() => setModal(true)}
            />

            <ProductSpecGrid
              style={{flex: 1}}
              title={item.interest}
              description={t('interest')}
              onPress={() => setModal2(true)}
            />

            <ProductSpecGrid
              style={{flex: 1}}
              title={item.penalty}
              description={t('penalty')}
              onPress={() => setModal3(true)}
            />
          </View>

          <View style={styles.specifications}>
            <ProductSpecGrid
              style={{flex: 1}}
              title={formattedAmount}
              description={t('total')}
              isEnable={false}
              onPress={() => setModal(true)}
            />
          </View>

          <View className="p-[10]">
            <View style={styles.specifications} className="border rounded-md">
              <TextInput
                style={[BaseStyle.textInput, {height: 60}]}
                autoCorrect={false}
                placeholder={'Input Amount to pay'}
                selectionColor={colors.primary}
              />
            </View>
            <View style={styles.specifications}>
              <Button full>Update</Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectView;
