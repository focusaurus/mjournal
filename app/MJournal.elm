module MJournal exposing (main)

import About exposing (about)
import ClickDocument exposing (clickDocument)
import Entries exposing (getEntries)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Menu
import Messages exposing (Msg(..))
import Model exposing (Model, Theme, Flags)
import Pagination
import SignIn
import Theme
import ThemeDom


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
            -- ( { model | pageState = Model.EntriesPage, signInError = "", theme = user.theme }, Entries.getEntries Nothing )
            ( { model
                | pageState = Model.EntriesPage
                , signInError = ""
                , theme = user.theme
              }
            -- TODO combine tasks here, set theme in DOM and getEntries
            -- , ThemeDom.setTheme (Theme.toString user.theme)
            , Entries.getEntries Nothing
            )

        SignInDone (Err error) ->
            SignIn.signInDone model error

        ClickNext ->
            ( { model | direction = Just Model.Next }, Entries.nextPage model )

        ClickPrevious ->
            ( { model | direction = Just Model.Previous }, Entries.previousPage model )

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
            ( model, ThemeDom.setTheme (Theme.toString model.theme) )



-- NoOp _ ->
--     ( model, Cmd.none )


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
                    [ div [ class "page" ]
                        [ Entries.entriesList model
                        ]
                    ]
                ]


init : Flags -> ( Model, Cmd Msg )
init flags =
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
            , menuOpen = False
            , pageSize = 50
            , pageState =
                case flags.id of
                    Just id ->
                        Model.EntriesPage

                    Nothing ->
                        Model.SignInPage
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


subscriptions : Model -> Sub Msg
subscriptions model =
    clickDocument (\x -> CloseMenu)


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
