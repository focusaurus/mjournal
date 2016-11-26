module Messages exposing (Msg(..))

import Model exposing (Entry)
import Http


type Msg
    = InputEmail String
    | InputPassword String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut
    | GetEntriesDone (Result Http.Error (List Entry))
