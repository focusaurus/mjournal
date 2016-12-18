module Pagination exposing (toolbar)

import Events exposing (onEnter)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Messages exposing (Msg)
import Model exposing (Model)

enablePrevious : Model -> Bool
enablePrevious model =
    case model.direction of
        Nothing ->
            True

        Just (Model.Previous) ->
            List.length model.entries == model.pageSize

        Just (Model.Next) ->
            True


enableNext : Model -> Bool
enableNext model =
    case model.direction of
        Nothing ->
            False

        Just (Model.Previous) ->
            True

        Just (Model.Next) ->
            List.length model.entries == model.pageSize


toolbar : Model -> Html Msg
toolbar model =
    div
        [ class "toolbar" ]
        [ button
            [ class "previous", disabled (not (enablePrevious model)), onClick Messages.ClickPrevious ]
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
                ,value model.query
                , onInput Messages.SetQuery
                , onEnter Messages.Search
                 ]
                -- ng - model "textSearch", ng - keypress "searchKeypress($event)"]
                []
            , button
                [ class "clearTextSearch hidden" ]
                -- ng - class "{hidden: !textSearch}", ng - click "clearTextSearch()"]
                [ text "clear" ]
            ]
        , button
            [ class "next", disabled (not (enableNext model)), onClick Messages.ClickNext ]
            -- ng - click "next()", ng - disabled "disableNext"]
            [ span
                [ class "fullText" ]
                [ text "Next Entries" ]
            , span
                [ class "smallText" ]
                [ text "→" ]
            ]
        ]
