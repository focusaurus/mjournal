module Tags exposing (tags)

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Messages exposing (Msg)
import Model exposing (Entry)


tagItem : String -> Html Msg
tagItem tag =
    li
        [ class "tag-item" ]
        --, ng-repeat "tag in tagList.items track by track(tag)", ng-class "{ selected: tag == tagList.selected }" ]
        [ span
            []
            [ text tag ]
        , a
            [ class "remove-button" ]
            --, ng-click "tagList.remove($index)" ]
            [ text "×" ]
        ]


tags : Entry -> Html Msg
tags entry =
    node "tags-input"
        [ class " meta" ]
        [ div
            [ class "host" ]
            [ div [ class "tags" ]
                [ ul
                    [ class "tag-list" ]
                    (List.map tagItem entry.tags)
                ]
            ]
        ]
