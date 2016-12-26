module Pagination exposing (toolbar, location, init, clearTextSearch, setTextSearch)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Http
import List
import Events exposing (onEnter)
import Messages exposing (Msg)
import Model exposing (Model)


init : Model.Flags -> Model.PageState
init flags =
    { after = Nothing
    , before = Nothing
    , pageSize = 50
    , textSearch = ""
    , screen =
        case flags.id of
            Just id ->
                Model.EntriesScreen

            Nothing ->
                Model.SignInScreen
    }


clearTextSearch model =
    let
        pageState =
            model.pageState

        newPageState =
            { pageState | textSearch = "" }

        newModel =
            { model | pageState = newPageState }
    in
        ( newModel, Cmd.none )



-- TODO change location


setTextSearch model textSearch =
    let
        pageState =
            model.pageState

        newPageState =
            { pageState | textSearch = textSearch }

        newModel =
            { model | pageState = newPageState }
    in
        ( newModel, Cmd.none )



-- TODO change location


encode : ( String, String ) -> String
encode pair =
    Http.encodeUri (Tuple.first pair) ++ "=" ++ Http.encodeUri (Tuple.second pair)


toQuery : List (Maybe ( String, String )) -> String
toQuery pairs =
    List.filterMap identity pairs
        |> List.map encode
        |> String.join "&"
        |> (\q ->
                if String.isEmpty q then
                    ""
                else
                    "?" ++ q
           )


location : Model -> String
location model =
    let
        after =
            case model.pageState.after of
                Just after ->
                    Just ( "after", toString after.id )

                Nothing ->
                    Nothing

        before =
            case model.pageState.before of
                Just before ->
                    Just ( "before", toString before.id )

                Nothing ->
                    Nothing

        textSearch =
            if String.isEmpty model.pageState.textSearch then
                Nothing
            else
                Just ( "textSearch", model.pageState.textSearch )
    in
        toQuery [ after, before, textSearch ]


enablePrevious : Model -> Bool
enablePrevious model =
    case model.pageState.before of
        Nothing ->
            case model.pageState.after of
                Nothing ->
                    True

                Just _ ->
                    True

        Just _ ->
            List.length model.entries == model.pageState.pageSize


enableNext : Model -> Bool
enableNext model =
    case model.pageState.before of
        Nothing ->
            case model.pageState.after of
                Nothing ->
                    False

                Just _ ->
                    List.length model.entries == model.pageState.pageSize

        Just _ ->
            True



--
--
-- enablePrevious : Model -> Bool
-- enablePrevious model =
--     case model.direction of
--         Nothing ->
--             True
--
--         Just (Model.Previous) ->
--             List.length model.entries == model.pageSize
--
--         Just (Model.Next) ->
--             True
--
--
-- enableNext : Model -> Bool
-- enableNext model =
--     case model.direction of
--         Nothing ->
--             False
--
--         Just (Model.Previous) ->
--             True
--
--         Just (Model.Next) ->
--             List.length model.entries == model.pageSize


toolbar : Model -> Html Msg
toolbar model =
    div
        [ class "toolbar" ]
        [ button
            [ class "previous", disabled (not (enablePrevious model)), onClick Messages.PreviousPage ]
            --ng - click "previous()", ng - disabled "disablePrevious", data - vivaldi - spatnav - clickable "1"
            [ span
                [ class "smallText" ]
                [ text "←" ]
            , span
                [ class "fullText" ]
                [ text "Previous Entries" ]
            ]
        , span
            [ class "search" ]
            [ input
                [ type_ "text"
                , placeholder " search entries..."
                , value model.pageState.textSearch
                , onInput Messages.SetTextSearch
                , onEnter Messages.Search
                ]
                -- ng - model "textSearch", ng - keypress "searchKeypress($event)"]
                []
            , button
                [ onClick Messages.ClearSearch
                , class "clearTextSearch"
                , classList
                    [ ( "hidden"
                      , String.length model.pageState.textSearch == 0
                      )
                    ]
                ]
                [ text "clear" ]
            ]
        , button
            [ class "next", disabled (not (enableNext model)), onClick Messages.NextPage ]
            [ span
                [ class "fullText" ]
                [ text "Next Entries" ]
            , span
                [ class "smallText" ]
                [ text "→" ]
            ]
        ]
