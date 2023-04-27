import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '../../../config';
import Image from '../../../components/Image';
import Text from '../../../components/Text';
import styles from './styles';

export default function ProfileGridSmall(props) {
  const {style, image, onPress, name, componentName, imageStyle} = props;
  const {colors} = useTheme();

  return (
    <TouchableOpacity style={[styles.contain, style]} onPress={onPress}>
      <Image
        source={image}
        style={[styles.thumb, {borderColor: colors.border}, imageStyle]}
      />
      {componentName ? componentName : <Text body1>{name}</Text>}
    </TouchableOpacity>
  );
}

ProfileGridSmall.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  onPress: PropTypes.func,
};

ProfileGridSmall.defaultProps = {
  image: '',
  name: '',
  style: {},
  onPress: () => {},
};
