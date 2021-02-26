import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import AddCommentForm from '../components/AddCommentForm'
import CommentListItem from '../components/CommentListItem'
import LoadingItem from '../components/LoadingItem'
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
            {body}
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
            <AddCommentForm
              commentText={commentText}
              setCommentText={setCommentText}
              saveComment={saveComment}
              cancelAddComment={cancelAddComment}
            />
          )}

          {comments.length ? comments?.map((item, index) => <CommentListItem key={index} item={item} />) : null}
          {loading && <LoadingItem />}
        </View>
      </View>
    </ScrollView>
  )
}

export default PostsDetails
