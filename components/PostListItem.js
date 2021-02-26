import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Share from 'react-native-share'

const PostComponent = ({ navigation, item, user, comment }) => {
  const shareOptions = {
    title: 'Check this awesome item',
    message: `(${item.title})`,
    url: 'https://www.dokkanafkar.com/',
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PostsDetails', { item })}
        activeOpacity={0.8}
        style={{
          width: '90%',
          backgroundColor: '#ccc9',
          borderRadius: 10,
        }}
      >
        <Text numberOfLines={1} style={{ padding: 10 }}>
          {user?.name}
        </Text>
        <Text numberOfLines={1} style={{ padding: 10 }}>
          {item.title}
        </Text>
        <View
          style={{
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FontAwesome name="comments-o" size={18} />
          <Text
            style={{
              paddingLeft: 10,
              paddingRight: 20,
            }}
          >
            {comment.length}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Share.open(shareOptions)
            }}
            style={{
              paddingLeft: 40,
            }}
          >
            <AntDesign name="sharealt" size={18} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  )
}
export default PostComponent
