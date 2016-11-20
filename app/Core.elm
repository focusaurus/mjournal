module Core exposing (..)

import Http


type Msg
    = InputEmail String
    | InputPassword String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut
    | GetEntriesDone (Result Http.Error (List Entry))


type alias Model =
    { entries : List Entry
    , signInEmail : String
    , signInPassword : String
    , signInError : String
    , pageState : PageState
    }


type alias Entry =
    { id : Int
    , body : String
    }


type PageState
    = SignInPage
    | EntriesPage


model : Model
model =
    { entries = []
    , signInEmail = ""
    , signInPassword = ""
    , signInError = ""
    , pageState = SignInPage
    }
