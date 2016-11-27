module Pagination exposing (toolbar)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Messages exposing (Msg)
import Model exposing (Model)

enablePrevious : Model -> Bool
enablePrevious model =
    model.entryPage > 1


enableNext : Model -> Bool
enableNext model =
    List.length model.entries == model.pageSize


toolbar : Model -> Html Msg
toolbar model =
    div
        [ class "toolbar" ]
        [ button
            [ class "previous", disabled (not (enablePrevious model)) ]
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
                [ type_ "text", placeholder " search entries..." ]
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
