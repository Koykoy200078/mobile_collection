import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {parseHexTransparency} from '../../../utils';
import {BaseStyle, useTheme} from '../../../config';
import Icon from '../../../components/Icon';
import Text from '../../../components/Text';
import styles from './styles';
import {CheckBox, TextInput} from '../..';

const CardReport02 = ({
  title = '',
  checkedBoxLabel = '',
  style = {},
  onPress = () => {},
  disabled = false,

  checkBoxEnabled,
  checkBox,
  value,
  onChangeText,
  editable,
}) => {
  const {colors} = useTheme();

  return (
    <View
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
        ]}>
        <View style={[styles.header]}>
          <Text headline style={{marginBottom: 5}} className="flex-row">
            {title}
          </Text>
        </View>

        <View className="flex-col items-start space-y-1">
          <View className="flex-row items-center">
            <View className="flex-row items-center w-[190]">
              {checkBoxEnabled ? (
                <CheckBox
                  title=""
                  checked={checkBox}
                  color={colors.primary}
                  style={{flex: 1}}
                />
              ) : null}
              <Text
                headline
                light
                className="flex-row text-xs"
                numberOfLines={1}
                ellipsizeMode="tail">
                {checkedBoxLabel}
              </Text>
            </View>

            <TextInput
              style={[
                {
                  height: 40,
                  width: 117,
                  fontStyle: 'italic',
                  flex: 1,
                  backgroundColor: '#F1F1F1',
                },
              ]}
              textAlign={'right'}
              autoCorrect={false}
              placeholder={'0.00'}
              selectionColor={colors.primary}
              value={parseInt(value) ? value : ''}
              keyboardType="numeric"
              editable={editable}
              onChangeText={onChangeText}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

CardReport02.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  price: PropTypes.string,
  icon: PropTypes.string,
};

export default CardReport02;
