module MJournal exposing (..)

import Html exposing (..)
import Html.App
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Http
import Json.Encode
import Json.Decode
import Regex exposing (contains, regex)
import String
import Task


type alias Model =
    { entries : List String
    , signInEmail : String
    , signInPassword : String
    , enableSignIn : Bool
    }


model : Model
model =
    { entries = []
    , signInEmail = ""
    , signInPassword = ""
    , enableSignIn = False
    }


type Message
    = InputEmail String
    | InputPassword String
    | SignInStart
    | SignInSucceed Http.Response
    | SignInFail Http.Error


view : Model -> Html Message
view model =
    div []
        [ h1
            [ class "app-name" ]
            [ a
                [ href "/" ]
                [ text "mjournal" ]
            ]
        , h2
            [ class "app-tag" ]
            [ text "minimalist journaling" ]
        , signInDiv model
        , aboutDiv
        ]


signInDiv : Model -> Html Message
signInDiv model =
    div
        [ class "sign-in" ]
        [ div [ class "error" ] []
        , label [] [ text "email" ]
        , input [ type' "email", placeholder "you@example.com", onInput InputEmail ] []
        , label [] [ text "password" ]
        , input [ type' "password", onInput InputPassword ]
            []
        , input
            [ type' "submit", class "signIn", value "Sign In", disabled (not (canSignIn model)), onClick SignInStart ]
            []
        , input
            [ type' "submit", class "register", value "Register", disabled (not (canSignIn model)) ]
            []
        ]


aboutDiv : Html a
aboutDiv =
    div
        [ class "about" ]
        [ h3
            []
            [ text "mjournal is a clean, organized journal for notes and thoughts" ]
        , ul
            []
            [ li
                []
                [ text "uncluttered design lets you focus on your words" ]
            , li
                []
                [ text "Entries are automatically timestamped and displayed chronologically" ]
            , li
                []
                [ text "Use tags as a simple way to categorize related entries" ]
            , li
                []
                [ text "Powerful full-text search lets you find entries quickly" ]
            ]
        ]



-- setSignInFormEmail : { b | email : a } -> c -> { b | email : c }
-- setSignInFormEmail signInForm email =
--     { signInForm | email = email }
--
--
-- setSignInForm {signInForm} email =
--     {signInForm | email = email}
-- noEmpties : List String -> Bool
-- noEmpties strings =
--     List.all (\x -> not (String.isEmpty x)) strings


canSignIn : Model -> Bool
canSignIn model =
    List.all identity
        [ -- rules permitting sign in
          contains (regex ".@.") model.signInEmail
        , not (String.isEmpty model.signInPassword)
        ]


update : Message -> Model -> ( Model, Cmd Message )
update message model =
    case message of
        SignInStart ->
            ( model, Cmd.none )

        -- ( model, signIn model.signInEmail model.signInPassword )
        InputEmail newEmail ->
            ( { model | signInEmail = newEmail }, Cmd.none )

        InputPassword newPassword ->
            ( { model | signInPassword = newPassword }, Cmd.none )

        SignInSucceed hey ->
            ( model, Cmd.none )

        SignInFail error ->
            ( model, Cmd.none )



-- signIn : String -> String -> Cmd Message
-- signIn email password =
--     let
--         jstring =
--             Json.Encode.string
--
--         bodyValue =
--             Json.Encode.object
--                 [ ( "email", jstring email )
--                 , ( "password", jstring password )
--                 ]
--
--         body =
--             Json.Encode.encode 0 bodyValue
--     in
--         Task.perform SignInFail SignInSucceed (Http.post Json.Decode.value "sign-in" (Http.string body))


unused email password =
    Http.post Json.Decode.value "sign-in" (Http.string "{}")


main : Program Never
main =
    Html.App.program
        { init = ( model, Cmd.none )
        , view = view
        , update = update
        , subscriptions = (\model -> Sub.none)
        }
