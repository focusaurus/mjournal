module Lab.ContentEditable exposing (main)

import Html exposing (..)
import Set


-- import Html.Events exposing (on, onInput, onClick, onWithOptions, keyCode)

import Json.Decode as JD


type Msg
    = One


type alias Model =
    { tags : Set.Set String
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        One ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        [ h1 []
            [ text "DecodeSet"
            ]
        , div [] (List.map (\t -> p [] [ text t ]) (Set.toList model.tags))
        ]


init : ( Model, Cmd Msg )
init =
    let
        tagResult =
            JD.decodeString decodeTags """[{"text":"a"},{"text":"a"},{"text":"b"}]"""

        tagSet =
            case tagResult of
                Ok tagList ->
                    Set.fromList tagList

                Err x ->
                    Set.empty
    in
        ( Model tagSet, Cmd.none )


decodeTags : JD.Decoder (List String)
decodeTags =
    (JD.list decodeTag)


decodeTag : JD.Decoder String
decodeTag =
    JD.field "text" JD.string


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
