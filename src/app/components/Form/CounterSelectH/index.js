import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {BaseColor, useTheme} from '../../../config';
import Icon from '../../../components/Icon';
import Text from '../../../components/Text';
import styles from './styles';

export default function CounterSelectH(props) {
  const [value, setValue] = useState(props.value);
  const {style, onChange} = props;
  const {colors} = useTheme();

  const onHandleChange = type => {
    let valueNew = 0;
    if (type === 'up') {
      valueNew = value + 1;
    } else {
      valueNew = value - 1 > 0 ? value - 1 : 0;
    }
    setValue(valueNew);
    onChange(valueNew);
  };

  return (
    <View
      style={[
        styles.contentPicker,
        {
          backgroundColor: colors.background,
          flexDirection: 'column',
        },
        style,
      ]}>
      <TouchableOpacity onPress={() => onHandleChange('up')}>
        <Icon name="plus-circle" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text title2 style={{width: 'auto', textAlign: 'center'}}>
        {value}
      </Text>
      <TouchableOpacity onPress={() => onHandleChange('down')}>
        <Icon name="minus-circle" size={24} color={BaseColor.grayColor} />
      </TouchableOpacity>
    </View>
  );
}

CounterSelectH.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  detail: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

CounterSelectH.defaultProps = {
  style: {},
  label: 'Adults',
  detail: '>= 12 years',
  value: 1,
  onChange: () => {},
};
