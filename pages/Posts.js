import React, { useEffect, useState } from 'react'
import { FlatList, View, Text, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native'
import Axios from '../configs/Axios'

const Posts = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [postsList, setPostsList] = useState([])
  const [usersLists, setUserList] = useState([])
  const [postsPage, setPostsPage] = useState(0)

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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await Axios.get('/users')
        const data = res.data
        setUserList(data)
      } catch (err) {
        console.log(err)
      }
    }

    const fetchData = async () => {
      await Promise.all(getPosts(), getUsers())
      setLoading(false)
    }
    fetchData()
  }, [])

  const paginatePosts = async () => {
    if (postsPage >= 10 || loading) return
    setPostsPage((page) => page + 1)
    await getPosts(postsPage + 1)
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
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
          return (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('PostsDetails', { item })}
                activeOpacity={0.8}
                style={{ width: '90%', backgroundColor: '#ccc', borderRadius: 10 }}
              >
                <Text numberOfLines={1} style={{ padding: 10 }}>
                  {user?.name}
                </Text>
                <Text numberOfLines={1} style={{ padding: 10 }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </View>
          )
        }}
        ListFooterComponent={
          loading && (
            <View style={{ flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color="#2650E9" style={{ height: 100 }} />
            </View>
          )
        }
      />
    </View>
  )
}

export default Posts
