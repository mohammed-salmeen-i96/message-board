import React from 'react'
import { View, Text } from 'react-native'

const CommentListItem = ({ item }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
      <View
        activeOpacity={0.8}
        style={{
          width: '100%',
          backgroundColor: '#ccc8',
          borderRadius: 10,
        }}
      >
        <Text numberOfLines={1} style={{ padding: 10, maxWidth: 250 }}>
          {item?.name}
        </Text>

        <Text numberOfLines={1} style={{ padding: 10 }}>
          {item?.body}
        </Text>
      </View>
    </View>
  )
}

export default CommentListItem
