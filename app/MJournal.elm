module MJournal exposing (..)

import About exposing (about)
import Core exposing (..)
import Html exposing (..)
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
            ( { model | pageState = EntriesPage, signInError = "" }, Cmd.none )

        SignInDone (Err error) ->
            SignIn.signInDone error

        SignOut ->
            ( { model | pageState = SignInPage, signInEmail = "", signInPassword = "" }, Cmd.none )


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
                , button [ onClick SignOut ] [ text "Sign Out" ]
                ]


main : Program Never Model Msg
main =
    Html.program
        { init = ( model, Cmd.none )
        , view = view
        , update = update
        , subscriptions = (\model -> Sub.none)
        }
