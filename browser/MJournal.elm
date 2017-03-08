module MJournal exposing (main)

import About exposing (about)
import EntriesView
import Entry
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Location
import Menu
import Messages exposing (Msg(..))
import Model exposing (Model, Theme, Flags, Screen(..))
import Navigation
import Pagination
import Ports
import Process
import Set
import SignIn
import Spinner
import Tag
import Tag
import Task
import Theme
import Time


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    let
        _ =
            Debug.log "update: " message
    in
        case message of
            InputEmail newEmail ->
                ( { model | signInEmail = newEmail, signInError = "" }
                , Cmd.none
                )

            InputPassword newPassword ->
                ( { model | signInPassword = newPassword, signInError = "" }
                , Cmd.none
                )

            SignIn ->
                ( { model
                    | signInError = ""
                    , signInEmail = ""
                    , signInPassword = ""
                  }
                , SignIn.signIn model.signInEmail model.signInPassword
                )

            SignInDone (Ok user) ->
                let
                    oldPageState =
                        model.pageState

                    newPageState =
                        { oldPageState
                            | screen = Model.EntriesScreen Nothing Nothing Nothing
                            , userId = Just user.id
                        }

                    model2 =
                        { model
                            | pageState = newPageState
                            , signInError = ""
                            , showReSignIn = False
                            , theme = user.theme
                        }
                            |> Spinner.down
                            |> errorOff
                in
                    ( model2
                    , Cmd.batch
                        [ Ports.setTheme (Theme.toString user.theme)
                        , Entry.search Nothing Nothing Nothing
                          -- , Navigation.newUrl (Location.location model2)
                        ]
                    )

            SignInDone (Err error) ->
                SignIn.signInDone (model |> Spinner.down |> errorOff) error

            Register ->
                ( { model | signInError = "" }
                , SignIn.register model.signInEmail model.signInPassword
                )

            CloseReSignIn ->
                ( { model | showReSignIn = False }, Cmd.none )

            NextPage ->
                Entry.nextPage model

            PreviousPage ->
                Entry.previousPage model

            CreateEntry s ->
                ( model |> Spinner.up, Entry.create model.newEntry )

            CreateEntryDone (Ok entry) ->
                ( { model
                    | entries = List.append model.entries [ entry ]
                    , newEntry = Entry.new
                  }
                    |> Spinner.down
                    |> errorOff
                , Ports.clearNewEntryBody ()
                )

            CreateEntryDone (Err error) ->
                ( model |> Spinner.down |> errorOn |> checkAuth error, Cmd.none )

            DeleteEntry1 entry ->
                case entry.confirmingDelete of
                    True ->
                        let
                            model2 =
                                { model | entries = List.filter (\e -> e.id /= entry.id) model.entries }
                        in
                            ( model2 |> Spinner.up, Entry.delete2 entry )

                    False ->
                        ( swapEntry model (Entry.delete1 entry)
                        , Process.sleep (Time.second * 2)
                            |> Task.perform (always (TimeoutDeleteEntry entry))
                        )

            DeleteEntryDone (Ok _) ->
                ( model |> Spinner.down |> errorOff, Cmd.none )

            DeleteEntryDone (Err error) ->
                ( model |> Spinner.down |> errorOn |> checkAuth error, Cmd.none )

            TimeoutDeleteEntry entry ->
                ( { model
                    | entries = List.map (\e -> { e | confirmingDelete = False }) model.entries
                  }
                , Cmd.none
                )

            GetEntriesDone (Ok entries) ->
                ( { model | entries = entries } |> Spinner.down |> errorOff, Cmd.none )

            GetEntriesDone (Err error) ->
                ( model |> Spinner.down |> errorOn |> checkAuth error, Cmd.none )

            GetTagsDone (Ok tags) ->
                ( { model | tags = Set.fromList tags }
                    |> Spinner.down
                    |> errorOff
                , Cmd.none
                )

            GetTagsDone (Err error) ->
                ( model |> Spinner.down |> checkAuth error, Cmd.none )

            CloseMenu ->
                ( { model | menuOpen = False }, Cmd.none )

            ToggleMenu _ ->
                ( { model | menuOpen = not model.menuOpen }, Cmd.none )

            SetTheme theme ->
                ( { model | theme = theme } |> Spinner.up, Theme.set theme )

            SetThemeDone (Ok _) ->
                ( model |> Spinner.down |> errorOff, Ports.setTheme (Theme.toString model.theme) )

            SetThemeDone (Err error) ->
                ( model |> Spinner.down |> errorOff |> checkAuth error, Ports.setTheme (Theme.toString model.theme) )

            ClearNewEntryBody ->
                ( model, Ports.clearNewEntryBody () )

            SetNewEntryBody newBody ->
                let
                    entry1 =
                        model.newEntry

                    entry2 =
                        { entry1 | body = newBody }

                    model2 =
                        { model | newEntry = entry2 }
                in
                    ( model2, Cmd.none )

            SetNewEntryBodyAndSave newBody ->
                let
                    ( newEntry, cmd ) =
                        Entry.setNewEntryBodyAndSave model.newEntry newBody
                in
                    ( { model | newEntry = newEntry } |> Spinner.up, cmd )

            SaveBody entry newBody ->
                ( model |> Spinner.up
                , Entry.saveBody entry newBody
                )

            SaveBodyDone (Ok _) ->
                ( model |> Spinner.down |> errorOff, Cmd.none )

            SaveBodyDone (Err error) ->
                ( model |> Spinner.down |> errorOn |> checkAuth error, Cmd.none )

            SetTextSearch textSearch ->
                Entry.setTextSearch model textSearch

            Search ->
                let
                    oldPageState =
                        model.pageState

                    newPageState =
                        { oldPageState | after = Nothing, before = Nothing }

                    model2 =
                        { model | pageState = newPageState }
                in
                    ( model2, Navigation.newUrl (Location.location model2) )

            SearchDone (Ok entries) ->
                ( { model | entries = entries } |> Spinner.down |> errorOff, Cmd.none )

            SearchDone (Err error) ->
                ( model |> Spinner.down |> errorOn |> checkAuth error, Cmd.none )

            ClearTextSearch ->
                Entry.clearTextSearch (Spinner.up model)

            ChangeUrl location ->
                route model location

            InputNewTag entry tag ->
                let
                    entry2 =
                        Tag.editNewTag entry model.tags tag
                in
                    ( swapEntry model entry2, Tag.get model )

            SaveTagsDone (Ok _) ->
                ( model |> Spinner.down |> errorOff, Cmd.none )

            SaveTagsDone (Err error) ->
                ( model |> Spinner.down |> errorOn |> checkAuth error, Cmd.none )

            DeleteTag entry tag ->
                let
                    ( entry2, cmd ) =
                        Entry.deleteTag entry tag
                in
                    ( swapEntry model entry2 |> Spinner.up, cmd )

            DeleteTagDone (Ok _) ->
                ( model |> Spinner.down |> errorOff, Cmd.none )

            DeleteTagDone (Err error) ->
                ( model |> Spinner.down |> errorOn |> checkAuth error, Cmd.none )

            NextTagSuggestion entry ->
                ( swapEntry model (Tag.nextSuggestion entry), Cmd.none )

            PreviousTagSuggestion entry ->
                ( swapEntry model (Tag.previousSuggestion entry), Cmd.none )

            AddSuggestedTag entry tag ->
                let
                    ( entry2, cmd ) =
                        Entry.addSuggestedTag entry tag
                in
                    ( swapEntry model entry2 |> Spinner.up, cmd )

            TagKeyDown entry keyCode ->
                let
                    ( entry2, saveEntryCmd ) =
                        Entry.tagKeyDown entry keyCode

                    model2 =
                        { model
                            | tags = Set.union model.tags (Set.fromList entry2.tags)
                        }

                    getTagsCmd =
                        Tag.get model

                    realCmds =
                        List.filter (\c -> c /= Cmd.none) [ saveEntryCmd, getTagsCmd ]

                    model3 =
                        { model2 | requestCount = model2.requestCount + (List.length realCmds) }
                in
                    ( swapEntry model3 entry2, Cmd.batch realCmds )


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
                [ case model.errorMessage of
                    Nothing ->
                        text ""

                    Just errorMessage ->
                        i [ class "error fixed-error icon-warning", title errorMessage ] []
                , h1 [ class "app-name" ]
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
                , if model.showReSignIn then
                    SignIn.reSignInDiv model
                  else
                    text ""
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


checkAuth : Http.Error -> Model -> Model
checkAuth error model =
    let
        _ =
            Debug.log "checkAuth" error
    in
        case error of
            Http.BadStatus bs ->
                case bs.status.code of
                    401 ->
                        { model | showReSignIn = True }

                    _ ->
                        model

            _ ->
                model


errorOn : Model -> Model
errorOn model =
    { model
        | errorMessage = Just "Unable to save your changes. Reload the page and try again."
    }


errorOff : Model -> Model
errorOff model =
    { model
        | errorMessage = Nothing
    }


route : Model -> Navigation.Location -> ( Model, Cmd Msg )
route model location =
    let
        _ =
            Debug.log "route pageState before" model.pageState
        pageState =
            Location.parse model.pageState location

        model2 =
            { model | pageState = pageState }
        _ =
            Debug.log "route pageState after" model2.pageState

    in
        case model2.pageState.screen of
            Model.EntriesScreen textSearch after before ->
                ( model2 |> Spinner.up, Entry.search textSearch after before )

            Model.SignInScreen ->
                ( model2, Cmd.none )


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
            , newEntry = Entry.new
            , menuOpen = False
            , pageState = pageState
            , requestCount = 0
            , signInEmail = ""
            , signInError = ""
            , signInPassword = ""
            , theme = theme
            , tags = Set.empty
            , errorMessage = Nothing
            , showReSignIn = False
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
