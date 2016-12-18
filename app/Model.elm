module Model exposing (..)

import Date exposing (Date)


type alias Model =
    { entries : List Entry
    , direction : Maybe Direction
    , menuOpen : Bool
    , pageSize : Int
    , pageState : PageState
    , signInEmail : String
    , signInError : String
    , signInPassword : String
    , theme : Theme
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
    }


type alias User =
    { id : Int
    , theme : Theme
    }

--
-- type alias KeyModified =
--     { code : Int
--     , shiftKey : Bool
--     }


type Theme
    = Moleskine
    | Hoth


type PageState
    = SignInPage
    | EntriesPage


type Direction
    = Previous
    | Next
