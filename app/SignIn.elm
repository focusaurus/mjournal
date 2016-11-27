module SignIn exposing (signInDiv, signIn, signInDone)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Http
import Json.Decode
import Json.Encode
import Messages exposing (Msg(..))
import Model exposing (Model)
import Regex

onEnter : Msg -> Attribute Msg
onEnter msg =
    -- filter "keydown" events for return key (code 13)
    on "keydown" <|
        Json.Decode.map
            (always msg)
            (keyCode |> Json.Decode.andThen is13)


is13 : Int -> Json.Decode.Decoder ()
is13 code =
    if code == 13 then
        Json.Decode.succeed ()
    else
        Json.Decode.fail "not the right key code"


signIn : String -> String -> Cmd Msg
signIn email password =
    let
        bodyValue =
            Json.Encode.object
                [ ( "email", Json.Encode.string email )
                , ( "password", Json.Encode.string password )
                ]

        body =
            Http.jsonBody (bodyValue)
    in
        Http.send SignInDone (Http.post "/api/users/sign-in" body (Json.Decode.succeed "{}"))


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
            , placeholder "you@example.com"
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
            ]
            []
        ]
