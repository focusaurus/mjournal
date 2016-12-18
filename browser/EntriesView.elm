module EntriesView exposing (new, list)

import Date.Extra
import Events exposing (onBlurEditable, onShiftEnter)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Messages exposing (Msg(..))
import Model exposing (Model, Entry)
import Tags exposing (tags)


list : Model -> Html Msg
list model =
    div [] (List.map entryTag model.entries)


entryTag : Entry -> Html Msg
entryTag entry =
    div [ class "entry" ]
        [ div [ class "meta-row" ]
            [ i
                [ classList
                    [ ( "delete-entry", True )
                    , ( "meta", True )
                    , ( "icon-bin2", not entry.confirmingDelete )
                    , ( "icon-warning", entry.confirmingDelete )
                    ]
                , title "delete entry (click twice)"
                , onClick (DeleteEntry1 entry)
                ]
                []
            , div [ class "created meta" ] [ text (Date.Extra.toFormattedString "MMM dd, yyyy hh:mm a" entry.created) ]
            ]
        , p
            [ class "body"
            , contenteditable True
            , onBlurEditable (SaveEntry entry)
            , onShiftEnter (SaveEntry entry)
            ]
            [ text entry.body ]
        , tags entry
        ]


new : Model -> Html Msg
new model =
    div [ class "new-entry" ]
        [ label
            [ class "new" ]
            [ text "Type a new entry below. SHIFT-ENTER to save." ]
        , p
            [ class "body new"
            , {- ng - keyup "create($event)", -} contenteditable True
            , onShiftEnter CreateEntry
            , onBlurEditable SetNewEntryBody
            ]
            [ text model.newEntryBody ]
          {- , tags
             - input
                 [ {-ng - model "newEntryTags", replace - spaces - with - dashes "false", ng - keyup "create($event)", ng - click "clickTag($event)",-} ]
                 [ div
                     [ class "host", tabindex "-1"]
                     [ div
                         [ class "tags", ng - class "{focused: hasFocus}" ]
                         [ ul
                             [ class "tag-list" ]
                             []
                         , input
                             [ class "input ng-pristine ng-valid", placeholder "Add a tag", tabindex "", ng - model "newTag.text", ng - change "newTagChange()", ng - trim "false", ng - class "{'invalid-tag': newTag.invalid}", ti - autosize "", style "width: 69px;" ]
                             []
                         , span
                             [ class "input", style "visibility: hidden; width: auto; white-space: pre; display: none;" ]
                             [ text "Add a tag" ]
                         ]
                     , auto
                         - complete
                             [ source "autoCompleteTags($query)", min - length "2", class "ng-scope ng-isolate-scope" ]
                             [ div
                                 [ class "autocomplete ng-hide", ng - show "suggestionList.visible" ]
                                 [ ul
                                     [ class "suggestion-list" ]
                                     []
                                 ]
                             ]
                     ]
                 ]
          -}
        , button
            [ {- ng - click "create(true)" -} onClick (CreateEntry model.newEntryBody) ]
            [ text "Save" ]
        ]
