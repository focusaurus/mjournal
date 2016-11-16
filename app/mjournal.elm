module MJournal exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
import Http
import Json.Decode
import Json.Encode
import Regex


type alias Model =
    { entries : List String
    , signInEmail : String
    , signInPassword : String
    , signInError : String
    , pageState : PageState
    }


model : Model
model =
    { entries = []
    , signInEmail = ""
    , signInPassword = ""
    , signInError = ""
    , pageState = SignInPage
    }


type Msg
    = InputEmail String
    | InputPassword String
    | SignIn
    | SignInDone (Result Http.Error String)
    | SignOut


type PageState
    = SignInPage
    | EntriesPage


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
        Http.send SignInDone (Http.post "/api/users/sign-in" body (Json.Decode.succeed "x"))


canSignIn : Model -> Bool
canSignIn model =
    List.all identity
        [ -- rules permitting sign in
          Regex.contains (Regex.regex ".@.") model.signInEmail
        , not (String.isEmpty model.signInPassword)
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        InputEmail newEmail ->
            ( { model | signInEmail = newEmail }, Cmd.none )

        InputPassword newPassword ->
            ( { model | signInPassword = newPassword }, Cmd.none )

        SignIn ->
            ( { model | signInError = "" }, signIn model.signInEmail model.signInPassword )

        SignInDone (Ok x) ->
            ( { model | pageState = EntriesPage }, Cmd.none )

        SignInDone (Err _) ->
            ( { model | signInError = "Check your information and try again" }, Cmd.none )

        SignOut ->
            ( { model | pageState = SignInPage, signInEmail = "", signInPassword = "" }, Cmd.none )


view : Model -> Html Msg
view model =
    case model.pageState of
        SignInPage ->
            div []
                [ h1 [ class "app-name" ] [ a [ href "/" ] [ text "mjournal" ] ]
                , h2 [ class "app-tag" ] [ text "minimalist journaling" ]
                , signInDiv model
                , aboutDiv
                ]

        EntriesPage ->
            div []
                [ h1 [] [ text "Signed in. here are you entries" ]
                , button [ onClick SignOut ] [ text "Sign Out" ]
                ]


signInDiv : Model -> Html Msg
signInDiv model =
    div
        [ class "sign-in" ]
        [ div [ class "error" ] [ text model.signInError ]
        , label [] [ text "email" ]
        , input [ type_ "email", placeholder "you@example.com", onInput InputEmail ] []
        , label [] [ text "password" ]
        , input [ type_ "password", onInput InputPassword ] []
          -- , input [ type_ "password", onInput InputPassword,  onEnter SignIn] []
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


main : Program Never Model Msg
main =
    Html.program
        { init = ( model, Cmd.none )
        , view = view
        , update = update
        , subscriptions = (\model -> Sub.none)
        }
