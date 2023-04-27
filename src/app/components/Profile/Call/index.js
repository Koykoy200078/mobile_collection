import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import {parseHexTransparency} from '../../../utils';
import {useTheme} from '../../../config';
import Icon from '../../../components/Icon';
import Image from '../../../components/Image';
import Text from '../../../components/Text';
import styles from './styles';

export default function ProfileCall(props) {
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    name,
    description,
    iconName,
    styleName,
    styleDescription,
    onPressRight,
  } = props;
  const {colors} = useTheme();
  // console.log(parseHexTransparency(colors.primary, 30));

  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.contentLeft, styleLeft]}>
        <Image source={image} style={[styles.thumb, styleThumb]} />
        <View>
          <Text headline semibold numberOfLines={1} style={styleName}>
            {name}
          </Text>
          <Text
            footnote
            grayColor
            numberOfLines={1}
            style={[{marginTop: 4}, styleDescription]}>
            {description}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPressRight}
        style={[styles.contentRight, styleRight]}>
        <View
          style={[
            styles.viewIcon,
            {
              backgroundColor: parseHexTransparency(colors.primary, 30),
            },
          ]}>
          <Icon name={iconName} size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

ProfileCall.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  iconName: PropTypes.string,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  onPressRight: PropTypes.func,
};

ProfileCall.defaultProps = {
  image: '',
  name: '',
  description: '',
  iconName: 'mobile-alt',
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  style: {},
  onPress: () => {},
  onPressRight: () => {},
};
