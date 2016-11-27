module Messages exposing (Msg(..))

import Http
import Model exposing (Entry)


type Msg
    = InputEmail String
    | InputPassword String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut
    | ClickNext
    | ClickPrevious
    | GetEntriesDone (Result Http.Error (List Entry))
