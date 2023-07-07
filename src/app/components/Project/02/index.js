import React from 'react';
import PropTypes from 'prop-types';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../config';

import Text from '../../../components/Text';
import styles from './styles';

const Project02 = ({
  title = '',
  style = {},
  onPress = () => {},
  description = '',
  disabled = false,
  total_loans = 0,
  isPaid,
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
        ]}>
        <View style={styles.viewProgress}>
          <View style={styles.viewLeft}>
            <Text headline>{title}</Text>
            <Text caption2 light style={styles.description}>
              {description}
            </Text>
          </View>
          <View className="flex-col items-end">
            <View>
              {isPaid ? (
                <Image
                  source={{
                    uri: 'https://www.iconfinder.com/icons/1930264/download/png/512',
                  }}
                  style={{width: 20, height: 20}}
                />
              ) : null}
            </View>
            <View style={styles.viewRight}>
              <Text footnote light>
                {total_loans}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

Project02.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  progress: PropTypes.number,
  days: PropTypes.string,
  members: PropTypes.array,
};

export default Project02;
