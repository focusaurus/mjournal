module Entries exposing (getEntries, nextPage, previousPage, editBody, saveBody, createEntry, delete1, delete2, search)

import Http
import Json.Decode as JD
import Json.Decode.Extra
import Json.Encode as JE
import List.Extra
import Messages exposing (Msg(..))
import Model exposing (Model, Entry)


encode pair =
    Http.encodeUri (Tuple.first pair) ++ "=" ++ Http.encodeUri (Tuple.second pair)


toQuery pairs =
    List.filterMap identity pairs
        |> List.map encode
        |> String.join "&"
        |> (\q ->
                if String.isEmpty q then
                    ""
                else
                    "?" ++ q
           )


getEntries : Maybe String -> Cmd Msg
getEntries query =
    let
        query_ =
            Maybe.withDefault "" query
    in
        Http.send GetEntriesDone (Http.get ("/api/entries" ++ query_) decodeList)


nextPage : Model -> Cmd Msg
nextPage model =
    let
        last =
            List.Extra.last model.entries

        after =
            case last of
                Just last ->
                    Just ( "after", toString last.id )

                Nothing ->
                    Nothing

        textSearch =
            searchQuery model
    in
        getEntries (Just (toQuery [ after, textSearch ]))

previousPage : Model -> Cmd Msg
previousPage model =
    let
        first =
            List.head model.entries

        before =
            case first of
                Just first ->
                    Just ( "before", toString first.id )

                Nothing ->
                    Nothing

        textSearch =
            searchQuery model
    in
        getEntries (Just (toQuery [ before, textSearch ]))


searchQuery : Model -> Maybe (String, String)
searchQuery model =
    if String.isEmpty model.query then
        Nothing
    else
        Just ( "textSearch", model.query )


decodeList : JD.Decoder (List Entry)
decodeList =
    JD.list decode


decode : JD.Decoder Entry
decode =
    (JD.map5 Entry
        (JD.field "id" JD.int)
        (JD.field "body" JD.string)
        (JD.field "tags" (JD.list JD.string))
        (JD.field "created" Json.Decode.Extra.date)
        (JD.succeed False)
    )


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


createEntry : String -> Cmd Msg
createEntry body =
    let
        bodyValue =
            JE.object [ ( "body", JE.string body ) ]

        httpBody =
            Http.jsonBody (bodyValue)
    in
        if body == "" then
            Cmd.none
        else
            Http.send CreateEntryDone (Http.post "/api/entries" httpBody decode)


setConfirmingDelete : Entry -> Entry -> Entry
setConfirmingDelete target entry =
    { entry | confirmingDelete = entry.id == target.id }


delete1 : Model -> Entry -> Model
delete1 model entry =
    let
        newEntries =
            List.map (setConfirmingDelete entry) model.entries
    in
        { model | entries = newEntries }


delete2 : Entry -> Cmd Msg
delete2 entry =
    let
        options =
            { method = "DELETE"
            , headers = []
            , url = "/api/entries/" ++ toString entry.id
            , body = Http.emptyBody
            , expect = Http.expectJson (JD.succeed ())
            , timeout = Nothing
            , withCredentials = False
            }
    in
        Http.send DeleteEntryDone (Http.request options)


search : String -> Cmd Msg
search query =
    Http.send SearchDone <|
        Http.get ("/api/entries?textSearch=" ++ query) decodeList
