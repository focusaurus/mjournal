module Model exposing (..)

type alias Model =
    { entries : List Entry
    , signInEmail : String
    , signInPassword : String
    , signInError : String
    , pageState : PageState
    }

initModel : Model
initModel =
    { entries = []
    , signInEmail = ""
    , signInPassword = ""
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
