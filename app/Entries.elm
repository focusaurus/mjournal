module Entries exposing (entriesList, getEntries, nextPage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Json.Decode as JD
import List.Extra
import Messages exposing (Msg(..))
import Model exposing (Model, Entry)


-- getEntries : Maybe String -> Cmd Msg
-- getEntries query_ =
--     Http.send GetEntriesDone (Http.get ("/api/entries" ++ query_) entriesDecoder)
-- -- This compiles
-- getEntries : Maybe String -> Cmd Msg
-- getEntries query =
--     case query of
--         Just query ->
--             Http.send GetEntriesDone (Http.get ("/api/entries" ++ query) entriesDecoder)
--         Nothing ->
--             Http.send GetEntriesDone (Http.get ("/api/entries") entriesDecoder)


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


entriesDecoder : JD.Decoder (List Entry)
entriesDecoder =
    JD.list
        (JD.map3 Entry
            (JD.field "id" JD.int)
            (JD.field "body" JD.string)
            (JD.field "created" JD.string)
        )


entriesList : Model -> Html Msg
entriesList model =
    div [] (List.map entryTag model.entries)


entryTag : Entry -> Html Msg
entryTag entry =
    div [ class "entry" ]
        [ div [ class "meta-row" ]
            [ i [ class "delete-entry meta icon-bin2", title "delete entry (click twice)" ] []
            , div [ class "created meta" ] [ text entry.created ]
            ]
        , p [ class "body", contenteditable True ] [ text entry.body ]
        ]
