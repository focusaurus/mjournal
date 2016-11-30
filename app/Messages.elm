module Messages exposing (Msg(..))

import Http
import Model exposing (Entry, Theme)


type Msg
    = ClickNext
    | ClickPrevious
    | CloseMenu
    | GetEntriesDone (Result Http.Error (List Entry))
    | InputEmail String
    | InputPassword String
    | SetTheme Theme
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut
    | ToggleMenu String
