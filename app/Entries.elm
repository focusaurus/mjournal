module Entries exposing (entriesList, getEntries, nextPage, previousPage, editBody, saveBody)

import Date.Extra
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, on)
import Http
import Json.Decode as JD
import Json.Encode as JE
import Json.Decode.Extra
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
    JD.list
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
        options = { method = "PUT"
        , headers = []
        , url = url
        , body = body
        , expect = Http.expectJson (JD.succeed ())
        , timeout = Nothing
        , withCredentials = False
        }

    in
        Http.send SaveBodyDone (Http.request options)


targetText : JD.Decoder String
targetText =
    (JD.at [ "target", "textContent" ] JD.string)


onBlurEditable : (String -> msg) -> Attribute msg
onBlurEditable msg =
    on "blur" (JD.map msg targetText)


entryTag : Entry -> Html Msg
entryTag entry =
    div [ class "entry" ]
        [ div [ class "meta-row" ]
            [ i [ class "delete-entry meta icon-bin2", title "delete entry (click twice)" ] []
            , div [ class "created meta" ] [ text (Date.Extra.toFormattedString "MMM dd, yyyy hh:mm a" entry.created) ]
            ]
        , p [ class "body", contenteditable True, onBlurEditable (SaveEntry entry) ] [ text entry.body ]
        , tags entry
        ]
