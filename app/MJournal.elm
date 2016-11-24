module MJournal exposing (..)

import About exposing (about)
import Core exposing (..)
import Html exposing (..)
import Entries exposing (getEntries)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import SignIn


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
            ( { model | pageState = EntriesPage, signInError = "" }, Entries.getEntries )

        SignInDone (Err error) ->
            SignIn.signInDone model error

        SignOut ->
            ( { model | pageState = SignInPage, signInEmail = "", signInPassword = "" }, Cmd.none )

        GetEntriesDone (Ok entries) ->
            ( { model | entries = entries }, Cmd.none )

        GetEntriesDone (Err error) ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    case model.pageState of
        SignInPage ->
            div []
                [ h1 [ class "app-name" ] [ a [ href "/" ] [ text "mjournal" ] ]
                , h2 [ class "app-tag" ] [ text "minimalist journaling" ]
                , SignIn.signInDiv model
                , about
                ]

        EntriesPage ->
            div []
                [ h1 [] [ text "Signed in. here are you entries" ]
                , Entries.entriesList model
                , button [ onClick SignOut ] [ text "Sign Out" ]
                ]


main : Program Never Model Msg
main =
    Html.program
        { init = ( coreModel, Cmd.none )
        , view = view
        , update = update
        , subscriptions = (\model -> Sub.none)
        }
