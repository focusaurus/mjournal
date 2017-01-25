module Spinner exposing (down, up)

import Model exposing (Model)
import Messages exposing (Msg(..))


-- If the Cmd on the way out has an Http request, increment
-- If the message on the way in is a Done, decrement
--
--
-- update : Messages.Msg -> Model -> Cmd Msg -> Model
-- update message model cmd =
--     let
--         model2 =
--             case message of
--                 AddSuggestedTag entry tag ->
--                     up model
--
--                 ChangeUrl _ ->
--                     up model
--
--                 ClearNewEntryBody ->
--                     model
--
--                 ClearTextSearch ->
--                     model
--
--                 CloseMenu ->
--                     model
--
--                 CreateEntry _ ->
--                     up model
--
--                 CreateEntryDone (Ok _) ->
--                     down message model
--
--                 CreateEntryDone (Err _) ->
--                     down message model
--
--                 DeleteEntry1 entry ->
--                     model
--
--                 DeleteEntryDone (Ok _) ->
--                     down message model
--
--                 DeleteEntryDone (Err _) ->
--                     down message model
--
--                 DeleteTag entry _ ->
--                     up model
--
--                 DeleteTagDone (Ok _) ->
--                     down message model
--
--                 DeleteTagDone (Err _) ->
--                     down message model
--
--                 GetEntriesDone (Ok _) ->
--                     down message model
--
--                 GetEntriesDone (Err _) ->
--                     down message model
--
--                 GetTagsDone (Ok _) ->
--                     down message model
--
--                 GetTagsDone (Err _) ->
--                     down message model
--
--                 InputEmail _ ->
--                     model
--
--                 InputPassword _ ->
--                     model
--
--                 InputNewTag entry _ ->
--                     model
--
--                 NextPage ->
--                     model
--
--                 PreviousPage ->
--                     model
--
--                 NextTagSuggestion entry ->
--                     model
--
--                 PreviousTagSuggestion entry ->
--                     model
--
--                 Register ->
--                     model
--
--                 SaveBody entry _ ->
--                     up model
--
--                 SaveBodyDone (Ok _) ->
--                     down message model
--
--                 SaveBodyDone (Err _) ->
--                     down message model
--
--                 SaveTagsDone (Ok _) ->
--                     down message model
--
--                 SaveTagsDone (Err _) ->
--                     down message model
--
--                 Search ->
--                     let
--                         _ =
--                             Debug.log "Spinner.Search" model.requestCount
--                     in
--                         up model
--
--                 SearchDone (Ok _) ->
--                     let
--                         _ =
--                             Debug.log "Spinner.SearchDone" model.requestCount
--                     in
--                         down message model
--
--                 SearchDone (Err _) ->
--                     down message model
--
--                 SetNewEntryBody _ ->
--                     model
--
--                 SetNewEntryBodyAndSave _ ->
--                     up model
--
--                 SetTextSearch _ ->
--                     model
--
--                 SetTheme _ ->
--                     up model
--
--                 SetThemeDone (Ok _) ->
--                     down message model
--
--                 SetThemeDone (Err _) ->
--                     down message model
--
--                 SignIn ->
--                     up model
--
--                 SignInDone (Ok _) ->
--                     down message model
--
--                 SignInDone (Err _) ->
--                     down message model
--
--                 TagKeyDown entry x ->
--                     model
--
--                 ToggleMenu _ ->
--                     model
--
--         model3 =
--             case cmd of
--                 Platform.Cmd ->
--                     model2
--     in
--         model3


up : Model -> Model
up model =
    { model | requestCount = model.requestCount + 1 }


down : Model -> Model
down model =
    let
        _ =
            if model.requestCount == 0 then
                Debug.log "Down below zero" 43
            else
                0
    in
        { model
            | requestCount =
                if model.requestCount < 1 then
                    0
                else
                    model.requestCount - 1
        }
