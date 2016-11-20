module MJournal exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick, keyCode, on)
-- import Http
import Json.Decode
-- import Json.Encode
-- import Regex
import SignIn


type alias Model =
    { entries : List String
    , signIn : SignIn.Model
    , pageState : PageState
    }


model : Model
model =
    { entries = []
    , signIn = SignIn.model
    , pageState = SignInPage
    }


type Msg
    = InputEmail String
    | InputPassword String
    | SignIn.SignInMsg
      -- | SignIn.SignInDone (Result Http.Error String)
    | SignOut


type PageState
    = SignInPage
    | EntriesPage



-- filter "keydown" events for return key (code 13)
-- From: https://gist.github.com/pzingg/4262f479985ff2a325bf3d694413d6ee


onEnter : Msg -> Attribute Msg
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


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        SignIn.SignInMsg ->
            let
                ( newSignInModel, cmd ) =
                    SignIn.update message model.signIn
            in
                ( { model | signIn = newSignInModel }, cmd )


view : Model -> Html Msg
view model =
    case model.pageState of
        SignInPage ->
            div []
                [ h1 [ class "app-name" ] [ a [ href "/" ] [ text "mjournal" ] ]
                , h2 [ class "app-tag" ] [ text "minimalist journaling" ]
                , SignIn.signInDiv model.signIn
                , aboutDiv
                ]

        EntriesPage ->
            div []
                [ h1 [] [ text "Signed in. here are you entries" ]
                , button [ onClick SignOut ] [ text "Sign Out" ]
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
