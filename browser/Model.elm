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
    { after : Maybe Entry
    , before : Maybe Entry
    , pageSize: Int
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
    | EntriesScreen
