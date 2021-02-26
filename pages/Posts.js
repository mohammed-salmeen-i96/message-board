import React, { useEffect, useState, useLayoutEffect } from 'react'
import { FlatList, View, Text, StatusBar, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import Axios from '../configs/Axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Share from 'react-native-share'
import Feather from 'react-native-vector-icons/Feather'

const Posts = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true)
  const [postsList, setPostsList] = useState([])
  const [usersLists, setUserList] = useState([])
  const [comments, setComments] = useState([])
  const [postsPage, setPostsPage] = useState(0)
  const [addingComment, setAddingComment] = useState(false)
  const [postText, setPostText] = useState({})

  const getPosts = async (page = 0) => {
    setLoading(true)

    try {
      const res = await Axios.get(`/posts?_limit=10&_start=${page * 10}`)
      const data = res.data
      setPostsList([...postsList, ...data])
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const shareOptions = {
    title: 'Message Board',
    message: 'Check this cool app', // TODO change content
    url: 'https://www.dokkanafkar.com/',
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Posts',
      headerRight: () => (
        <TouchableOpacity onPress={toggleAddComment} activeOpacity={0.8} style={{ marginRight: 16 }}>
          <Feather name="plus" color="#FFF" size={25} />
        </TouchableOpacity>
      ),
    })
  }, [navigation, route])

  useEffect(() => {
    setPostsList((list) => [...list.filter(({ id }) => id !== route.params?.id)])
  }, [route.params])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await Axios.get('/users')
        const data = res.data
        setUserList([
          ...data,
          {
            name: 'Me',
            id: 0,
          },
        ])
      } catch (err) {
        console.log(err)
      }
    }

    const getComments = async () => {
      try {
        const res = await Axios.get('/comments')
        const data = res.data
        setComments(data)
        // console.log(comments)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }

    const fetchData = async () => {
      await Promise.all(getPosts(), getUsers(), getComments())
      setLoading(false)
    }
    fetchData()
  }, [])

  const paginatePosts = async () => {
    if (postsPage >= 10 || loading) return
    setPostsPage((page) => page + 1)
    await getPosts(postsPage + 1)
  }
  const toggleAddComment = () => {
    setAddingComment((prev) => !prev)
  }

  const savePost = () => {
    setPostsList((prevPosts) => [postText, ...prevPosts])
    setPostText({})
    toggleAddComment()
  }

  const cancelAddPost = () => {
    toggleAddComment()
    setPostText({})
  }

  const onAddPostInputChange = (text, key) => {
    setPostText((prev) => ({
      ...prev,
      userId: prev.userId || 0,
      id: prev.id || Math.random() * 99999,
      [key]: text,
    }))
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="light-content" />

      {addingComment && (
        <View>
          <TextInput
            multiline={false}
            maxLength={300}
            value={postText?.title || ''}
            placeholder="title"
            style={styles.textInputStyle}
            clearButtonMode="always"
            onChangeText={(text) => onAddPostInputChange(text, 'title')}
          />
          <TextInput
            multiline={false}
            maxLength={300}
            value={postText?.body || ''}
            placeholder="description"
            style={styles.textInputStyle}
            clearButtonMode="always"
            onChangeText={(text) => onAddPostInputChange(text, 'body')}
          />

          <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity
              onPress={savePost}
              style={{
                backgroundColor: '#ccc8',
                borderRadius: 10,
                marginTop: 10,
                marginHorizontal: 20,
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
                }}
              >
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelAddPost}
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
                  fontWeight: '400',
                  paddingVertical: 5,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        scrollEventThrottle={16}
        data={postsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(_, index) => `${index}`}
        onEndReached={paginatePosts}
        onEndReachedThreshold={0.1}
        renderItem={({ item }) => {
          const user = usersLists.find((u) => u.id === item.userId)
          const comment = comments.filter((itm) => itm.postId === item.id)
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
        }}
        ListFooterComponent={
          loading && (
            <View
              style={{
                flex: 1,
                backgroundColor: '#F9FAFB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator color="#2650E9" style={{ height: 100 }} />
            </View>
          )
        }
      />
    </View>
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
    textAlign: 'left',
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    width: '90%',
    marginTop: 15,
  },
})

export default Posts
