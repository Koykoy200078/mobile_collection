import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, ImageBackground} from 'react-native';
import {Images} from '../../../config';
import Text from '../../../components/Text';
import styles from './styles';
import Loading from './Loading';

const ProductCategory3 = props => {
  const {title, subtitle, image, style, onPress, loading} = props;

  if (loading) {
    return <Loading style={style} />;
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <ImageBackground
        source={image}
        style={styles.imageBackground}
        imageStyle={{borderRadius: 8}}>
        <View style={[styles.content]}>
          <View style={[styles.viewText]}>
            <Text headline whiteColor numberOfLines={1}>
              {title}
            </Text>
            <Text footnote whiteColor>
              {subtitle}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

ProductCategory3.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.node.isRequired,
};

ProductCategory3.defaultProps = {
  onPress: () => {},
  style: {},
  subtitle: '',
  title: '',
  image: Images.location1,
};

export default ProductCategory3;
