module Entries
    exposing
        ( addSuggestedTag
        , addTag
        , clearTextSearch
        , create
        , delete1
        , delete2
        , deleteTag
        , editNewTag
        , getEntries
        , nextPage
        , new
        , previousPage
        , saveBody
        , search
        , setNewEntryBody
        , setNewEntryBodyAndSave
        , setTextSearch
        , tagKeyDown
        )

import Http
import Json.Decode as JD
import Json.Decode.Extra
import Json.Encode as JE
import List.Extra
import Location exposing (location)
import Messages exposing (Msg(..))
import Model exposing (Model, Entry, TagSuggestion)
import Navigation
import Date
import Events exposing (keyCodes)
import Tags


tagKeyDown : Entry -> Int -> ( Entry, Cmd Msg )
tagKeyDown entry keyCode =
    let
        _ =
            Debug.log "debug" keyCode
    in
        if keyCode == keyCodes.enter then
            if entry.selectedSuggestionIndex >= 0 then
                addSuggestedTag entry (Tags.selectedSuggestion entry)
            else
                addTag entry
        else if keyCode == keyCodes.up then
            ( Tags.previousSuggestion entry, Cmd.none )
        else if keyCode == keyCodes.down then
            ( Tags.nextSuggestion entry, Cmd.none )
        else if keyCode == keyCodes.escape then
            ( Tags.unselect entry, Cmd.none )
        else
            ( entry, Cmd.none )

addSuggestedTag : Entry -> String -> ( Entry, Cmd Msg )
addSuggestedTag entry tag =
    let
        entry2 =
            { entry
                | tags = List.append entry.tags [ tag ]
                , newTag = ""
                , tagSuggestions = []
            }
    in
        ( entry2, saveTags entry2 )


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
    in
        ( newModel
        , Navigation.newUrl (newModel.pageState.pathname ++ location_)
        )


decodeList : JD.Decoder (List Entry)
decodeList =
    JD.list decode


decode : JD.Decoder Entry
decode =
    (JD.map8 Entry
        (JD.field "id" JD.int)
        (JD.field "body" JD.string)
        (JD.field "tags" (JD.list JD.string))
        (JD.field "created" Json.Decode.Extra.date)
        (JD.succeed False)
        (JD.succeed "")
        (JD.succeed [])
        (JD.succeed 0)
    )


newBody : Entry -> String -> Entry -> Entry
newBody editedEntry newBody entry =
    if entry.id == editedEntry.id then
        { entry | body = newBody }
    else
        entry



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


addTag : Entry -> ( Entry, Cmd Msg )
addTag entry =
    if String.isEmpty entry.newTag then
        ( entry, Cmd.none )
    else
        let
            entry2 =
                { entry
                    | newTag = ""
                    , tags = List.append entry.tags [ entry.newTag ]
                    , tagSuggestions = []
                }
        in
            ( entry2, saveTags entry2 )


deleteTag : Entry -> String -> ( Entry, Cmd Msg )
deleteTag entry tag =
    let
        newEntry =
            { entry
                | tags = List.filter (\t -> not (t == tag)) entry.tags
            }
    in
        ( newEntry, saveTags newEntry )

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
    if entry.id < 0 then
        Cmd.none
    else
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
            JE.object
                [ ( "body", JE.string entry.body )
                , ( "tags", JE.list (List.map JE.string entry.tags) )
                ]

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
    Model.Entry -1 "" [] (Date.fromTime 0) False "" [] 0


setNewEntryBody : Model -> String -> ( Model, Cmd Msg )
setNewEntryBody model newBody =
    let
        entry1 =
            model.newEntry

        entry2 =
            { entry1 | body = newBody }

        newModel =
            { model | newEntry = entry2 }
    in
        ( newModel, Cmd.none )


setNewEntryBodyAndSave : Model -> String -> ( Model, Cmd Msg )
setNewEntryBodyAndSave model newBody =
    let
        entry1 =
            model.newEntry

        entry2 =
            { entry1 | body = newBody }

        newModel =
            { model | newEntry = new }
    in
        ( newModel, create entry2 )
