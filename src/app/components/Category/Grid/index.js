import React from 'react';
import PropTypes from 'prop-types';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {Images, useTheme} from '../../../config';
import Text from '../../../components/Text';
import styles from './styles';
import Loading from './Loading';

const CategoryGrid = props => {
  const {title, style, image, onPress, loading} = props;
  const {colors} = useTheme();

  if (loading) {
    return <Loading style={style} />;
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={[styles.content, {backgroundColor: colors.background}]}>
        <ImageBackground
          source={image}
          style={styles.imageBackground}
          borderRadius={8}
        />
        <Text body2 semibold style={styles.title}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

CategoryGrid.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

CategoryGrid.defaultProps = {
  style: {},
  image: Images.news,
  title: '',
  onPress: () => {},
};

export default CategoryGrid;
