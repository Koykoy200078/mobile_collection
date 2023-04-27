import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, ImageBackground} from 'react-native';
import {Images} from '../../../config';
import Text from '../../../components/Text';
import styles from './styles';
import Loading from './Loading';

const ProductCategory1 = props => {
  const {style, image, title, subtitle, onPress, loading} = props;

  if (loading) {
    return <Loading style={style} />;
  }

  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.5}>
      <ImageBackground
        source={image}
        style={styles.imageBackground}
        imageStyle={{borderRadius: 8}}>
        <View style={styles.content}>
          <Text title3 whiteColor>
            {title}
          </Text>
          <Text subhead whiteColor>
            {subtitle}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

ProductCategory1.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
};

ProductCategory1.defaultProps = {
  style: {},
  image: Images.location1,
  title: '',
  subtitle: '',
  onPress: () => {},
};

export default ProductCategory1;
