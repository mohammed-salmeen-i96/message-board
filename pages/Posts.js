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

  // Paginating by 10 times for each page
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

  // Adding add button to topbar
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

  /**
   ** Faking the delete of a post without an API required a fake solution.
   ** Either by navigating and sending the id (like below) and filtering according to it
   ** or by using a state mangement methodology like Context API, React Query, Mobx or Redux etc..
   */
  useEffect(() => {
    setPostsList((list) => [...list.filter(({ id }) => id !== route.params?.id)])
  }, [route.params])

  /**
   ** Using promise.all to call all the APIs at the same time
   ** withouting awaiting uncessecarliy for each other
   */
  useEffect(() => {
    /**
     ** These functions will only be used once,
     ** so in every re-render they will be re-rendered as well
     ** either we add them here, or add them on top and we use useCallback hook
     ** and add them to the dependency array
     */
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

    // ! This API was only called to see the number of comments per post
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

  /**
   ** Checking if page is less than 10 since jsonplaceholder doesn't return the last page
   ** neither it returns the total of items
   ** then calling the next page of the current page
   */
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
          // ! User and comments list should return with the post item
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
