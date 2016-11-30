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


initModel : Model
initModel =
    { entries = []
    , direction = Nothing
    , menuOpen = False
    , pageSize = 50
    , pageState = SignInPage
    , signInEmail = "1@example.com"
    , signInError = ""
    , signInPassword = "password"
    , theme = (Theme "moleskine")
    }


type alias Entry =
    { id : Int
    , body : String
    , tags : List String
    , created : Date
    }


type alias Theme =
    { name : String
    }


type PageState
    = SignInPage
    | EntriesPage


type Direction
    = Previous
    | Next
