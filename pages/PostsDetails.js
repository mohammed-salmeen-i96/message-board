import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
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
import { Transition, Transitioning } from 'react-native-reanimated'
import Feather from 'react-native-vector-icons/Feather'
import Axios from '../configs/Axios'

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
)

const PostsDetails = ({ navigation, route }) => {
  const { title, body, id } = route.params.item
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [addComment, setAddComment] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(null)
  const [commentText, setCommentText] = useState({})
  const [postComment, setPostComment] = useState('')
  const ref = useRef()
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
    })
  }, [navigation, route])

  useEffect(() => {
    getComments()
  }, [])

  // console.log(commentText)

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
              {comments?.map((item, index) => (
                <Transitioning.View
                  ref={ref}
                  transition={transition}
                  key={item.id}
                  style={{ flex: 1, alignItems: 'center', marginTop: 20 }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      ref.current.animateNextTransition()
                      setCurrentIndex(index === currentIndex ? null : index)
                    }}
                    activeOpacity={0.8}
                    style={{
                      width: '100%',
                      backgroundColor: '#ccc8',
                      borderRadius: 10,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text numberOfLines={1} style={{ padding: 10, maxWidth: 250 }}>
                        {item?.name}
                      </Text>
                      <Feather name="chevron-down" style={{ paddingHorizontal: 16 }} size={18} />
                    </View>
                    <Text numberOfLines={1} style={{ padding: 10 }}>
                      {item?.body}
                    </Text>
                    {index === currentIndex && postComment !== '' && (
                      <View style={{}}>
                        <Text
                          style={{
                            paddingHorizontal: 16,
                            fontSize: 14,
                          }}
                        >
                          {'Reply:'}
                        </Text>
                        <Text
                          style={{
                            paddingHorizontal: 16,
                            marginVertical: 10,
                          }}
                        >
                          {postComment}
                        </Text>
                      </View>
                    )}
                    {index === currentIndex && addComment && (
                      <TextInput
                        multiline={false}
                        maxLength={300}
                        placeholder={I18nManager.isRTL ? 'إجابتك' : 'Type anything'}
                        style={styles.textInputStyle}
                        onChangeText={(text) => {
                          setCommentText({
                            answer: text,
                            id: item.id,
                          })
                        }}
                        clearButtonMode="always"
                        onSubmitEditing={() => {
                          setPostComment(commentText.answer)
                          setCommentText('')
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  {index === currentIndex && (
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <TouchableOpacity
                        onPress={() => setAddComment(true)}
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
                          {'Add Comment'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setAddComment(false)}
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
                          {'Cancel'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Transitioning.View>
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
