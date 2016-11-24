module Entries exposing (getEntries, entriesList)

import Core exposing (..)
import Http
import Json.Decode as JD
import Html exposing (..)
import Html.Attributes exposing (..)

getEntries : Cmd Msg
getEntries =
    -- Http.send GetEntriesDone (Http.get "/api/entries" (JD.succeed "{}"))
    Http.send GetEntriesDone (Http.get "/api/entries" entriesDecoder)


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
    div [ class "entry" ] [
        div [ class "meta-row"] [
            i [ class "delete-entry meta icon-bin2", title "delete entry (click twice)"] []
            , div [ class "created meta" ] [ text entry.created ]
        ]
        , p [] [ text entry.body ]
    ]
