import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Alert, FlatList, ScrollView, View} from 'react-native';
import {PTasks, PTaskPriority, PTaskStatus, PTaskType} from '../../app/data';
import {
  Header,
  Icon,
  Ticket,
  PSelectOption,
  SafeAreaView,
  Tag,
  Text,
} from '../../app/components';
import {BaseColor, BaseStyle, useTheme} from '../../app/config';
import * as Utils from '../../app//utils';
import styles from './styles';
import {
  CollectorList,
  collectorList,
  queryAllTodoList,
} from '../../app/database/allSchema';
import Realm from 'realm';

const Task = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [tasks, setTasks] = useState(PTasks);
  const [sort, setSort] = useState('sort');
  const [type, setType] = useState([]);
  const [status, setStatus] = useState([]);
  const [priority, setPriority] = useState([]);
  const [data, setData] = useState([]);

  const handleSort = () => {
    const tasksInline = [...PTasks];
    tasksInline.sort((a, b) => {
      var priorityA = a.priorityID;
      var priorityB = b.priorityID;
      if (priorityB < priorityA) {
        return sort === 'caret-down' ? -1 : 1;
      }
      if (priorityB > priorityA) {
        return sort === 'caret-down' ? 1 : -1;
      }

      return 0;
    });
    return tasksInline;
  };

  const onSort = () => {
    // Utils.enableExperimental();
    // switch (sort) {
    //   case 'sort':
    //     setTasks(handleSort());
    //     setSort('caret-down');
    //     break;
    //   case 'caret-down':
    //     setTasks(handleSort());
    //     setSort('caret-up');
    //     break;
    //   case 'caret-up':
    //     setTasks(PTasks);
    //     setSort('sort');
    //     break;
    //   default:
    //     setTasks(PTasks);
    //     setSort('sort');
    //     break;
    // }
    onShow();
  };
  const goTaskDetail = item => {
    navigation.navigate('TaskView', {item: item});
  };

  const onFilter = data => {
    if (data.length > 0) {
      setTasks(PTasks.filter(item => item.id <= data.length));
    } else {
      setTasks(PTasks);
    }
  };

  const onChangeType = typeInline => {
    onFilter(typeInline);
    setType(typeInline);
  };
  const onChangePriority = typeInline => {
    onFilter(typeInline);
    setPriority(typeInline);
  };
  const onChangeStatus = typeInline => {
    onFilter(typeInline);
    setStatus(typeInline);
  };

  useEffect(() => {
    const onShow = async () => {
      try {
        const realm = await Realm.open({
          schema: [collectorList],
        });
        const data = realm.objects(CollectorList);
        setData(data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    onShow();
  }, []);

  console.log('data: ', data);
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('tasks')}
        renderRight={() => {
          return (
            <Text headline primaryColor>
              {t('create')}
            </Text>
          );
        }}
        onPressRight={() => {
          navigation.navigate('TaskCreate');
        }}
      />
      <View style={[styles.filter, {borderColor: colors.border}]}>
        <Tag
          gray
          style={{
            borderRadius: 3,
            backgroundColor: BaseColor.kashmir,
            marginHorizontal: 5,
            paddingVertical: 3,
          }}
          textStyle={{
            paddingHorizontal: 4,
            color: BaseColor.whiteColor,
          }}
          icon={<Icon name={sort} color={BaseColor.whiteColor} size={10} />}
          onPress={onSort}>
          {t('sort')}
        </Tag>
        <Tag
          gray
          style={{
            borderRadius: 3,
            backgroundColor: BaseColor.kashmir,
            marginHorizontal: 5,
            paddingVertical: 3,
          }}
          textStyle={{
            paddingHorizontal: 4,
            color: BaseColor.whiteColor,
          }}
          icon={
            <Icon name="sliders-h" color={BaseColor.whiteColor} size={10} />
          }
          onPress={() => navigation.navigate('Filter')}>
          {t('filter')}
        </Tag>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <PSelectOption
            title={t('type')}
            options={PTaskType}
            value={type}
            onPress={item => onChangeType(item)}
          />
          <PSelectOption
            title={t('priority')}
            options={PTaskPriority}
            value={priority}
            onPress={item => onChangePriority(item)}
          />
          <PSelectOption
            title={t('status')}
            options={PTaskStatus}
            value={status}
            onPress={item => onChangeStatus(item)}
          />
        </ScrollView>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({item}) => (
          <Ticket
            title={item.title}
            description={item.description}
            priority={item.priority}
            date={item.date}
            comments={item.comments}
            members={item.members}
            onPress={() => goTaskDetail(item)}
            style={{
              marginBottom: 20,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Task;
