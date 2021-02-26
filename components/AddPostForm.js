import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'

const AddPostComponent = ({ setPostsList, toggleAddComment }) => {
  const [postText, setPostText] = useState({})
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
    <View>
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
export default AddPostComponent
