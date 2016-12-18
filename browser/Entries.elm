module Entries exposing (entriesList, getEntries, nextPage, previousPage, editBody, saveBody, newEntry, createEntry)

import Date.Extra
import Events exposing (onBlurEditable, onShiftEnter)
import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Json.Decode as JD
import Json.Decode.Extra
import Json.Encode as JE
import List.Extra
import Messages exposing (Msg(..))
import Model exposing (Model, Entry)
import Tags exposing (tags)


getEntries : Maybe String -> Cmd Msg
getEntries query =
    let
        query_ =
            Maybe.withDefault "" query
    in
        Http.send GetEntriesDone (Http.get ("/api/entries" ++ query_) entriesDecoder)


nextPage : Model -> Cmd Msg
nextPage model =
    let
        last =
            List.Extra.last model.entries
    in
        let
            query =
                case last of
                    Just last ->
                        "?after=" ++ toString (.id last)

                    Nothing ->
                        ""
        in
            getEntries (Just query)


previousPage : Model -> Cmd Msg
previousPage model =
    let
        first =
            List.head model.entries
    in
        let
            query =
                case first of
                    Just first ->
                        "?before=" ++ toString (.id first)

                    Nothing ->
                        ""
        in
            getEntries (Just query)


entriesDecoder : JD.Decoder (List Entry)
entriesDecoder =
    JD.list entryDecoder


entryDecoder : JD.Decoder Entry
entryDecoder =
    (JD.map4 Entry
        (JD.field "id" JD.int)
        (JD.field "body" JD.string)
        (JD.field "tags" (JD.list JD.string))
        (JD.field "created" Json.Decode.Extra.date)
    )


entriesList : Model -> Html Msg
entriesList model =
    div [] (List.map entryTag model.entries)


newBody : Entry -> String -> Entry -> Entry
newBody editedEntry newBody entry =
    if entry.id == editedEntry.id then
        { entry | body = newBody }
    else
        entry


editBody : Model -> Entry -> String -> Model
editBody model entry body =
    let
        newEntries =
            List.map (newBody entry body) model.entries
    in
        { model | entries = newEntries }


saveBody : Entry -> String -> Cmd Msg
saveBody entry newBody =
    let
        bodyValue =
            JE.object
                [ ( "id", JE.int (.id entry) )
                , ( "body", JE.string newBody )
                ]

        body =
            Http.jsonBody (bodyValue)

        url =
            "/api/entries/" ++ toString (.id entry)

        options =
            { method = "PUT"
            , headers = []
            , url = url
            , body = body
            , expect = Http.expectJson (JD.succeed ())
            , timeout = Nothing
            , withCredentials = False
            }
    in
        Http.send SaveBodyDone (Http.request options)


entryTag : Entry -> Html Msg
entryTag entry =
    div [ class "entry" ]
        [ div [ class "meta-row" ]
            [ i [ class "delete-entry meta icon-bin2", title "delete entry (click twice)" ] []
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


newEntry : Model -> Html Msg
newEntry model =
    div [ class "new-entry" ]
        [ label
            [ class "new" ]
            [ text "Type a new entry below. SHIFT-ENTER to save." ]
        , p
            [ class "body new", {- ng - keyup "create($event)", -} contenteditable True, onShiftEnter CreateEntry ]
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
            [{- ng - click "create(true)" -}]
            [ text "Save" ]
        ]


createEntry : String -> Cmd Msg
createEntry body_ =
    let
        bodyValue =
            JE.object [ ( "body", JE.string body_ ) ]

        body =
            Http.jsonBody (bodyValue)
    in
        if body_ == "" then
            Cmd.none
        else
            Http.send CreateEntryDone (Http.post "/api/entries" body entryDecoder)
