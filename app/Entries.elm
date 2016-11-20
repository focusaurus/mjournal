module Entries exposing (getEntries, entriesList)

import Core exposing (..)
import Http
import Json.Decode as JD
import Html exposing (..)


getEntries : Cmd Msg
getEntries =
    -- Http.send GetEntriesDone (Http.get "/api/entries" (JD.succeed "{}"))
    Http.send GetEntriesDone (Http.get "/api/entries" entriesDecoder)


entriesDecoder : JD.Decoder (List Entry)
entriesDecoder =
    JD.list
        (JD.map2 Entry
            (JD.field "id" JD.int)
            (JD.field "body" JD.string)
        )


entriesList : Model -> Html Msg
entriesList model =
    div [] (List.map entryTag model.entries)


entryTag : Entry -> Html Msg
entryTag entry =
    p [] [ text entry.body ]
