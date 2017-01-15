module Tags exposing (tags, get, selectedSuggestion)

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Messages
import Model exposing (Entry, TagSuggestion)
import Events exposing (onEnter, onDownArrow, onUpArrow, onKeyDown)
import Html.Events exposing (onInput, onClick)
import Http
import Json.Decode as JD


get : Model.Model -> Cmd Messages.Msg
get model =
    if List.length model.tags > 0 then
        Cmd.none
    else
        Http.send Messages.GetTagsDone <|
            Http.get ("/api/entries/tags") decodeList


decodeList : JD.Decoder (List String)
decodeList =
    JD.list decode


decode : JD.Decoder String
decode =
    JD.field "text" JD.string


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


isSelected : Int -> Int -> String -> ( Bool, String )
isSelected selectedIndex index tag =
    ( selectedIndex == index, tag )


suggestionHtml : Model.Entry -> ( Bool, String ) -> Html Messages.Msg
suggestionHtml entry boolTag =
    let
        selected =
            Tuple.first boolTag

        tag =
            Tuple.second boolTag
    in
        li
            [ class "suggestion-item"
            , classList [ ( "selected", selected ) ]
            , onClick (Messages.AddSuggestedTag entry tag)
            ]
            [ text tag ]



-- suggestionHtml entry tag =
--     li
--         [ class "suggestion-item"
--         , onClick (Messages.AddSuggestedTag entry tag)
--         ]
--         [ text tag.text ]


suggestionsHtml : Model.Entry -> Html Messages.Msg
suggestionsHtml entry =
    let
        boolTag =
            tagIndexedMap entry
    in
        ul
            [ class "suggestion-list" ]
            (List.map (suggestionHtml entry) boolTag)


tagIndexedMap entry =
    List.indexedMap (isSelected entry.selectedSuggestionIndex) entry.tagSuggestions


selectedSuggestion entry =
    let
        selectedTuple =
            List.filter (\t -> Tuple.first t) (tagIndexedMap entry)
    in
        case List.head selectedTuple of
            Nothing ->
                ""

            Just tuple ->
                Tuple.second tuple


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
                    , onKeyDown (Messages.TagKeyDown entry)
                      -- , onEnter (Messages.AddTag entry)
                    , onInput (Messages.InputNewTag entry)
                      -- , onDownArrow (Messages.NextTagSuggestion entry)
                      -- , onUpArrow (Messages.PreviousTagSuggestion entry)
                    , value entry.newTag
                    ]
                    -- ng-class "{'invalid-tag': newTag.invalid}", ti-autosize ""
                    []
                  -- , span
                  --     [ class "input", style [ ( "visibility", "hidden" ), ( "width", "auto" ), ( "white-space", "pre" ), ( "display", "none" ) ] ]
                  --     [ text "Add a tag" ]
                ]
            , if List.length entry.tagSuggestions > 0 then
                node "auto-complete"
                    []
                    -- source "autoCompleteTags($query)", min-length "2" ]
                    [ div
                        [ class "autocomplete" ]
                        -- ng-hide", ng-show "suggestionList.visible" ]
                        [ suggestionsHtml entry
                        ]
                    ]
              else
                text ""
            ]
        ]
