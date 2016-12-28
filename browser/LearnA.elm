module LearnA exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on)
import Json.Decode as JD


type Msg
    = ValueKeyCode String Int


type alias Model =
    { tags : List String
    }


onDown : (String -> Int -> Msg) -> Attribute Msg
onDown tagger =
    on "keydown"
        (JD.map2
            (\s i -> tagger s i)
            (JD.at [ "target", "value" ] JD.string)
            (JD.field "keyCode" JD.int)
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        ValueKeyCode value keyCode ->
            let
                _ =
                    Debug.log "ValueKeyCode" value ++ ": " ++ toString keyCode
            in
                ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Learn Elm A" ]
        , input [ onDown ValueKeyCode ] []
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
