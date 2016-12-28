module Model exposing (..)

import Date exposing (Date)


type alias Model =
    { entries : List Entry
    , newEntryBody : String
    , menuOpen : Bool
    , pageState : PageState
    , signInEmail : String
    , signInError : String
    , signInPassword : String
    , theme : Theme
    }


type alias PageState =
    { after : Maybe Int
    , before : Maybe Int
    , pageSize: Int
    , pathname: String
    , screen : Screen
    , textSearch : String
    }


type alias Flags =
    { id : Maybe Int
    , theme : Maybe String
    }


type alias Entry =
    { id : Int
    , body : String
    , tags : List String
    , created : Date
    , confirmingDelete : Bool
    , newTag : String
    }


type alias User =
    { id : Int
    , theme : Theme
    }


type Theme
    = Moleskine
    | Hoth


type Screen
    = SignInScreen
    | EntriesScreen (Maybe String) (Maybe Int) (Maybe Int)
