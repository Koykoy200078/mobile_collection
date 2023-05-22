import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../config';
import {parseHexTransparency} from '../../../utils';
import Icon from '../../../components/Icon';
import Text from '../../../components/Text';
import styles from './styles';

const CardReport04 = ({
  style = {},
  refNumber,
  amount,
  description = '',
  contentStyle = {},
  onPress = () => {},
  disabled = false,
}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, style]}
      onPress={onPress}>
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
          contentStyle,
        ]}
        className="space-y-2">
        <View
          style={{flexDirection: 'column', alignItems: 'flex-start'}}
          className="space-y-1">
          <Text headline>{description}</Text>

          <Text caption3 light style={{marginTop: 5, marginLeft: 10}}>
            * Regular Loan
          </Text>
          <Text caption3 light style={{marginTop: 5, marginLeft: 10}}>
            * Emergency Loan
          </Text>
          <Text caption3 light style={{marginTop: 5, marginLeft: 10}}>
            * Savings Deposit
          </Text>
          <Text caption3 light style={{marginTop: 5, marginLeft: 10}}>
            * Share Capital
          </Text>
        </View>

        <View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
          className="space-y-1">
          <Text headline>{refNumber}</Text>

          <Text caption3 light style={{marginTop: 5, marginLeft: 10}}>
            2021-0001
          </Text>
        </View>

        <View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
          className="space-y-1">
          <Text headline>{amount}</Text>

          <Text caption3 light style={{marginTop: 5, marginLeft: 10}}>
            1000.00
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

CardReport04.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  price: PropTypes.string,
  icon: PropTypes.string,
  subTitle1: PropTypes.string,
  subTitle2: PropTypes.string,
  percent1: PropTypes.string,
  percent2: PropTypes.string,
  description: PropTypes.string,
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default CardReport04;
