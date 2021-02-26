import React, { useLayoutEffect, useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  I18nManager,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Axios from '../configs/Axios'

const PostsDetails = ({ navigation, route }) => {
  const { title, body, id } = route.params.item
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingComment, setAddingComment] = useState(false)
  const [commentText, setCommentText] = useState({})

  const getComments = async () => {
    try {
      const res = await Axios.get(`/comments?postId=${id}`)
      const data = res.data
      setComments(data)
      // console.log(comments)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <TouchableOpacity onPress={deleteAlert} activeOpacity={0.8} style={{ marginRight: 16 }}>
          <Feather name="trash" color="#FFF" size={20} />
        </TouchableOpacity>
      ),
    })
  }, [navigation, route])

  useEffect(() => {
    getComments()
  }, [])

  console.log(id)

  const deleteAlert = () => {
    Alert.alert('', 'Are you sure you to delete this post', [
      { text: 'No', onPress: () => {}, style: 'destructive' },
      {
        text: 'Yes',
        onPress: () => {
          navigation.navigate('Posts', { id })
        },
      },
    ])
  }

  const toggleAddComment = () => {
    setAddingComment((prev) => !prev)
  }

  const saveComment = () => {
    setComments((prevComments) => [commentText, ...prevComments])
    setCommentText({})
    toggleAddComment()
  }

  const cancelAddComment = () => {
    toggleAddComment()
    setCommentText({})
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFF' }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginTop: 40 }}>
        <StatusBar barStyle="light-content" />
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontSize: 20,
                color: '#495057',
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              Comments
            </Text>

            {!addingComment && (
              <TouchableOpacity onPress={toggleAddComment}>
                <Text style={{ fontSize: 30 }}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {addingComment && (
            <View>
              <TextInput
                multiline={false}
                maxLength={300}
                value={commentText?.body || ''}
                placeholder="Type anything"
                style={styles.textInputStyle}
                clearButtonMode="always"
                onChangeText={(text) => {
                  setCommentText({
                    name: 'Me',
                    body: text,
                  })
                }}
              />

              <View style={{ flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity
                  onPress={saveComment}
                  style={{
                    backgroundColor: '#ccc8',
                    borderRadius: 10,
                    marginTop: 10,
                    marginRight: 20,
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: 'grey',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      fontWeight: '400',
                      flex: 1,
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelAddComment}
                  style={{
                    backgroundColor: '#ccc8',
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: 'grey',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      fontWeight: '400',
                      flex: 1,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {comments.length
            ? comments?.map((item, index) => (
                <View key={index} style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                  <TouchableOpacity
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
                  </TouchableOpacity>
                </View>
              ))
            : null}
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
              <ActivityIndicator animating={true} color="#ccc8" size="small" />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textInputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    alignSelf: 'flex-start',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginVertical: 15,
    height: 40,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    width: '90%',
    marginTop: 15,
  },
})

export default PostsDetails
