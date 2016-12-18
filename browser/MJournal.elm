port module MJournal exposing (main)

import About exposing (about)
import Entries
import EntriesView
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Menu
import Messages exposing (Msg(..))
import Model exposing (Model, Theme, Flags)
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
            ( { model
                | pageState = Model.EntriesPage
                , signInError = ""
                , theme = user.theme
              }
            , Cmd.batch [ (Theme.setTheme (Theme.toString user.theme)), (Entries.getEntries Nothing) ]
            )

        SignInDone (Err error) ->
            SignIn.signInDone model error

        Register ->
            ( { model | signInError = "" }, SignIn.register model.signInEmail model.signInPassword )

        ClickNext ->
            ( { model | direction = Just Model.Next }, Entries.nextPage model )

        ClickPrevious ->
            ( { model | direction = Just Model.Previous }, Entries.previousPage model )

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

        SetQuery query ->
            ( { model | query = query }, Cmd.none )

        Search ->
            ( model, Entries.search model.query )

        SearchDone (Ok entries) ->
            ( { model | entries = entries }, Cmd.none )

        SearchDone (Err message) ->
            ( model, Cmd.none )



-- NoOp _ ->
--     ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    clickDocument (\x -> CloseMenu)


view : Model -> Html Msg
view model =
    case model.pageState of
        Model.SignInPage ->
            div [ onClick CloseMenu ]
                [ h1 [ class "app-name" ] [ a [ href "/" ] [ text "mjournal" ] ]
                , h2 [ class "app-tag" ] [ text "minimalist journaling" ]
                , SignIn.signInDiv model
                , about
                ]

        Model.EntriesPage ->
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


initFlags : Flags -> ( Model, Cmd Msg )
initFlags flags =
    let
        theme =
            case flags.theme of
                Just name ->
                    Theme.parse name

                Nothing ->
                    Model.Moleskine

        mod =
            { entries = []
            , direction = Nothing
            , newEntryBody = ""
            , menuOpen = False
            , pageSize = 50
            , pageState =
                case flags.id of
                    Just id ->
                        Model.EntriesPage

                    Nothing ->
                        Model.SignInPage
            , query = ""
            , signInEmail = "1@example.com"
            , signInError = ""
            , signInPassword = "password"
            , theme = theme
            }

        cmd =
            case flags.id of
                Just id ->
                    Entries.getEntries Nothing

                Nothing ->
                    Cmd.none
    in
        -- ( mod, SignIn.signIn mod.signInEmail mod.signInPassword )
        ( mod, cmd )


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = initFlags
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
