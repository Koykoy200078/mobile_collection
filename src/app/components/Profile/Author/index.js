import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import Image from '../../../components/Image';
import Text from '../../../components/Text';
import styles from './styles';
import Loading from './Loading';

export default function ProfileAuthor(props) {
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    name,
    description,
    textRight,
    styleName,
    styleDescription,
    loading,
  } = props;

  if (loading) {
    return <Loading style={style} styleLeft styleThumb styleRight />;
  }

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
          <Text footnote grayColor numberOfLines={1} style={styleDescription}>
            {description}
          </Text>
        </View>
      </View>
      <View style={[styles.contentRight, styleRight]}>
        <Text caption2 grayColor numberOfLines={1}>
          {textRight}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

ProfileAuthor.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  textRight: PropTypes.string,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

ProfileAuthor.defaultProps = {
  image: '',
  name: '',
  description: '',
  textRight: '',
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  style: {},
  onPress: () => {},
};
