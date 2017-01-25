module Model exposing (..)

import Date exposing (Date)
import Set exposing (Set)

type alias Model =
    { entries : List Entry
    , newEntry : Entry
    , menuOpen : Bool
    , pageState : PageState
    , requestCount : Int
    , signInEmail : String
    , signInError : String
    , signInPassword : String
    , tags : Set String
    , theme : Theme
    , errorMessage : Maybe String
    }


type alias PageState =
    { after : Maybe Int
    , before : Maybe Int
    , pageSize : Int
    , pathname : String
    , screen : Screen
    , textSearch : String
    , userId : Maybe Int
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
    , tagSuggestions : List String
    , selectedSuggestionIndex : Int
    }


type alias TagSuggestion =
    { text : String
    , selected : Bool
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
