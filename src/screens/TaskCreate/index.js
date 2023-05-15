import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';
import {Alert, ScrollView, View} from 'react-native';
import {
  FormDoubleSelectOption,
  Header,
  Icon,
  PButtonAddUser,
  SafeAreaView,
  Text,
  TextInput,
  ListOptionSelected,
  ModalOption,
  ModalFilter,
  ProfileAuthor,
} from '../../app/components';
import {BaseColor, BaseStyle, useTheme} from '../../app/config';
import {PTaskStatus, PTaskType, PTaskPriority, FFriends} from '../../app/data';
import ChooseFile from './ChooseFile';
import styles from './styles';
import Realm from 'realm';
import {
  CollectorList,
  collectorList,
  insertNewData,
} from '../../app/database/allSchema';
const TaskCreate = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [headerName, setHeaderName] = useState(t('create_task'));
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState(PTaskStatus[0]);
  const [openType, setOpenType] = useState(false);
  const [type, setType] = useState(PTaskType[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sort, setSort] = useState(PTaskPriority[0]);
  const [sortChose, setSortChose] = useState(PTaskPriority[0]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interest, setInterest] = useState('');
  const [penalty, setPenalty] = useState('');

  useEffect(() => {
    if (route?.params?.item) {
      const item = route?.params?.item;
      setTitle(item.title);
      setDescription(item.description);
      setHeaderName(t('edit_task'));
    }
  }, [route?.params?.item]);

  const onApply = () => {
    setSortChose(sort);
    setModalVisible(false);
  };

  const onAdd = async () => {
    try {
      const realm = await Realm.open({schema: [collectorList]});
      const lastCollectorList = realm
        .objects(CollectorList)
        .sorted('id', true)[0];
      const highestId = lastCollectorList ? lastCollectorList.id + 1 : 1;
      realm.write(() => {
        realm.create(CollectorList, {
          id: highestId,
          name: name,
          description: description,
          principal: principal,
          interest: interest,
          penalty: penalty,
        });
      });
      console.log('Successfully Added');
      setName('');
      setDescription('');
      setPrincipal('');
      setInterest('');
      setPenalty('');
      navigation.goBack();
      realm.close();
    } catch (error) {
      Alert.alert('ERROR: ', error);
    }
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={headerName}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor>
              {t('save')}
            </Text>
          );
        }}
        onPressRight={() => onAdd()}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contain}>
          <Text headline style={styles.title}>
            {t('name')}
          </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={text => setName(text)}
            autoCorrect={false}
            placeholder={t('name')}
            placeholderTextColor={BaseColor.grayColor}
            value={name}
          />

          <Text headline style={styles.title}>
            {t('description')}
          </Text>
          <TextInput
            style={[BaseStyle.textInput, {marginTop: 10, height: 120}]}
            onChangeText={text => setDescription(text)}
            textAlignVertical="top"
            multiline={true}
            autoCorrect={false}
            placeholder={t('description')}
            placeholderTextColor={BaseColor.grayColor}
            value={description}
          />

          <Text headline style={styles.title}>
            {t('principal')}
          </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={text => setPrincipal(text)}
            autoCorrect={false}
            placeholder={t('principal')}
            placeholderTextColor={BaseColor.grayColor}
            value={principal}
            keyboardType="numeric"
          />

          <Text headline style={styles.title}>
            {t('interest')}
          </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={text => setInterest(text)}
            autoCorrect={false}
            placeholder={t('interest')}
            placeholderTextColor={BaseColor.grayColor}
            value={interest}
            keyboardType="numeric"
          />

          <Text headline style={styles.title}>
            {t('penalty')}
          </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={text => setPenalty(text)}
            autoCorrect={false}
            placeholder={t('penalty')}
            placeholderTextColor={BaseColor.grayColor}
            value={penalty}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskCreate;
