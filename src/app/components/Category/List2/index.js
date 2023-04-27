import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Images, useTheme} from '../../../config';
import Image from '../../../components/Image';
import Text from '../../../components/Text';
import styles from './styles';

const CategoryList2 = props => {
  const {colors} = useTheme();
  const {style, onPress, image, title} = props;

  return (
    <TouchableOpacity
      style={[styles.contain, {backgroundColor: colors.card}, style]}
      onPress={onPress}>
      <Image
        source={image}
        style={StyleSheet.flatten([styles.imageWishlist])}
      />
      <View style={styles.viewTitle}>
        <Text caption1 numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

CategoryList2.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
};

CategoryList2.defaultProps = {
  style: {},
  onPress: () => {},
  image: Images.channel1,
  title: '',
};

export default CategoryList2;
