module LearnA exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, onInput)
import Json.Decode as JD


type Msg
    = SetTextContent String


type alias Model =
    { textContent : String
    }


textContentDecoder : JD.Decoder String
textContentDecoder =
    JD.at [ "target", "textContent" ] JD.string


onEdit : (String -> value) -> Attribute value
onEdit tagger =
    on "input" (JD.map tagger textContentDecoder)


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        SetTextContent textContent ->
            let
                _ =
                    Debug.log "update textContent" (textContent ++ "foo\nbar\nbaz")
            in
                ( { model | textContent = textContent }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 []
            [ text "Content Editable Drops Newlines"
            , p [] [ text "Edit the div below. Put some newlines. They will not be in the String in the model." ]
            ]
        , div
            [ contenteditable True
            , onEdit SetTextContent
            ]
            [ text "Edit this div including some newlines" ]
        , div [ style [ ( "white-space", "pre" ) ] ] [ text model.textContent ]
        ]


init : ( Model, Cmd Msg )
init =
    ( Model "", Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
