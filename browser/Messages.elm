module Messages exposing (Msg(..))

import Http
import Model
import Navigation

type Msg
    = AddSuggestedTag Model.Entry String
    | ChangeUrl Navigation.Location
    | ClearNewEntryBody
    | ClearTextSearch
    | CloseMenu
    | CreateEntry (Maybe String)
    | CreateEntryDone (Result Http.Error Model.Entry)
    | DeleteEntry1 Model.Entry
    | DeleteEntryDone (Result Http.Error String)
    | DeleteTag Model.Entry String
    | DeleteTagDone (Result Http.Error ())
    | GetEntriesDone (Result Http.Error (List Model.Entry))
    | GetTagsDone (Result Http.Error (List String))
    | InputEmail String
    | InputNewTag Model.Entry String
    | InputPassword String
    | NextPage
    | NextTagSuggestion Model.Entry
    | PreviousPage
    | PreviousTagSuggestion Model.Entry
    | Register
    | SaveBody Model.Entry String
    | SaveBodyDone (Result Http.Error ())
    | SaveTagsDone (Result Http.Error ())
    | Search
    | SearchDone (Result Http.Error (List Model.Entry))
    | SetNewEntryBody String
    | SetNewEntryBodyAndSave String
    | SetTextSearch String
    | SetTheme Model.Theme
    | SetThemeDone (Result Http.Error ())
    | SignIn
    | SignInDone (Result Http.Error Model.User)
    | TagKeyDown Model.Entry Int
    | TimeoutDeleteEntry Model.Entry
    | ToggleMenu String
