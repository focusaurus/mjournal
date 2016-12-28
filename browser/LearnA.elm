module LearnA exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, onInput)
import Json.Decode as JD
import Events exposing (onEnter)

type Msg
    = AddTag
    | NewTagInput String


type alias Model =
    { tags : List String
    , newTag : String
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
        AddTag ->
            ( { model
                | tags = List.append model.tags [ model.newTag ]
                , newTag = ""
              }
            , Cmd.none
            )

        NewTagInput newTag ->
            ( { model | newTag = newTag }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


tagView tag =
    p [] [ text tag ]


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Learn Elm A" ]
        , input
            [ onEnter AddTag
            , onInput NewTagInput
            , value model.newTag
            ]
            []
        , div [] (List.map tagView model.tags)
        ]


init : ( Model, Cmd Msg )
init =
    ( Model [] "", Cmd.none )


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
