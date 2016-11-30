module Messages exposing (Msg(..))

import Http
import Model exposing (Entry)


type Msg
    = ClickNext
    | ClickPrevious
    | CloseMenu
    | GetEntriesDone (Result Http.Error (List Entry))
    | InputEmail String
    | InputPassword String
    -- | NoOp String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut
    | ToggleMenu String
