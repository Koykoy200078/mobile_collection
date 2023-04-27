import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {BaseColor, useTheme} from '../../../config';
import Icon from '../../../components/Icon';
import ModalFilter from '../../../components/ModalFilter';
import Text from '../../../components/Text';
import styles from './styles';

export default function FilterSort(props) {
  const {style, modeView, onFilter, onChangeView, labelCustom} = props;

  const {colors} = useTheme();
  const {t} = useTranslation();
  const backgroundColor = colors.background;

  const [sortOption, setSortOption] = useState(props.sortOption);
  const [sortSelected, setSortSelected] = useState(props.sortSelected);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value === sortSelected.value,
        };
      }),
    );
  }, []);

  const onSelectFilter = selected => {
    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value === selected.value,
        };
      }),
    );
  };

  const onOpenSort = () => {
    setModalVisible(true);

    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value === sortSelected.value,
        };
      }),
    );
  };

  const onApply = () => {
    const {onChangeSort} = props;
    const sorted = sortOption.filter(item => item.checked);
    if (sorted.length > 0) {
      setSortSelected(sorted[0]);
      setModalVisible(false);
      onChangeSort(sorted[0]);
    }
  };

  const customAction =
    modeView !== '' ? (
      <TouchableOpacity onPress={onChangeView} style={styles.contentModeView}>
        <Icon name={modeView} size={16} color={BaseColor.grayColor} solid />
      </TouchableOpacity>
    ) : (
      <Text headline grayColor numberOfLines={1} style={styles.contentModeView}>
        {labelCustom}
      </Text>
    );

  return (
    <View style={[styles.contain, {backgroundColor}, style]}>
      <ModalFilter
        options={sortOption}
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setSortOption(props.sortOption);
        }}
        onApply={onApply}
        onSelectFilter={onSelectFilter}
      />
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => onOpenSort()}>
        <Icon
          name={sortSelected.icon}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
        <Text headline grayColor style={{marginLeft: 5}}>
          {t(sortSelected.text)}
        </Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {customAction}
        <View style={styles.line} />
        <TouchableOpacity onPress={onFilter} style={styles.contentFilter}>
          <Icon name="filter" size={16} color={BaseColor.grayColor} solid />
          <Text headline grayColor style={{marginLeft: 5}}>
            {t('filter')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

FilterSort.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  sortOption: PropTypes.array,
  sortSelected: PropTypes.object,
  modeView: PropTypes.string,
  labelCustom: PropTypes.string,
  onChangeSort: PropTypes.func,
  onChangeView: PropTypes.func,
  onFilter: PropTypes.func,
};

FilterSort.defaultProps = {
  style: {},
  sortOption: [
    {
      value: 'lasted_post',
      icon: 'sort-amount-up',
      text: 'lasted_post',
    },
    {
      value: 'oldest_post',
      icon: 'sort-amount-down',
      text: 'oldest_post',
    },
    {
      value: 'most_view',
      icon: 'sort-amount-up',
      text: 'most_view',
    },
  ],
  sortSelected: {
    value: 'high_rate',
    icon: 'sort-amount-up',
    text: 'hightest_rating',
  },
  modeView: '',
  labelCustom: '',
  onChangeSort: () => {},
  onChangeView: () => {},
  onFilter: () => {},
};
