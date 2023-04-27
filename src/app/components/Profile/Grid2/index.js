import React from 'react';
import PropTypes from 'prop-types';
import ProfileGrid from '../../../components/Profile/Grid';
import Text from '../../../components/Text';
import styles from './styles';

export default function ProfileGridSmall(props) {
  const {name, style, ...attrs} = props;

  return (
    <ProfileGrid
      style={[styles.style, style]}
      imageStyle={styles.thumb}
      componentName={
        <Text numberOfLines={1} footnote>
          {name}
        </Text>
      }
      {...attrs}
    />
  );
}

ProfileGridSmall.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string,
};

ProfileGridSmall.defaultProps = {
  style: {},
  name: '',
};
