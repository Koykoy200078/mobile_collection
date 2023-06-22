import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../config';
import Icon from '../../../components/Icon';
import Text from '../../../components/Text';
import styles from './styles';
import {CheckBox, TextInput} from '../..';
import Tooltip from 'react-native-walkthrough-tooltip';
import Collapsible from 'react-native-collapsible';

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

  toggleAccordion,
  isCollapsed,
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
            <View>
              <TouchableOpacity onPress={toggleAccordion}>
                <View className="flex-row items-center">
                  <Icon name="info-circle" size={17} color={colors.text} />
                  <Text
                    caption2
                    style={{color: colors.text}}
                    numberOfLines={1}
                    className="ml-1 text-xs font-bold">
                    See More
                  </Text>
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={isCollapsed}>
                <View className="w-[120] mb-1">
                  <View className="flex-row justify-between">
                    <Text className="font-bold">Principal: </Text>
                    <Text className="font-bold">{principal}</Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="font-bold">Interest: </Text>
                    <Text className="font-bold">{interest}</Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="font-bold">Penalty: </Text>
                    <Text className="font-bold">{penalty}</Text>
                  </View>
                </View>
              </Collapsible>
            </View>
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
