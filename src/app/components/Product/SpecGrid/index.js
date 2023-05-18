import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import Text from '../../../components/Text';
import {Icon} from '../..';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from '../../../config';

const SpecGrid = ({
  style,
  description,
  title,
  renderTitle = null,
  onPress,
  isEnable = true,
}) => {
  const {colors} = useTheme();
  return (
    // <View style={style}>
    //   <Text body1 grayColor>
    //     {description}{' '}
    //     {isEnable && (
    //       <TouchableOpacity className="mx-1" onPress={onPress}>
    //         <Icon name="edit" size={18} color={colors.primary} />
    //       </TouchableOpacity>
    //     )}
    //   </Text>
    //   {renderTitle ? (
    //     renderTitle()
    //   ) : (
    //     <Text caption1 style={{marginTop: 4}} className="text-xl font-bold">
    //       {title}
    //     </Text>
    //   )}
    // </View>

    <View style={[style, {flexDirection: 'row', padding: 5}]}>
      <View style={{width: '50%'}}>
        <Text body1 style={{flexShrink: 1, fontWeight: 'bold'}}>
          {description}{' '}
          {isEnable && (
            <TouchableOpacity className="mx-1" onPress={onPress}>
              <Icon name="edit" size={15} color={colors.primary} />
            </TouchableOpacity>
          )}
        </Text>
      </View>
      <View>
        {renderTitle ? (
          renderTitle()
        ) : (
          <Text style={{flexShrink: 1}}>{title}</Text>
        )}
      </View>
    </View>
  );
};

SpecGrid.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  description: PropTypes.string,
  title: PropTypes.any,
  renderTitle: PropTypes.func,
};

SpecGrid.defaultProps = {
  style: {},
  title: '',
  description: '',
  renderTitle: null,
};

export default SpecGrid;
