module MJournal exposing (main)

import About exposing (about)
import Entries exposing (getEntries)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Menu
import Messages exposing (Msg(..))
import Model exposing (Model, initModel, Theme)
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

        SignInDone (Ok x) ->
            ( { model | pageState = Model.EntriesPage, signInError = "" }, Entries.getEntries Nothing )

        ClickNext ->
            ( { model | direction = Just Model.Next }, Entries.nextPage model )

        ClickPrevious ->
            ( { model | direction = Just Model.Previous }, Entries.previousPage model )

        SignInDone (Err error) ->
            SignIn.signInDone model error

        SignOut ->
            ( { model | pageState = Model.SignInPage, signInEmail = "", signInPassword = "" }, Cmd.none )

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
          ( model, ThemeDom.setTheme model.theme.name )
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
                , button [ onClick SignOut ] [ text "Sign Out" ]
                ]


main : Program Never Model Msg
main =
    Html.program
        { init = ( initModel, SignIn.signIn initModel.signInEmail initModel.signInPassword )
        , view = view
        , update = update
        , subscriptions = (\model -> Sub.none)
        }
