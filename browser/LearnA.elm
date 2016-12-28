module LearnA exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on)


type Msg
    = Msg1


type alias Model =
    { tags : List String
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Msg1 ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Learn Elm A" ]
        , input [] []
        ]


init : ( Model, Cmd Msg )
init =
    ( Model [], Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
