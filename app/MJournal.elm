module MJournal exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Http
import About exposing (about)
import Core exposing (..)
import SignIn


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        InputEmail newEmail ->
            ( { model | signInEmail = newEmail }, Cmd.none )

        InputPassword newPassword ->
            ( { model | signInPassword = newPassword }, Cmd.none )

        SignIn ->
            ( { model | signInError = "" }, SignIn.signIn model.signInEmail model.signInPassword )

        SignInDone (Ok x) ->
            ( { model | pageState = EntriesPage }, Cmd.none )

        SignInDone (Err error) ->
            case error of
                Http.NetworkError ->
                    ( { model | signInError = "Cannot reach server. Check your Internet connection and retry." }, Cmd.none )

                Http.Timeout ->
                    ( { model | signInError = "Cannot reach server. Check your Internet connection and retry." }, Cmd.none )

                Http.BadStatus code ->
                    ( { model | signInError = "Check your information and try again" }, Cmd.none )

                Http.BadUrl message ->
                    ( { model | signInError = "Unexpected BadUrl error. Sorry. " ++ message }, Cmd.none )

                Http.BadPayload message _ ->
                    ( { model | signInError = "Unexpected BadPayload error. Sorry. " ++ message }, Cmd.none )

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
