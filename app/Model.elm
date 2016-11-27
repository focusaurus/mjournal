module Model exposing (..)

import Date exposing (Date)


type alias Model =
    { entries : List Entry
    , direction : Maybe Direction
    , pageSize : Int
    , pageState : PageState
    , signInEmail : String
    , signInError : String
    , signInPassword : String
    }


initModel : Model
initModel =
    { entries = []
    , direction = Nothing
    , pageSize = 50
    , pageState = SignInPage
    , signInEmail = "1@example.com"
    , signInError = ""
    , signInPassword = "password"
    }


type alias Entry =
    { id : Int
    , body : String
    , tags : List String
    , created : Date
    }


type PageState
    = SignInPage
    | EntriesPage


type Direction
    = Previous
    | Next
