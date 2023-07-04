import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '../../config';
import Text from '../../components/Text';
import {Icons} from '../../config/icons';

const CheckBox = ({
  onPress = () => {},
  title = '',
  checkedIcon = 'check-square',
  uncheckedIcon = 'square',
  checked = true,
  color = '',
}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center'}}
      onPress={onPress}>
      <Icons.FontAwesome5
        solid={checked}
        name={checked ? checkedIcon : uncheckedIcon}
        color={color || colors.text}
        size={24}
      />
      <Text body1 style={{paddingHorizontal: 8}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
