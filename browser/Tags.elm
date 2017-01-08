module Tags exposing (tags)

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Messages
import Model exposing (Entry)
import Events exposing (onEnter)
import Html.Events exposing (onInput, onClick)


tagItem : Entry -> String -> Html Messages.Msg
tagItem entry tag =
    li
        [ class "tag-item" ]
        --, ng-repeat "tag in tagList.items track by track(tag)", ng-class "{ selected: tag == tagList.selected }" ]
        [ span
            []
            [ text tag ]
        , a
            [ class "remove-button"
            , onClick (Messages.DeleteTag entry tag)
            ]
            [ text "×" ]
        ]


tags : Entry -> Html Messages.Msg
tags entry =
    node "tags-input"
        [ class " meta" ]
        [ div
            [ class "host" ]
            [ div [ class "tags" ]
                [ ul
                    [ class "tag-list" ]
                    (List.map (tagItem entry) entry.tags)
                , input
                    [ class "input ti-autosize"
                    , placeholder "Add a tag"
                    , tabindex 0
                    , style [ ( "width", "69px" ) ]
                    , onEnter (Messages.AddTag entry)
                    , onInput (Messages.InputNewTag entry)
                    , value entry.newTag
                    ]
                    -- ng-class "{'invalid-tag': newTag.invalid}", ti-autosize ""
                    []
                -- , span
                --     [ class "input", style [ ( "visibility", "hidden" ), ( "width", "auto" ), ( "white-space", "pre" ), ( "display", "none" ) ] ]
                --     [ text "Add a tag" ]
                ]
              -- , node "auto-complete"
              --     []
              --     -- source "autoCompleteTags($query)", min-length "2" ]
              --     [ div
              --         [ class "autocomplete" ]
              --         -- ng-hide", ng-show "suggestionList.visible" ]
              --         [ ul
              --             [ class "suggestion-list" ]
              --             []
              --         ]
              --     ]
            ]
        ]
