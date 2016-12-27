module Messages exposing (Msg(..))

import Http
import Model
import Navigation

type Msg
    = ClearTextSearch
    | CloseMenu
    | CreateEntry String
    | CreateEntryDone (Result Http.Error Model.Entry)
    | DeleteEntry1 Model.Entry
    | DeleteEntryDone (Result Http.Error ())
    | GetEntriesDone (Result Http.Error (List Model.Entry))
    | InputEmail String
    | InputPassword String
    | NextPage
    | PreviousPage
    | Register
    | SaveBodyDone (Result Http.Error ())
    | SaveEntry Model.Entry String
    | Search
    | SearchDone (Result Http.Error (List Model.Entry))
    | SetNewEntryBody String
    | SetTextSearch String
    | SetTheme Model.Theme
    | SetThemeDone (Result Http.Error ())
    | SignIn
    | SignInDone (Result Http.Error Model.User)
    | ToggleMenu String
    | ChangeUrl Navigation.Location
