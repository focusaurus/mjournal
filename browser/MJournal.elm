port module MJournal exposing (main)

import About exposing (about)
import Entries
import EntriesView
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Location
import Menu
import Messages exposing (Msg(..))
import Model exposing (Model, Theme, Flags, Screen(..))
import Navigation
import Pagination
import SignIn
import Theme


port clickDocument : (Bool -> msg) -> Sub msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        InputEmail newEmail ->
            ( { model | signInEmail = newEmail, signInError = "" }, Cmd.none )

        InputPassword newPassword ->
            ( { model | signInPassword = newPassword, signInError = "" }, Cmd.none )

        SignIn ->
            ( { model | signInError = "" }, SignIn.signIn model.signInEmail model.signInPassword )

        SignInDone (Ok user) ->
            let
                oldPageState =
                    model.pageState

                newPageState =
                    { oldPageState | screen = Model.EntriesScreen Nothing Nothing Nothing }
            in
                ( { model
                    | pageState = newPageState
                    , signInError = ""
                    , theme = user.theme
                  }
                , Cmd.batch
                    [ (Theme.setTheme (Theme.toString user.theme))
                    , (Entries.getEntries Nothing)
                    ]
                )

        SignInDone (Err error) ->
            SignIn.signInDone model error

        Register ->
            ( { model | signInError = "" }, SignIn.register model.signInEmail model.signInPassword )

        NextPage ->
            Entries.nextPage model

        PreviousPage ->
            Entries.previousPage model

        -- NextPage ->
        --     ( { model | direction = Just Model.Next }, Entries.nextPage model )
        --
        -- PreviousPage ->
        --     ( { model | direction = Just Model.Previous }, Entries.previousPage model )
        CreateEntry body ->
            ( model, Entries.createEntry body )

        CreateEntryDone (Ok entry) ->
            ( { model
                | entries = List.append model.entries [ entry ]
                , newEntryBody = ""
              }
            , Cmd.none
            )

        CreateEntryDone (Err message) ->
            ( model, Cmd.none )

        DeleteEntry1 entry ->
            case entry.confirmingDelete of
                True ->
                    let
                        newModel =
                            { model | entries = List.filter (\e -> not (e.id == entry.id)) model.entries }
                    in
                        ( newModel, Entries.delete2 entry )

                False ->
                    let
                        newModel =
                            Entries.delete1 model entry
                    in
                        ( newModel, Cmd.none )

        DeleteEntryDone (Ok ()) ->
            ( model, Cmd.none )

        DeleteEntryDone (Err message) ->
            ( model, Cmd.none )

        GetEntriesDone (Ok entries) ->
            ( { model | entries = entries }, Cmd.none )

        GetEntriesDone (Err error) ->
            ( model, Cmd.none )

        CloseMenu ->
            ( { model | menuOpen = False }, Cmd.none )

        ToggleMenu _ ->
            ( { model | menuOpen = not model.menuOpen }, Cmd.none )

        SetTheme theme ->
            ( { model | theme = theme }, Theme.set theme )

        SetThemeDone _ ->
            ( model, Theme.setTheme (Theme.toString model.theme) )

        SetNewEntryBody newBody ->
            ( { model | newEntryBody = newBody }, Cmd.none )

        SaveEntry entry body ->
            let
                newModel =
                    Entries.editBody model entry body
            in
                ( newModel, Entries.saveBody entry body )

        SaveBodyDone (Ok _) ->
            ( model, Cmd.none )

        SaveBodyDone (Err _) ->
            ( model, Cmd.none )

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
            ( { model | entries = entries }, Cmd.none )

        SearchDone (Err message) ->
            ( model, Cmd.none )

        ClearTextSearch ->
            Entries.clearTextSearch model

        ChangeUrl location ->
            let
                newModel =
                    { model | pageState = Location.parse2 model.pageState location }

                _ =
                    Debug.log "ChangeUrl newModel" newModel.pageState.textSearch

                cmd =
                    case newModel.pageState.screen of
                        Model.EntriesScreen textSearch after before ->
                            Entries.search3 textSearch after before

                        Model.SignInScreen ->
                            Cmd.none
            in
                ( newModel, cmd )



-- NoOp _ ->
--     ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    clickDocument (\x -> CloseMenu)


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
                    [ EntriesView.new model
                    , div [ class "page" ]
                        [ EntriesView.list model
                        ]
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


route : Model -> Navigation.Location -> ( Model, Cmd Msg )
route model location =
    let
        oldPageState =
            model.pageState

        screen =
            Location.parse location

        newPageState =
            { oldPageState | screen = screen }

        newModel =
            { model | pageState = newPageState }

        _ =
            Debug.log "route screen" screen

        cmd =
            case screen of
                Model.EntriesScreen textSearch after before ->
                    Entries.search3 textSearch after before

                Model.SignInScreen ->
                    Cmd.none
    in
        ( newModel, cmd )


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
            Location.parse2 (Pagination.init flags location) location

        model =
            { entries = []
            , newEntryBody = ""
            , menuOpen = False
            , pageState = pageState
            , signInEmail = "1@example.com"
            , signInError = ""
            , signInPassword = "password"
            , theme = theme
            }

        -- cmd =
        --     case flags.id of
        --         Just id ->
        --             Entries.search3 mod.pageState.screen
        --
        --         Nothing ->
        --             Cmd.none
    in
        -- ( mod, SignIn.signIn mod.signInEmail mod.signInPassword )
        -- ( mod, cmd )
        route model location


main : Program Flags Model Msg
main =
    Navigation.programWithFlags ChangeUrl
        { init = initFlags
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
