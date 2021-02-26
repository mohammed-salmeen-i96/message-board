import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'

const AddCommentForm = ({ commentText, setCommentText, saveComment, cancelAddComment }) => {
  return (
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

export default AddCommentForm
