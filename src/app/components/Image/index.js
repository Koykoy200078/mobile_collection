import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const Image = (props) => {
  const { style, resizeMode, ...rest } = props;
  const getMode = () => {
    let resize = FastImage.resizeMode.cover;
    switch (resizeMode) {
      case 'contain':
        resize = FastImage.resizeMode.contain;
        break;
      case 'stretch':
        resize = FastImage.resizeMode.stretch;
        break;
      case 'center':
        resize = FastImage.resizeMode.center;
        break;
      default:
        break;
    }
    return resize;
  };
  return <FastImage style={StyleSheet.flatten([style && style])} {...rest} resizeMode={getMode()} />;
};

Image.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Image.defaultProps = {
  style: {},
  resizeMode: 'cover',
};

export default Image;
