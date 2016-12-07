module SignIn exposing (signInDiv, signIn, signInDone)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Http
import Json.Decode as JD
import Json.Encode as JE
import Messages exposing (Msg(..))
import Model exposing (Model)
import Regex
import Theme


userDecoder =
    (JD.map2 Model.User
        (JD.field "id" JD.int)
        (JD.field "theme" Theme.themeDecoder)
    )


onEnter : Msg -> Attribute Msg
onEnter msg =
    -- filter "keydown" events for return key (code 13)
    on "keydown" <|
        JD.map
            (always msg)
            (keyCode |> JD.andThen is13)


is13 : Int -> JD.Decoder ()
is13 code =
    if code == 13 then
        JD.succeed ()
    else
        JD.fail "not the right key code"


signIn : String -> String -> Cmd Msg
signIn email password =
    let
        bodyValue =
            JE.object
                [ ( "email", JE.string email )
                , ( "password", JE.string password )
                ]

        body =
            Http.jsonBody (bodyValue)
    in
        Http.send SignInDone (Http.post "/api/users/sign-in" body userDecoder)


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
            ]
            []
        ]
