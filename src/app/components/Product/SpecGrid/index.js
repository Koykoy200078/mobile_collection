import React from 'react';
import PropTypes from 'prop-types';
import {View, useWindowDimensions} from 'react-native';
import Text from '../../../components/Text';
import {Icon, TextInput} from '../..';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from '../../../config';

const SpecGrid = ({
  style,
  description,
  title,
  renderTitle = null,
  onPress,
  isEnable = true,
  show,
  newTitle,
}) => {
  const {width} = useWindowDimensions();
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

    <View
      style={[style, {flexDirection: 'row', padding: 5, width: width - 40}]}
      className="justify-between">
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
          <>
            <View
              style={{
                flexDirection: 'row',
                width: 130,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <Text style={{flexShrink: 1}}>{title}</Text>
              {show && (
                <View className="flex flex-row w-[310] items-center justify-between">
                  <View>
                    <Text headline style={{flexShrink: 1}}>
                      {newTitle}
                    </Text>
                  </View>

                  <View>
                    <TextInput
                      style={[
                        {
                          height: 40,
                          width: 110,
                          fontStyle: 'italic',
                          flex: 1,
                          backgroundColor: '#F1F1F1',
                        },
                      ]}
                      textAlign={'right'}
                      autoCorrect={false}
                      placeholder={'0.00'}
                      disable={true}
                      selectionColor={colors.primary}
                      // value={parseInt(value) ? value : ''}
                      keyboardType="numeric"
                      // onChangeText={onChangeText}
                    />
                  </View>
                </View>
              )}
            </View>
          </>
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
