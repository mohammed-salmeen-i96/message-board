# Installation

```
yarn
```

```
cd ios
```

if you want to run it on iOS

```
pod install; cd .. ## to go back to root file
```

to start the project

```
yarn start
```

# Files structure

### Pages

- Posts: contains posts list, and apis related to it (get posts, get users, get comments to show count)
- PostDetails: contains the details of a post passed by react navigation, and an API to show comments list

### Components

- AddCommentForm
- AddPostForm
- CommentListItem
- LoadingItem
- PostListItem

### Configs

- Axios: contains an instance of axios
