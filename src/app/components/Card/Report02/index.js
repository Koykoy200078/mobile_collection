import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {parseHexTransparency} from '../../../utils';
import {BaseStyle, useTheme} from '../../../config';
import Icon from '../../../components/Icon';
import Text from '../../../components/Text';
import styles from './styles';
import {CheckBox, TextInput} from '../..';
import Tooltip from 'react-native-walkthrough-tooltip';

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
  isVisible,
  onClose,
  onPressView,

  principal,
  interest,
  penalty,

  placeholder,
  enableTooltip = false,
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
        <View style={[styles.header]} className="justify-between">
          <Text headline style={{marginBottom: 5}}>
            {title}
          </Text>

          {enableTooltip ? (
            <Tooltip
              isVisible={isVisible}
              content={
                <View className="w-[120]">
                  <View className="flex-row justify-between">
                    <Text className="font-bold">Principal: </Text>
                    <Text>{principal}</Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="font-bold">Interest: </Text>
                    <Text>{interest}</Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="font-bold">Penalty: </Text>
                    <Text>{penalty}</Text>
                  </View>
                </View>
              }
              placement="bottom"
              onClose={onClose}>
              <TouchableOpacity style={{marginRight: 10}} onPress={onPressView}>
                <Icon name="info-circle" size={17} color={colors.text} />
              </TouchableOpacity>
            </Tooltip>
          ) : null}
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
              placeholder={placeholder}
              selectionColor={colors.primary}
              value={value ? value : ''}
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
