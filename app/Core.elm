module Core exposing (..)

import Http


type Msg
    = InputEmail String
    | InputPassword String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut


type alias Model =
    { entries : List String
    , signInEmail : String
    , signInPassword : String
    , signInError : String
    , pageState : PageState
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
