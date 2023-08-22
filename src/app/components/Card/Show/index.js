import React from 'react'
import { View, useWindowDimensions, TouchableOpacity } from 'react-native'
import Collapsible from 'react-native-collapsible'
import colors from '../../../config/colors'
import { Icons } from '../../../config/icons'
import { Text } from '../..'

const Show = ({
  isCollapsed,
  totalCashIn,
  totalCashout,
  title,
  enableTooltip,
  toggleAccordion,
  isActive,
  total,
}) => {
  const { width, height } = useWindowDimensions()

  return (
    <>
      <View className='flex-row justify-between space-x-1'>
        <View>
          <Text title3>{title}</Text>
        </View>
        {enableTooltip ? (
          <View className='items-center justify-center'>
            <TouchableOpacity onPress={toggleAccordion}>
              <View className='flex-row items-center justify-between'>
                <View className='flex-row'>
                  <Icons.FontAwesome5
                    name={isActive}
                    size={17}
                    color={colors.text}
                  />
                  <Text
                    caption2
                    style={{ color: colors.text }}
                    numberOfLines={1}
                    className='ml-2 text-xs font-bold'>
                    See More
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Collapsible collapsed={isCollapsed}>
        <View className=' mx-2' style={{ width: width * 0.78, height: 60 }}>
          <View className='flex-row justify-between'>
            <Text className='font-bold text-xs'>• Total Cash In: </Text>
            <Text className='font-bold text-xs'>{totalCashIn}</Text>
          </View>

          <View className='flex-row justify-between'>
            <Text className='font-bold text-xs'>• Total Cash Out: </Text>
            <Text className='font-bold text-xs'>{totalCashout}</Text>
          </View>

          <View className='flex-row justify-between my-2'>
            <Text className='font-extrabold text-sm'>TOTAL AMOUNT: </Text>
            <Text className='font-extrabold text-sm'>{total}</Text>
          </View>
        </View>
      </Collapsible>
    </>
  )
}

export default Show
