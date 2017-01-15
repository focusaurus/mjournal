module Model exposing (..)

import Date exposing (Date)


type alias Model =
    { entries : List Entry
    , newEntry : Entry
    , menuOpen : Bool
    , pageState : PageState
    , requestCount : Int
    , signInEmail : String
    , signInError : String
    , signInPassword : String
    , tags : List String
    , theme : Theme
    }


type alias PageState =
    { after : Maybe Int
    , before : Maybe Int
    , pageSize : Int
    , pathname : String
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


swapEntry : Model -> Entry -> Model
swapEntry model entry =
    if entry.id < 0 then
        { model | newEntry = entry }
    else
        let
            newEntries =
                List.map
                    (\existing ->
                        if existing.id == entry.id then
                            entry
                        else
                            existing
                    )
                    model.entries
        in
            { model | entries = newEntries }
