import React, { useEffect, useState, useLayoutEffect } from 'react'
import { FlatList, View, StatusBar, TouchableOpacity } from 'react-native'
import Axios from '../configs/Axios'
import Feather from 'react-native-vector-icons/Feather'
import PostListItem from '../components/PostListItem'
import AddPostForm from '../components/AddPostForm'
import LoadingItem from '../components/LoadingItem'

const Posts = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true)
  const [postsList, setPostsList] = useState([])
  const [usersLists, setUserList] = useState([])
  const [comments, setComments] = useState([])
  const [postsPage, setPostsPage] = useState(0)
  const [addingPost, setAddingComment] = useState(false)

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

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar barStyle="light-content" />
      {addingPost && <AddPostForm setPostsList={setPostsList} toggleAddComment={toggleAddComment} />}
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
          return <PostListItem navigation={navigation} item={item} user={user} comment={comment} />
        }}
        ListFooterComponent={loading && <LoadingItem />}
      />
    </View>
  )
}

export default Posts
