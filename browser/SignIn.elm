module SignIn exposing (signInDiv, signIn, signInDone, register, reSignInDiv)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Events exposing (onEnter)
import Http
import Json.Decode as JD
import Json.Encode as JE
import Messages exposing (Msg(..))
import Model exposing (Model)
import Regex
import Theme


userDecoder : JD.Decoder Model.User
userDecoder =
    (JD.map2 Model.User
        (JD.field "id" JD.int)
        (JD.field "theme" Theme.themeDecoder)
    )


signIn_ : String -> String -> String -> Cmd Msg
signIn_ endPoint email password =
    let
        bodyValue =
            JE.object
                [ ( "email", JE.string email )
                , ( "password", JE.string password )
                ]

        body =
            Http.jsonBody (bodyValue)

        url =
            "/api/users/" ++ endPoint
    in
        Http.send SignInDone (Http.post url body userDecoder)


signIn : String -> String -> Cmd Msg
signIn email password =
    signIn_ "sign-in" email password


register : String -> String -> Cmd Msg
register email password =
    signIn_ "sign-up" email password


canSignIn : Model -> Bool
canSignIn model =
    List.all identity
        [ -- rules permitting sign in
          Regex.contains (Regex.regex ".@.") model.signInEmail
        , not (String.isEmpty model.signInPassword)
        ]


signInDone : Model -> Http.Error -> ( Model, Cmd Msg )
signInDone model error =
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


signInDiv : Model -> Html Msg
signInDiv model =
    div
        [ class "sign-in" ]
        [ div [ class "error" ] [ text model.signInError ]
        , label [] [ text "email" ]
        , input
            [ type_ "email"
            , autofocus True
            , onInput InputEmail
            , onEnter SignIn
            ]
            []
        , label [] [ text "password" ]
        , input [ type_ "password", onInput InputPassword, onEnter SignIn ] []
        , input
            [ type_ "submit"
            , class "signIn"
            , value "Sign In"
            , disabled (not (canSignIn model))
            , onClick SignIn
            ]
            []
        , input
            [ type_ "submit"
            , class "register"
            , value "Register"
            , disabled (not (canSignIn model))
            , onClick Register
            ]
            []
        ]


reSignInDiv : Model.Model -> Html Msg
reSignInDiv model =
    node "quick-dialog"
        []
        [ div
            [ class "quick-dialog" ]
            --, ng-show "dialog.isVisible" ]
            [ span
                [ class "quick-dialog__close", onClick CloseReSignIn ]
                [ text "x" ]
            , div
                [ class "quick-dialog__content" ]
                [ div
                    [ class "sign-in " ]
                    [ h2
                        []
                        [ text "Please sign in again" ]
                    , div
                        [ class "error" ]
                        --, ng-bind "error" ]
                        []
                    , label
                        []
                        [ text "email" ]
                    , input
                        [ type_ "email"
                        , autofocus True
                        , onInput InputEmail
                        , onEnter SignIn
                        ]
                        -- ng-model "email" ]
                        []
                    , label
                        []
                        [ text "password" ]
                    , input
                        [ type_ "password", onInput InputPassword, onEnter SignIn ]
                        -- ng-model "password" ]
                        []
                    , input
                        [ class "signIn"
                        , value "Sign In"
                        , type_ "submit"
                        , disabled (not (canSignIn model))
                        , onClick SignIn
                        ]
                        []
                    ]
                ]
            ]
        ]
