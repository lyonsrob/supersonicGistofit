# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Discover"
      id: "feed"
      location: "Feed#feed"
    },
    {
      title: "Gists"
      id: "current"
      location: "Current#current"
    },
    #{
    #  title: "Trending"
    #  id: "trending"
    #  location: "Trending#trending"
    #},
    {
      title: "Me"
      id: "profile"
      location: "Profile#profile"
    },
  ]

## Preloads
  preloads: [
    {
      id: "addGist"
      location: "Gist#add"
    },
    {
      id: "search"
      location: "Search#search",
    },
    {
      id: "comments"
      location: "Comments#comments"
    },
    {
      id: "likes"
      location: "Likes#likes"
    },
    {
      id: "viewGist"
      location: "Gist#view"
    }
  ]
    


# Initial View
  initialView:
    id: "initialView"
    location: "Login#login"
