module MJournal exposing (main)

import About exposing (about)
import Entries
import EntriesView
import Tags
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Location
import Menu
import Messages exposing (Msg(..))
import Model exposing (Model, Theme, Flags, Screen(..))
import Navigation
import Pagination
import Ports
import SignIn
import Theme
import Tags


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    -- let
    --     _ = Debug.log "hey" message
    -- in
    case message of
        InputEmail newEmail ->
            ( { model | signInEmail = newEmail, signInError = "" }, Cmd.none )

        InputPassword newPassword ->
            ( { model | signInPassword = newPassword, signInError = "" }, Cmd.none )

        SignIn ->
            ( up { model | signInError = "" }, SignIn.signIn model.signInEmail model.signInPassword )

        SignInDone (Ok user) ->
            let
                oldPageState =
                    model.pageState

                newPageState =
                    { oldPageState | screen = Model.EntriesScreen Nothing Nothing Nothing }
            in
                ( down
                    { model
                        | pageState = newPageState
                        , signInError = ""
                        , theme = user.theme
                    }
                , Cmd.batch
                    [ (Ports.setTheme (Theme.toString user.theme))
                    , (Entries.getEntries Nothing)
                    ]
                )

        SignInDone (Err error) ->
            SignIn.signInDone (down model) error

        Register ->
            ( up { model | signInError = "" }, SignIn.register model.signInEmail model.signInPassword )

        NextPage ->
            Entries.nextPage model

        PreviousPage ->
            Entries.previousPage model

        CreateEntry s ->
            ( up model, Entries.create model.newEntry )

        CreateEntryDone (Ok entry) ->
            ( down
                { model
                    | entries = List.append model.entries [ entry ]
                    , newEntry = Entries.new
                }
            , Ports.clearNewEntryBody ()
            )

        CreateEntryDone (Err message) ->
            ( down model, Cmd.none )

        DeleteEntry1 entry ->
            case entry.confirmingDelete of
                True ->
                    let
                        newModel =
                            { model | entries = List.filter (\e -> not (e.id == entry.id)) model.entries }
                    in
                        ( up newModel, Entries.delete2 entry )

                False ->
                    ( swapEntry model (Entries.delete1 entry), Cmd.none )

        DeleteEntryDone (Ok ()) ->
            ( down model, Cmd.none )

        DeleteEntryDone (Err message) ->
            ( down model, Cmd.none )

        GetEntriesDone (Ok entries) ->
            ( down { model | entries = entries }, Cmd.none )

        GetEntriesDone (Err error) ->
            ( up model, Cmd.none )

        GetTagsDone (Ok tags) ->
            ( down { model | tags = tags }, Cmd.none )

        GetTagsDone (Err error) ->
            ( up model, Cmd.none )

        CloseMenu ->
            ( { model | menuOpen = False }, Cmd.none )

        ToggleMenu _ ->
            ( { model | menuOpen = not model.menuOpen }, Cmd.none )

        SetTheme theme ->
            ( up { model | theme = theme }, Theme.set theme )

        SetThemeDone _ ->
            ( down model, Ports.setTheme (Theme.toString model.theme) )

        ClearNewEntryBody ->
            ( model, Ports.clearNewEntryBody () )

        SetNewEntryBody newBody ->
            let
                entry1 =
                    model.newEntry

                entry2 =
                    { entry1 | body = newBody }

                newModel =
                    { model | newEntry = entry2 }
            in
                ( newModel, Cmd.none )

        SetNewEntryBodyAndSave newBody ->
            let
                ( newEntry, cmd ) =
                    Entries.setNewEntryBodyAndSave model.newEntry newBody
            in
                ( up { model | newEntry = newEntry }, cmd )

        SaveBody entry newBody ->
            ( up model
            , Entries.saveBody entry newBody
            )

        SaveBodyDone (Ok _) ->
            ( down model, Cmd.none )

        SaveBodyDone (Err _) ->
            ( down model, Cmd.none )

        SetTextSearch textSearch ->
            Entries.setTextSearch model textSearch

        Search ->
            let
                oldPageState =
                    model.pageState

                newPageState =
                    { oldPageState | after = Nothing, before = Nothing }

                newModel =
                    { model | pageState = newPageState }
            in
                ( newModel, Navigation.newUrl (Location.location newModel) )

        SearchDone (Ok entries) ->
            ( down { model | entries = entries }, Cmd.none )

        SearchDone (Err message) ->
            ( down model, Cmd.none )

        ClearTextSearch ->
            Entries.clearTextSearch (up model)

        ChangeUrl location ->
            route model location

        InputNewTag entry tag ->
            let
                entry2 =
                    Tags.editNewTag entry model.tags tag
            in
                ( swapEntry model entry2, Tags.get model )

        AddTag entry ->
            let
                ( entry2, cmd ) =
                    Entries.addTag entry
            in
                ( swapEntry model entry2, cmd )

        SaveTagsDone (Ok _) ->
            ( down model, Cmd.none )

        SaveTagsDone (Err _) ->
            ( down model, Cmd.none )

        DeleteTag entry tag ->
            let
                ( entry2, cmd ) =
                    Entries.deleteTag entry tag
            in
                ( up (swapEntry model entry2), cmd )

        DeleteTagDone (Ok _) ->
            ( down model, Cmd.none )

        DeleteTagDone (Err _) ->
            ( down model, Cmd.none )

        NextTagSuggestion entry ->
            ( swapEntry model (Tags.nextSuggestion entry), Cmd.none )

        PreviousTagSuggestion entry ->
            ( swapEntry model (Tags.previousSuggestion entry), Cmd.none )

        AddSuggestedTag entry tag ->
            let
                ( entry2, cmd ) =
                    Entries.addSuggestedTag entry tag
            in
                ( up (swapEntry model entry), cmd )

        TagKeyDown entry keyCode ->
            -- TODO figure out how to conditionally increment requestCount here
            let
                ( entry2, cmd ) =
                    Entries.tagKeyDown entry keyCode
            in
                ( swapEntry model entry2, cmd )


subscriptions : Model -> Sub Msg
subscriptions model =
    Ports.clickDocument (\x -> CloseMenu)


view : Model -> Html Msg
view model =
    case model.pageState.screen of
        Model.SignInScreen ->
            div [ onClick CloseMenu ]
                [ h1 [ class "app-name" ] [ a [ href "/" ] [ text "mjournal" ] ]
                , h2 [ class "app-tag" ] [ text "minimalist journaling" ]
                , SignIn.signInDiv model
                , about
                ]

        Model.EntriesScreen textSearch after before ->
            div [ onClick CloseMenu ]
                [ h1 [ class "app-name" ]
                    [ a [ href "/" ] [ text "mjournal" ]
                    ]
                , h2 [ class "app-tag" ] [ text "minimalist journaling" ]
                , Menu.component model
                , div [ class "entries" ]
                    [ Pagination.toolbar model
                    ]
                , div [ class "notebook" ]
                    [ div [ class "page" ]
                        [ EntriesView.list model
                        ]
                    , EntriesView.new model
                    ]
                , div
                    [ id "loading-bar-spinner" ]
                    [ div
                        [ classList [ ( "spinner-icon", model.requestCount > 0 ) ] ]
                        []
                    ]
                ]



-- Use this version for elm-reactor
-- init: ( Model, Cmd Msg)
-- init =
--   let flags = Flags Nothing Nothing
--   in
--     initFlags flags
--
-- main : Program Never Model Msg
-- main =
--     Html.program
--         { init = init
--         , view = view
--         , update = update
--         , subscriptions = subscriptions
--         }
-- Use this version for regular deploys


swapEntry : Model -> Model.Entry -> Model
swapEntry model entry =
    if entry.id < 0 then
        { model | newEntry = entry }
    else
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


up : Model -> Model
up model =
    { model | requestCount = model.requestCount + 1 }


down : Model -> Model
down model =
    { model | requestCount = model.requestCount - 1 }


route : Model -> Navigation.Location -> ( Model, Cmd Msg )
route model location =
    let
        pageState =
            Location.parse model.pageState location

        newModel =
            { model | pageState = pageState }
    in
        case newModel.pageState.screen of
            Model.EntriesScreen textSearch after before ->
                ( up newModel, Entries.search textSearch after before )

            Model.SignInScreen ->
                ( newModel, Cmd.none )


initFlags : Flags -> Navigation.Location -> ( Model, Cmd Msg )
initFlags flags location =
    let
        theme =
            case flags.theme of
                Just name ->
                    Theme.parse name

                Nothing ->
                    Model.Moleskine

        pageState =
            Location.parse (Pagination.init flags location) location

        model =
            { entries = []
            , newEntry = Entries.new
            , menuOpen = False
            , pageState = pageState
            , requestCount = 0
            , signInEmail = "1@example.com"
            , signInError = ""
            , signInPassword = "password"
            , theme = theme
            , tags = []
            }
    in
        route model location


main : Program Flags Model Msg
main =
    Navigation.programWithFlags ChangeUrl
        { init = initFlags
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
