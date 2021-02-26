import React, { useEffect, useState } from 'react'
import { FlatList, View, Text, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native'
import Axios from '../configs/Axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Share from 'react-native-share'

const Posts = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [postsList, setPostsList] = useState([])
  const [usersLists, setUserList] = useState([])
  const [comments, setComments] = useState([])
  const [postsPage, setPostsPage] = useState(0)
  const [activeId, setActiveId] = useState()

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

    const getComments = async () => {
      try {
        const res = await Axios.get(`/comments`)
        const data = res.data
        setComments(data)
        // console.log(comments)
        setLoading(false)
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
          const comment = comments.filter((itm) => itm.postId === item.id)
          let active = item.id === activeId ? 'heart' : 'hearto'
          // console.log(`${user.name}`, 'is ', active)
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
                    activeOpacity={0.5}
                    style={{
                      paddingLeft: 20,
                    }}
                    onPress={() => setActiveId(item.id)}
                  >
                    <AntDesign name={active} size={18} />
                  </TouchableOpacity>
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

export default Posts
