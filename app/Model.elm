module Model exposing (..)

type alias Model =
    { entries : List Entry
    , signInEmail : String
    , signInPassword : String
    , signInError : String
    , pageState : PageState
    , pageSize: Int
    , entryPage : Int
    }

initModel : Model
initModel =
    { entries = []
    , entryPage = 1
    , pageSize = 50
    , signInEmail = "1@example.com"
    , signInPassword = "password"
    , signInError = ""
    , pageState = SignInPage
    }


type alias Entry =
    { id : Int
    , body : String
    , created: String
    }


type PageState
    = SignInPage
    | EntriesPage
