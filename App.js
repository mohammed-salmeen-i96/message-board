import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Posts from './pages/Posts'
import PostsDetails from './pages/PostsDetails'
import Feather from 'react-native-vector-icons/Feather'
import { TouchableOpacity } from 'react-native'

const BackItem = ({ tintColor, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ paddingHorizontal: 8, alignItems: 'center' }}>
    <Feather size={28} name="chevron-left" color={tintColor} />
  </TouchableOpacity>
)

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Posts"
        screenOptions={() => ({
          headerStyle: { backgroundColor: '#3452a3', borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#FFF',
          headerTitleAlign: 'center',
          headerTitleStyle: { alignSelf: 'center', color: '#FFF' },
          headerBackTitle: ' ',
        })}
      >
        <Stack.Screen name="Posts" component={Posts} />
        <Stack.Screen options={{ headerLeft: BackItem }} name="PostsDetails" component={PostsDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
