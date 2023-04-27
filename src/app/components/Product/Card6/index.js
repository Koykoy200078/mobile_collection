import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {Images, useTheme, BaseColor} from '../../../config';
import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import Image from '../../../components/Image';
import styles from './styles';

const Card6 = ({
  style = {},
  image = Images.eProduct,
  title = '',
  dateTime = '',
  onPress,
  onMore,
  isPlaying = false,
}) => {
  const {colors} = useTheme();
  return (
    <View
      style={[styles.contain, style, {borderBottomColor: colors.border}]}
      activeOpacity={0.9}>
      <TouchableOpacity onPress={onPress}>
        <Image source={image} style={styles.imageBackgroundCard3} />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={[styles.flex1, styles.title]}>
          <View style={styles.flex1}>
            <TouchableOpacity onPress={onPress}>
              <Text
                bold
                subhead
                numberOfLines={1}
                style={[isPlaying && {color: colors.primary}]}>
                {title}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateTime} caption1 light grayColor>
              {dateTime}
            </Text>
          </View>
          {isPlaying && (
            <Icon
              style={styles.textMore}
              name="volume-up"
              size={18}
              color={colors.primary}
            />
          )}
          <TouchableOpacity style={styles.textMore} onPress={onMore}>
            <Icon name="ellipsis-h" size={10} color={BaseColor.grayColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

Card6.propTypes = {
  isPlaying: PropTypes.bool,
  image: PropTypes.node.isRequired,
  dateTime: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

Card6.defaultProps = {
  isPlaying: true,
  image: Images.eProduct,
  dateTime: '',
  title: '',
  style: {},
  onPress: () => {},
  onMore: () => {},
};

export default Card6;
