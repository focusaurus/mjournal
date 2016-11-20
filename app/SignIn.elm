module SignIn exposing (update, SignInMsg(..), Model, model, signInDiv)

import Html
import Html.Attributes exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Http
import Json.Decode
import Json.Encode
import Regex
-- import Msg.Msg as Msg

type alias Model =
    { email : String
    , password : String
    , error : String
    }


model : Model
model =
    { email = ""
    , password = ""
    , error = ""
    }


type SignInMsg
    = InputEmail String
    | InputPassword String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut


signIn : String -> String -> Cmd SignInMsg
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
        Http.send SignInDone (Http.post "/api/users/sign-in" body (Json.Decode.succeed "x"))


canSignIn : Model -> Bool
canSignIn model =
    List.all identity
        [ -- rules permitting sign in
          Regex.contains (Regex.regex ".@.") model.email
        , not (String.isEmpty model.password)
        ]



-- filter "keydown" events for return key (code 13)
-- From: https://gist.github.com/pzingg/4262f479985ff2a325bf3d694413d6ee


onEnter : SignInMsg -> Attribute SignInMsg
onEnter msg =
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


update : SignInMsg -> Model -> ( Model, Cmd SignInMsg )
update message model =
    case message of
        InputEmail newEmail ->
            ( { model | email = newEmail }, Cmd.none )

        InputPassword newPassword ->
            ( { model | password = newPassword }, Cmd.none )

        SignIn ->
            ( { model | error = "" }, signIn model.email model.password )

        SignInDone (Err error) ->
            case error of
                Http.NetworkError ->
                    ( { model | error = "Cannot reach server. Check your Internet connection and retry." }, Cmd.none )

                Http.Timeout ->
                    ( { model | error = "Cannot reach server. Check your Internet connection and retry." }, Cmd.none )

                Http.BadStatus code ->
                    ( { model | error = "Check your information and try again" }, Cmd.none )

                Http.BadUrl message ->
                    ( { model | error = "Unexpected BadUrl error. Sorry. " ++ message }, Cmd.none )

                Http.BadPayload message _ ->
                    ( { model | error = "Unexpected BadPayload error. Sorry. " ++ message }, Cmd.none )

        SignInDone (Ok _) ->
            ( { model | error = "" }, Cmd.none )

        SignOut ->
            ( model, Cmd.none )


signInDiv : Model -> Html SignInMsg
signInDiv model =
    div
        [ class "sign-in" ]
        [ div [ class "error" ] [ text model.error ]
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
