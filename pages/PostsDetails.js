import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, I18nManager } from 'react-native'
import Axios from '../configs/Axios'

const PostsDetails = ({ navigation, route }) => {
  const { title, body, id } = route.params.item
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const getComments = async () => {
    try {
      const res = await Axios.get(`/comments?postId=${id}`)
      const data = res.data
      setComments(data)
      console.log(comments)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    })
  }, [navigation, route])

  useEffect(() => {
    getComments()
  }, [])

  // console.log({ comments })

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={{ marginTop: 40 }}>
        <View style={{ marginHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 16,
              color: '#495057',
              textAlign: 'left',
              fontWeight: '500',
            }}
          >
            {body ? body : ''}
          </Text>
        </View>
        <View style={{ marginHorizontal: 16, marginTop: 40 }}>
          <Text
            style={{
              fontSize: 20,
              color: '#495057',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            {'Comments'}
          </Text>
          {comments.length ? (
            <>
              {comments?.map((item) => (
                <View key={item.id} style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => {}}
                    activeOpacity={0.8}
                    style={{
                      width: '100%',
                      backgroundColor: '#ccc8',
                      borderRadius: 10,
                    }}
                  >
                    <Text numberOfLines={1} style={{ padding: 10 }}>
                      {item?.name}
                    </Text>
                    <Text numberOfLines={1} style={{ padding: 10 }}>
                      {item?.body}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : null}
          {loading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <ActivityIndicator animating={true} color="#2650E9" size="small" />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default PostsDetails
