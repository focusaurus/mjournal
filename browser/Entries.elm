module Entries
    exposing
        ( addTag
        , clearTextSearch
        , create
        , delete1
        , delete2
        , deleteTag
        , editBody
        , editNewTag
        , getEntries
        , nextPage
        , new
        , previousPage
        , saveBody
        , search
        , setTextSearch
        )

import Http
import Json.Decode as JD
import Json.Decode.Extra
import Json.Encode as JE
import List.Extra
import Location exposing (location)
import Messages exposing (Msg(..))
import Model exposing (Model, Entry)
import Navigation
import Date


getEntries : Maybe String -> Cmd Msg
getEntries query =
    let
        query_ =
            Maybe.withDefault "" query
    in
        Http.send GetEntriesDone (Http.get ("/api/entries" ++ query_) decodeList)


nextPage : Model -> ( Model, Cmd Msg )
nextPage model =
    let
        old =
            model.pageState

        after =
            case List.Extra.last model.entries of
                Nothing ->
                    Nothing

                Just last ->
                    Just last.id

        new =
            { old | before = Nothing, after = after }

        newModel =
            { model | pageState = new }

        location_ =
            location newModel
    in
        ( newModel
        , Navigation.newUrl (newModel.pageState.pathname ++ location_)
        )


previousPage : Model -> ( Model, Cmd Msg )
previousPage model =
    let
        old =
            model.pageState

        before =
            case List.head model.entries of
                Nothing ->
                    Nothing

                Just head ->
                    Just head.id

        new =
            { old | before = before, after = Nothing }

        newModel =
            { model | pageState = new }

        location_ =
            location newModel

        _ =
            Debug.log "previous location" before
    in
        ( newModel
        , Navigation.newUrl (newModel.pageState.pathname ++ location_)
        )


decodeList : JD.Decoder (List Entry)
decodeList =
    JD.list decode


decode : JD.Decoder Entry
decode =
    (JD.map6 Entry
        (JD.field "id" JD.int)
        (JD.field "body" JD.string)
        (JD.field "tags" (JD.list JD.string))
        (JD.field "created" Json.Decode.Extra.date)
        (JD.succeed False)
        (JD.succeed "")
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
        newEntry =
            { entry | body = body }
    in
        swapById model newEntry


editNewTag : Model -> Entry -> String -> Model
editNewTag model entry tag =
    let
        newEntry =
            { entry | newTag = tag }
    in
        swapById model newEntry


addTag : Model -> Entry -> ( Model, Cmd Msg )
addTag model entry =
    if String.isEmpty entry.newTag then
        ( model, Cmd.none )
    else
        let
            newEntry =
                { entry
                    | newTag = ""
                    , tags = List.append entry.tags [ entry.newTag ]
                }
        in
            ( swapById model newEntry, saveTags newEntry )


deleteTag : Model -> Entry -> String -> ( Model, Cmd Msg )
deleteTag model entry tag =
    let
        newEntry =
            { entry
                | tags = List.filter (\t -> not (t == tag)) entry.tags
            }
    in
        ( swapById model newEntry, saveTags newEntry )


swapById : Model -> Entry -> Model
swapById model entry =
    let
        newEntries =
            List.map
                (\existing ->
                    if existing.id == entry.id then
                        entry
                    else
                        existing
                )
                model.entries
    in
        { model | entries = newEntries }


saveBody : Entry -> String -> Cmd Msg
saveBody entry newBody =
    let
        newEntry =
            { entry | body = newBody }

        bodyValue =
            JE.object
                [ ( "id", JE.int newEntry.id )
                , ( "body", JE.string newEntry.body )
                ]

        body =
            Http.jsonBody (bodyValue)

        url =
            "/api/entries/" ++ toString newEntry.id

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


saveTags : Entry -> Cmd Msg
saveTags entry =
    let
        bodyValue =
            JE.object
                [ ( "id", JE.int entry.id )
                , ( "tags", JE.list (List.map JE.string entry.tags) )
                ]

        body =
            Http.jsonBody (bodyValue)

        url =
            "/api/entries/" ++ toString entry.id

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
        Http.send SaveTagsDone (Http.request options)


create : Entry -> Cmd Msg
create entry =
    let
        bodyValue =
            JE.object [ ( "body", JE.string entry.body ) ]

        -- todo tags
        httpBody =
            Http.jsonBody (bodyValue)
    in
        if entry.body == "" then
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


search_ : String -> Cmd Msg
search_ query =
    Http.send SearchDone <|
        Http.get ("/api/entries" ++ query) decodeList


search : Maybe String -> Maybe Int -> Maybe Int -> Cmd Msg
search textSearch after before =
    search_ (Location.apiQuery textSearch after before)


clearTextSearch : Model -> ( Model, Cmd Msg )
clearTextSearch model =
    let
        pageState =
            model.pageState

        newPageState =
            { pageState | textSearch = "", after = Nothing, before = Nothing }

        newModel =
            { model | pageState = newPageState }
    in
        ( newModel
        , Cmd.batch
            [ Navigation.newUrl (newModel.pageState.pathname ++ location newModel)
            , getEntries Nothing
            ]
        )


setTextSearch : Model -> String -> ( Model, Cmd Msg )
setTextSearch model textSearch =
    let
        pageState =
            model.pageState

        newPageState =
            { pageState | textSearch = textSearch }

        newModel =
            { model | pageState = newPageState }
    in
        ( newModel, Cmd.none )


new : Model.Entry
new =
    Model.Entry -1 "" [] (Date.fromTime 0) False ""