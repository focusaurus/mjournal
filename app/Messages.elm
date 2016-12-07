module Messages exposing (Msg(..))

import Http
import Model


type Msg
    = ClickNext
    | ClickPrevious
    | CloseMenu
    | GetEntriesDone (Result Http.Error (List Model.Entry))
    | InputEmail String
    | InputPassword String
    | SaveEntry Model.Entry String
    | SetTheme Model.Theme
    | SetThemeDone (Result Http.Error ())
    | SignIn
    | SignInDone (Result Http.Error Model.User)
    | ToggleMenu String
