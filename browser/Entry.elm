module Entry
    exposing
        ( addSuggestedTag
        , addTag
        , clearTextSearch
        , create
        , delete1
        , delete2
        , deleteTag
        , getEntries
        , new
        , nextPage
        , previousPage
        , saveBody
        , search
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
import Tag


tagKeyDown : Entry -> Int -> ( Entry, Cmd Msg )
tagKeyDown entry keyCode =
    if keyCode == keyCodes.enter then
        if entry.selectedSuggestionIndex >= 0 then
            addSuggestedTag entry (Tag.selectedSuggestion entry)
        else
            addTag entry
    else
        ( Tag.keyDown entry keyCode, Cmd.none )


addSuggestedTag : Entry -> String -> ( Entry, Cmd Msg )
addSuggestedTag entry tag =
    let
        entry2 =
            Tag.addSuggestedTag entry tag
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
            Maybe.map .id (List.Extra.last model.entries)

        new =
            { old | before = Nothing, after = after }

        model2 =
            { model | pageState = new }

        location_ =
            location model2
    in
        ( model2
        , Navigation.newUrl (model2.pageState.pathname ++ location_)
        )


previousPage : Model -> ( Model, Cmd Msg )
previousPage model =
    let
        old =
            model.pageState

        before =
            Maybe.map .id (List.head model.entries)

        new =
            { old | before = before, after = Nothing }

        model2 =
            { model | pageState = new }

        location_ =
            location model2
    in
        ( model2
        , Navigation.newUrl (model2.pageState.pathname ++ location_)
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


addTag : Entry -> ( Entry, Cmd Msg )
addTag entry =
    if String.isEmpty entry.newTag then
        ( entry, Cmd.none )
    else
        let
            entry2 =
                Tag.addTag entry
        in
            ( entry2, saveTags entry2 )


deleteTag : Entry -> String -> ( Entry, Cmd Msg )
deleteTag entry tag =
    let
        entry2 =
            Tag.deleteTag entry tag
    in
        ( entry2, saveTags entry2 )


saveBody : Entry -> String -> Cmd Msg
saveBody entry newBody =
    let
        entry2 =
            { entry | body = newBody }

        bodyValue =
            JE.object
                [ ( "id", JE.int entry2.id )
                , ( "body", JE.string entry2.body )
                ]

        body =
            Http.jsonBody (bodyValue)

        url =
            "/api/entries/" ++ toString entry2.id

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


delete1 : Entry -> Entry
delete1 entry =
    { entry | confirmingDelete = True }


delete2 : Entry -> Cmd Msg
delete2 entry =
    let
        options =
            { method = "DELETE"
            , headers = []
            , url = "/api/entries/" ++ toString entry.id
            , body = Http.emptyBody
            , expect = Http.expectString
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

        model2 =
            { model | pageState = newPageState }
    in
        ( model2
        , Cmd.batch
            [ Navigation.newUrl (model2.pageState.pathname ++ location model2)
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

        model2 =
            { model | pageState = newPageState }
    in
        ( model2, Cmd.none )


new : Model.Entry
new =
    { id = -1
    , body = ""
    , tags = []
    , created = (Date.fromTime 0)
    , confirmingDelete = False
    , newTag = ""
    , tagSuggestions = []
    , selectedSuggestionIndex = 0
    }


setNewEntryBodyAndSave : Entry -> String -> ( Entry, Cmd Msg )
setNewEntryBodyAndSave entry newBody =
    let
        entry2 =
            { entry | body = newBody }
    in
        ( entry2, create entry2 )
