# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Current"
      id: "current"
      location: "Current#current"
    },
    {
      title: "Trending"
      id: "trending"
      location: "Trending#trending"
    },
    {
      title: "Feed"
      id: "feed"
      location: "Feed#feed"
    },
    {
      title: "Profile"
      id: "profile"
      location: "Profile#profile"
    },
  ]

## Preloads
  preloads: [
    {
      id: "search"
      location: "Search#search",
    },
    {
      id: "comments"
      location: "Comments#comments"
    },
    {
      id: "article"
      location: "Article#article"
    },
    {
      id: "addGist"
      location: "Gist#add"
    }
  ]
    
## Initial View
  initialView:
    id: "initialView"
    location: "Login#login"
