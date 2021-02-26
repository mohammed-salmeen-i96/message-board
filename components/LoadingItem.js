import React from 'react'
import { View, ActivityIndicator } from 'react-native'

const LoadingItem = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <ActivityIndicator animating={true} color="#3452a3" size="small" />
    </View>
  )
}
export default LoadingItem
