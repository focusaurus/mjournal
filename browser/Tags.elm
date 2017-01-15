module Tags
    exposing
        ( tags
        , get
        , addTag
        , selectedSuggestion
        , editNewTag
        , addSuggestedTag
        , nextSuggestion
        , previousSuggestion
        , keyDown
        , deleteTag
        , unselect
        )

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Messages
import Model exposing (Entry, TagSuggestion)
import Events exposing (onEnter, onDownArrow, onUpArrow, onKeyDown, keyCodes)
import Html.Events exposing (onInput, onClick)
import Http
import Json.Decode as JD

addTag : Entry -> Entry
addTag entry =
    { entry
        | newTag = ""
        , tags = List.append entry.tags [ entry.newTag ]
        , tagSuggestions = []
    }

deleteTag : Entry -> String -> Entry
deleteTag entry tag =
    { entry
        | tags = List.filter (\t -> not (t == tag)) entry.tags
    }

keyDown : Entry -> Int -> ( Entry, Cmd Messages.Msg )
keyDown entry keyCode =
    if keyCode == keyCodes.up then
        ( previousSuggestion entry, Cmd.none )
    else if keyCode == keyCodes.down then
        ( nextSuggestion entry, Cmd.none )
    else if keyCode == keyCodes.escape then
        ( unselect entry, Cmd.none )
    else
        ( entry, Cmd.none )


addSuggestedTag : Entry -> String -> Entry
addSuggestedTag entry tag =
    { entry
        | tags = List.append entry.tags [ tag ]
        , newTag = ""
        , tagSuggestions = []
    }


matchTag : String -> String -> Bool
matchTag partialTag fullTag =
    if String.length partialTag < 1 then
        False
    else
        String.startsWith (String.toLower partialTag) (String.toLower fullTag)


editNewTag : Entry -> List String -> String -> Entry
editNewTag entry tags tag =
    { entry
        | newTag = tag
        , tagSuggestions = List.filter (matchTag tag) tags
        , selectedSuggestionIndex = -1
    }


unselect : Model.Entry -> Model.Entry
unselect entry =
    { entry | selectedSuggestionIndex = -1 }


nextSuggestion : Model.Entry -> Model.Entry
nextSuggestion entry =
    let
        max =
            List.length entry.tagSuggestions - 1

        index =
            if entry.selectedSuggestionIndex >= max then
                max
            else
                entry.selectedSuggestionIndex + 1
    in
        { entry | selectedSuggestionIndex = index }


previousSuggestion : Model.Entry -> Model.Entry
previousSuggestion entry =
    let
        index =
            if entry.selectedSuggestionIndex < 1 then
                0
            else
                entry.selectedSuggestionIndex - 1
    in
        { entry | selectedSuggestionIndex = index }


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
